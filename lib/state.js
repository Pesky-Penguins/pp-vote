import { atom, selector } from 'recoil';

export const votesState = atom({
  key: 'votes',
  default: [],
});

export const proposalsState = atom({
  key: 'proposals',
  default: [],
});

export const nftsState = atom({
  key: 'nfts',
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
    return voteData.reduce((acc, vd) => {
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
    const remainingVotes = Object.entries(myVotes).reduce((acc, [proposal, votes]) => {
      const allVotes = Object.values(votes).flat();
      acc[proposal] = nfts.map((nft) => nft.tokenId).filter((tid) => !allVotes.includes(tid));
      return acc;
    }, {});
    return remainingVotes;
  },
});
