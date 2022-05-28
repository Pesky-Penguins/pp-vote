import { atom } from 'recoil';

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
