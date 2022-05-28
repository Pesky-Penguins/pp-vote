import Image from 'next/image';

import { useRecoilValue } from 'recoil';
import { votesState, proposalsState, nftsState } from '../lib/state.js';

import Toolbar from '../components/Toolbar.js';

export default function Home() {
  const nfts = useRecoilValue(nftsState);

  return (
    <div className="flex flex-col">
      <Toolbar className="relative" />
      <h1 className="text-5xl">noot noot</h1>
      <div className="flex flex-wrap max-w-screen-md">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="flex flex-col">
            <img src={nft.image} height={400} width={400} />
            <p>{nft.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
