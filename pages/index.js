import Image from 'next/image';

import { useRecoilValue } from 'recoil';
import { proposalsState } from '../lib/state.js';

import LoadingSpinner from '../components/LoadingSpinner.js';
import Toolbar from '../components/Toolbar.js';
import Proposal from '../components/Proposal.js';
import Footer from '../components/Footer.js';

export default function Home() {
  const proposals = useRecoilValue(proposalsState);

  return (
    <div className="flex flex-col items-center">
      <Toolbar className="relative" />
      <div className="flex flex-col max-w-screen-md px-4 md:px-2 lg:px-0 pt-8 w-full">
        <div className="flex relative items-center justify-center w-full h-32 xs:h-40 sm:h-56">
          <Image src="/pesky-opensea-banner.png" layout="fill" objectFit="contain" />
        </div>
        <div className="h-8" />
        {(!proposals || !proposals.length) && (
          <div className="flex w-full items-center justify-center">
            <h2 className="text-3xl font-bold">Loading proposals...</h2>
            <div className="w-4" />
            <LoadingSpinner />
          </div>
        )}
        {proposals.map((p) => (
          <Proposal key={p.id} id={p.id} info={p.info} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
