import { isEmpty } from 'lodash';
import { atom, selector } from 'recoil';

export const proposalsState = atom({
  key: 'proposals',
  default: [],
});

export const nftsState = atom({
  key: 'nfts',
  default: [],
});

export const isLoadingNftsState = atom({
  key: 'isLoadingNftsState',
  default: false,
});

export const needsRefreshState = atom({
  key: 'needsRefresh',
  default: 0,
});

export const votesState = atom({
  key: 'votes',
  default: [],
});

export const voteDataState = atom({
  key: 'voteData',
  default: [],
});

export const resultsState = selector({
  key: 'resultsState',
  get: ({ get }) => {
    const votes = get(votesState);
    const proposals = get(proposalsState);
    if (!votes.length) {
      return proposals.reduce((acc, p) => {
        acc[p.id] = Object.keys(p.info.options).reduce((oAcc, selection) => {
          oAcc[selection] = 0;
          return oAcc;
        }, {});
        return acc;
      }, {});
    }
    return votes.reduce((acc, v) => {
      const { vote: proposal, vote_option: selection } = v;
      if (!acc[proposal]) {
        acc[proposal] = {};
      }
      if (!acc[proposal][selection]) {
        acc[proposal][selection] = 0;
      }
      acc[proposal][selection] = acc[proposal][selection] + 1;
      return acc;
    }, {});
  },
});

export const myVotesState = selector({
  key: 'myVotesState',
  get: ({ get }) => {
    const voteData = get(voteDataState);
    if (!voteData?.length) {
      const proposals = get(proposalsState);
      return proposals.reduce((acc, p) => {
        acc[p.id] = Object.keys(p.info.options).reduce((oAcc, selection) => {
          oAcc[selection] = [];
          return oAcc;
        }, {});
        return acc;
      }, {});
    }
    return (voteData || []).reduce((acc, vd) => {
      const { mint, vote } = vd;
      const { vote_option: selection, vote: proposal } = vote;
      if (!acc[proposal]) {
        acc[proposal] = {};
      }
      if (!acc[proposal][selection]) {
        acc[proposal][selection] = [];
      }
      acc[proposal][selection].push(mint);
      return acc;
    }, {});
  },
});

export const remainingVotesState = selector({
  key: 'remainingVotesState',
  get: ({ get }) => {
    const nfts = get(nftsState);
    const myVotes = get(myVotesState);
    const proposals = get(proposalsState);

    if (isEmpty(myVotes)) {
      return proposals.reduce((acc, proposal) => {
        acc[proposal.id] = nfts.map((n) => n.tokenId);
        return acc;
      }, {});
    }

    const remainingVotes = Object.entries(myVotes).reduce((acc, [proposal, votes]) => {
      const allVotes = Object.values(votes).flat();
      acc[proposal] = nfts.map((nft) => nft.tokenId).filter((tid) => !allVotes.includes(tid));
      return acc;
    }, {});
    return remainingVotes;
  },
});
