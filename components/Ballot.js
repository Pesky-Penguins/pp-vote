import { useCallback, useEffect, useMemo, useState } from 'react';
import { chunk } from 'lodash-es';
import { parseISO, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmRawTransaction,
} from '@solana/web3.js';
import BN from 'bn.js';
import Base58 from 'bs58';

import { useRecoilState, useRecoilValue } from 'recoil';
import {
  isLoadingNftsState,
  myVotesState,
  needsRefreshState,
  nftsState,
  remainingVotesState,
  resultsState,
  votesState,
} from '../lib/state.js';

import { toU64Le } from '../lib/blockchain.js';
import {
  METAPLEX_METADATA_PROGRAM_ADDRESS,
  VOTE_PROGRAM_ADDRESS,
  NFT_CREATOR_ADDRESS,
} from '../lib/constants.js';

import LoadingSpinner from './LoadingSpinner.js';
import PersonalVoteStats from './PersonalVoteStats.js';
import ResultsProgress, { ALIVE_PENGUINS } from './ResultsProgress.js';

const BATCH_SIZE = 15;

const MetaplexMetadataProgramAddressPubKey = new PublicKey(METAPLEX_METADATA_PROGRAM_ADDRESS);
const VoteProgramAddressPubKey = new PublicKey(VOTE_PROGRAM_ADDRESS);
const CreatorAddressPublicKey = new PublicKey(NFT_CREATOR_ADDRESS);

