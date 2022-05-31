import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import {
  METAPLEX_METADATA_PROGRAM_ADDRESS,
  VOTE_PROGRAM_ADDRESS,
  NFT_CREATOR_ADDRESS,
} from '../lib/constants.js';
import {
  votesState,
  proposalsState,
  nftsState,
  needsRefreshState,
  voteDataState,
} from '../lib/state.js';
import { getMetadataForMint } from '../lib/NFTs.js';

// Keep proposal data in public/proposals/
const VALID_PROPOSALS = [
  0, // public/proposals/0.json
];

const REFRESH_INTERVAL = 1000 * 60 * 2; // Every 2 minutes

const VoteProgramAddressPubKey = new PublicKey(VOTE_PROGRAM_ADDRESS);

export default function VoteProvider({ children }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [proposals, setProposals] = useRecoilState(proposalsState);
  const [votes, setVotes] = useRecoilState(votesState);
  const [voteData, setVoteData] = useRecoilState(voteDataState);
  const needsRefresh = useRecoilValue(needsRefreshState);

  const [refreshTimer, setRefreshTiemr] = useState(0);

  const retrieve = useCallback(async () => {
    const programAccounts = await connection.getProgramAccounts(VoteProgramAddressPubKey, {
      filters: [
        { memcmp: { bytes: NFT_CREATOR_ADDRESS, offset: 116 } },
        {
          dataSize: 148,
        },
      ],
    });

    const proposalIds = programAccounts
      .map((programAccount) =>
        parseInt(new BN(programAccount.account.data.slice(100, 108), 10, 'le').toString(), 10)
      )
      .filter((pid) => VALID_PROPOSALS.includes(pid));

    const proposalsRetrieval = proposalIds.map(async (pid) => {
      const url = `/proposals/${pid}.json`;
      let proposalInfo = null;
      try {
        const proposalInfoRequest = await fetch(url);
        proposalInfo = JSON.parse(await proposalInfoRequest.text());
      } catch (e) {}

      return {
        url,
        id: pid,
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
  }, [connection, setProposals, setVotes]);

  useEffect(() => {
    if (!connection) {
      return;
    }
    retrieve();
  }, [connection, refreshTimer, needsRefresh, retrieve]);

  useEffect(() => {
    const interval = setInterval(
      () => setRefreshTiemr((oldTimer) => oldTimer + 1),
      REFRESH_INTERVAL
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!(votes && votes.length > 0 && publicKey)) {
      return;
    }
    async function retrieve() {
      const nftData = await Promise.all(
        votes.map(async (vote) => {
          const data = await getMetadataForMint(vote.mint);
          return { mint: vote.mint, data, vote };
        })
      );
      setVoteData(nftData);
    }
    retrieve();
  }, [votes, publicKey, setVoteData]);

  /*
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
  */

  return children;
}
