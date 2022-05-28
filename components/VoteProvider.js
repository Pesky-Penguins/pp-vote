import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import {
  METAPLEX_METADATA_PROGRAM_ADDRESS,
  VOTE_PROGRAM_ADDRESS,
  NFT_CREATOR_ADDRESS,
} from '../lib/constants.js';
import { votesState, proposalsState, nftsState, voteDataState } from '../lib/state.js';
import { getNFTsForWallet, getNFTDataForMint } from '../lib/NFTs.js';

const VoteProgramAddressPubKey = new PublicKey(VOTE_PROGRAM_ADDRESS);

export default function VoteProvider({ children }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [votes, setVotes] = useRecoilState(votesState);
  const [proposals, setProposals] = useRecoilState(proposalsState);
  const [voteData, setVoteData] = useRecoilState(voteDataState);
  const nfts = useRecoilValue(nftsState);

  useEffect(() => {
    console.log(`Fetching votes for ${NFT_CREATOR_ADDRESS}...`);

    async function retrieve() {
      const proposalAccounts = await connection.getProgramAccounts(VoteProgramAddressPubKey, {
        filters: [
          { memcmp: { bytes: NFT_CREATOR_ADDRESS, offset: 116 } },
          {
            dataSize: 148,
          },
        ],
      });

      console.log(`Got ${proposalAccounts.length} proposalAccounts:`);

      const proposalsRetrieval = proposalAccounts.map(async (programAccount) => {
        const proposalId = new BN(programAccount.account.data.slice(100, 108), 10, 'le').toString();
        const url = `/proposals/${proposalId}.json`;
        let proposalInfo = null;
        try {
          const proposalInfoRequest = await fetch(url);
          proposalInfo = JSON.parse(await proposalInfoRequest.text());
        } catch (e) {}

        return {
          url,
          id: proposalId,
          info: proposalInfo,
        };
      });

      const proposals = (await Promise.all(proposalsRetrieval)).filter((proposal) => {
        return !!proposal.info;
      });

      const voteAccounts = await connection.getProgramAccounts(VoteProgramAddressPubKey, {
        filters: [{ memcmp: { bytes: NFT_CREATOR_ADDRESS, offset: 32 } }, { dataSize: 116 }],
      });

      // console.log(`Got ${voteAccounts.length} voteAccounts`);

      const voteData = voteAccounts.map((e) => {
        const mint = new PublicKey(e.account.data.slice(0, 32)).toString(),
          creator = new PublicKey(e.account.data.slice(32, 64)).toString(),
          voter = new PublicKey(e.account.data.slice(64, 96)).toString(),
          vote = new BN(e.account.data.slice(96, 104), 10, 'le').toString(),
          time = new Date(
            new BN(
              e.account.data[104] +
                (e.account.data[105] << 8) +
                (e.account.data[106] << 16) +
                (e.account.data[107] << 24)
            ).toNumber() * 1000
          ),
          vote_option = new BN(e.account.data.slice(108), 10, 'le').toString();
        return { voter, creator, mint, vote, vote_option, time };
      });

      // console.log(`Got ${voteData.length} votes`);

      setProposals(proposals);
      setVotes(voteData);
    }
    retrieve();
  }, [connection, publicKey]);

  useEffect(() => {
    if (!(votes && votes.length > 0 && publicKey)) {
      return;
    }
    async function retrieve() {
      const nftData = await Promise.all(
        votes.map(async (vote) => {
          const data = await getNFTDataForMint(connection, vote.mint);
          return { mint: vote.mint, data };
        })
      );
      // console.log('nftData', nftData);
      setVoteData(nftData);
    }
    retrieve();
  }, [votes, publicKey]);

  // -- Debugging; feel free to remove
  useEffect(() => {
    console.log(`Have ${proposals.length} proposals:`, proposals);
  }, [proposals]);

  // -- Debugging; feel free to remove
  useEffect(() => {
    console.log(`Have ${votes.length} votes:`, votes);
  }, [votes]);

  // -- Debugging; feel free to remove
  useEffect(() => {
    console.log(`Have ${voteData.length} ballots:`, voteData);
  }, [voteData]);

  return children;
}