export default function Ballot({ id, ballot, options, endDate }) {
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [isVotingActionInProgress, setVotingActionInProgress] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useRecoilState(needsRefreshState);
  const nfts = useRecoilValue(nftsState);
  const votes = useRecoilValue(votesState);
  const myVotes = useRecoilValue(myVotesState);
  const remainingVotes = useRecoilValue(remainingVotesState);
  const results = useRecoilValue(resultsState);
  const isLoadingNfts = useRecoilValue(isLoadingNftsState);

  const { publicKey, sendTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();

  const hasExpired = useMemo(() => isPast(parseISO(endDate)), [endDate]);

  const tokenIds = useMemo(
    () => remainingVotes[id]?.map((nft) => new PublicKey(nft)) || [],
    [id, remainingVotes]
  );

  const toggleRefresh = useCallback(() => {
    setNeedsRefresh((old) => old + 1);
  }, [setNeedsRefresh]);

  const castBatchedVotes = useCallback(
    async (voteIdString, vote) => {
      if (tokenIds <= BATCH_SIZE) {
        return castVote(tokenIds, voteIdString, vote);
      }

      const batches = chunk(tokenIds, BATCH_SIZE);
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        toast.info(`Submitting tx ${i + 1} of ${batches.length}`);
        await castVote(batch, voteIdString, vote);
        toggleRefresh();
      }
      // toast.success('Voting complete! 🎉');
    },
    [tokenIds, castVote, toggleRefresh]
  );

  const castVote = useCallback(
    async (tokens, voteIdString, vote) => {
      if (!publicKey) {
        return;
      }

      setVotingActionInProgress(true);
      const voteId = parseInt(voteIdString, 10);
      let voteInstructions = [];
      for (let mintTokenId of tokens) {
        const token_key = (await connection.getTokenLargestAccounts(mintTokenId)).value[0].address;

        const meta_key = (
          await PublicKey.findProgramAddress(
            [
              new Uint8Array([109, 101, 116, 97, 100, 97, 116, 97]),
              MetaplexMetadataProgramAddressPubKey.toBuffer(),
              mintTokenId.toBuffer(),
            ],
            MetaplexMetadataProgramAddressPubKey
          )
        )[0];
        const auth_key = (
          await PublicKey.findProgramAddress(
            [mintTokenId.toBuffer(), toU64Le(voteId)],
            VoteProgramAddressPubKey
          )
        )[0];
        const vote_auth_key = (
          await PublicKey.findProgramAddress(
            [CreatorAddressPublicKey.toBuffer(), toU64Le(voteId)],
            VoteProgramAddressPubKey
          )
        )[0];
        const sys_key = new PublicKey('11111111111111111111111111111111');

        let account_0 = {
            pubkey: publicKey,
            isSigner: true,
            isWritable: true,
          },
          account_1 = {
            pubkey: mintTokenId,
            isSigner: false,
            isWritable: false,
          },
          account_2 = { pubkey: token_key, isSigner: false, isWritable: false },
          account_3 = { pubkey: meta_key, isSigner: false, isWritable: false },
          account_4 = { pubkey: auth_key, isSigner: false, isWritable: true },
          account_5 = { pubkey: sys_key, isSigner: false, isWritable: false },
          account_6 = {
            pubkey: vote_auth_key,
            isSigner: false,
            isWritable: false,
          };

        const instruction = new TransactionInstruction({
          keys: [account_0, account_1, account_2, account_3, account_4, account_5, account_6],
          programId: VoteProgramAddressPubKey,
          data: Buffer.from(
            new Uint8Array(
              [1].concat(Array.from(toU64Le(voteId))).concat(Array.from(toU64Le(vote)))
            )
          ),
        });
        voteInstructions.push(instruction);
      }

      const chunkedInstructions = Array.from(
        { length: Math.ceil(voteInstructions.length / 5) },
        (v, i) => voteInstructions.slice(i * 5, i * 5 + 5)
      );
      const transactionArr = [];
      for (let txns of chunkedInstructions) {
        let transaction = new Transaction();
        for (let ins of txns) {
          transaction.add(ins);
        }
        transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        transaction.feePayer = publicKey;
        transactionArr.push(transaction);
      }
      let errorMessage = '';
      if (signAllTransactions) {
        try {
          console.log('transactionArr', transactionArr);
          const txns = await signAllTransactions(transactionArr);
          const sendPromises = txns.map((txn) =>
            connection.sendRawTransaction(txn.serialize(), { skipPreflight: true, maxRetries: 100 })
          );
          const result = await Promise.all(sendPromises);

          const confirmPromises = result.map((tx) =>
            connection.confirmTransaction(tx, 'finalized')
          );
          const confirmResult = await Promise.all(confirmPromises);
          console.log('confirmed result:', confirmResult);
          console.log('tx id:', result);
          if (confirmResult[0]?.value?.err?.InstructionError?.length) {
            errorMessage = 'Failed to record vote. Please try again.';
          }
        } catch (err) {
          console.error(err);
          errorMessage = err;
          setVotingActionInProgress(false);
        }
      } else {
        for (let transaction of transactionArr) {
          try {
            const signature = await sendTransaction(transaction, connection, {
              skipPreflight: true,
            });
            const result = await connection.confirmTransaction(signature, 'finalized');
          } catch (e) {
            const logs = e?.logs;
            let error = 'Unknown error occurred.';
            console.error(e);
            if (logs) {
              error = logs[logs.length - 3].split(' ').splice(2).join(' ');
            }
            errorMessage = e;
            setVotingActionInProgress(false);
          }
        }
      }

      setVotingActionInProgress(false);
      // setSelectedNFTMintAddress([]);
      if (errorMessage !== '') {
        toast.error(errorMessage);
      } else {
        toast.success('Congratulations! Your vote was recorded.');
      }
    },
    [connection, publicKey, sendTransaction, signAllTransactions]
  );

  return (
    <div className="card w-full bg-neutral text-neutral-content">
      <div className="card-body items-center text-center p-4 md:p-6">
        <h2 className="card-title font-semibold text-2xl">{ballot}</h2>
        <p className="mt-4 text-xl font-light">
          <span className="font-mono">{votes.length}</span> <span className="">Votes</span> (
          <span className="font-mono">{((votes.length / ALIVE_PENGUINS) * 100).toFixed(1)}</span>%
          of Penguins)
        </p>
        <ResultsProgress
          className="flex flex-col items-center w-full my-4 mb-2"
          proposalId={id}
          votes={votes}
          results={results}
          options={options}
        />

        {isVotingActionInProgress && <LoadingSpinner />}
        {!hasExpired && !isVotingActionInProgress && publicKey && remainingVotes[id]?.length > 0 && (
          <div className="flex flex-col w-full">
            <div className="card-actions flex-col-reverse md:flex-row items-center justify-center justify-between px-2">
              {options.map((option, val) => {
                const { text, classes } = option;
                return (
                  <button
                    key={text}
                    className={`btn ${classes} w-72 mt-4 md:w-auto md:mt-0`}
                    onClick={() => castBatchedVotes(id, val)}
                  >
                    {text}
                  </button>
                );
              })}
            </div>
            <div className="my-4 mt-6">
              <p className="font-light text-lg">
                Voting will cast a ballot for <u>every Penguin</u> in this wallet.
              </p>
            </div>
            <PersonalVoteStats id={id} myVotes={myVotes} remainingVotes={remainingVotes} />
          </div>
        )}
        {isLoadingNfts && !hasExpired && (
          <div className="flex">
            <p className="font-light text-2xl mr-2">Loading Penguins...</p>
            <LoadingSpinner />
          </div>
        )}
        {!isLoadingNfts &&
          !hasExpired &&
          !isVotingActionInProgress &&
          publicKey &&
          nfts?.length < 1 && (
            <p className="font-light text-2xl">[ Pesky Penguins are required to vote ]</p>
          )}
        {!hasExpired && !publicKey && (
          <p className="font-light text-2xl">Connect your wallet to vote</p>
        )}
        {nfts?.length > 0 && remainingVotes[id]?.length === 0 && (
          <p className="font-light text-2xl">
            {nfts?.length === 1
              ? 'Your penguin has voted!'
              : nfts?.length === 2
              ? 'Both of your penguins have voted!'
              : `All ${nfts?.length} of your penguins have voted!`}
          </p>
        )}
      </div>
    </div>
  );
}
