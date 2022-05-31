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
          <Image
            src="/pesky-opensea-banner.png"
            layout="fill"
            objectFit="contain"
            alt="Penguin Panorama"
          />
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
      <div className="my-2 p-2 max-w-screen-md">
        <div className="card md:card-side bg-base-200 shadow-xl p-0 md:px-4">
          <figure>
            <Image src="/nfp.png" alt="NFP" width={300} height={300} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">A note about fees</h2>
            <p>
              Every Penguin who votes becomes a{' '}
              <span className="font-semibold">registered voter</span>.
            </p>
            <p>
              The first time you vote, data account(s) will be created on the blockchain, one for
              each Penguin. This <b>one-time</b> data storage fee will cost approx.{' '}
              <span className="font-mono">0.0017</span> <span className="font-mono">SOL</span>{' '}
              <u>per Penguin</u>.
            </p>
            <p>
              Subsequent votes will be registered in the Penguin&apos;s existing data account; all
              future votes will cost only tx fees.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
