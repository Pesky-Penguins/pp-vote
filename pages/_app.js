import React, { FC, useEffect, useMemo } from 'react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as Fathom from 'fathom-client';

import VoteProvider from '../components/VoteProvider.js';
import SolanaProvider from '../components/SolanaProvider.js';
import PenguinProvider from '../components/PenguinProvider.js';
import '../styles/globals.css';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function PPVote({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    Fathom.load('YPVSDLOF', {
      includedDomains: ['vote.pesky-penguins.com'],
    });
    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Pesky Vote</title>
      </Head>

      <SolanaProvider>
        <RecoilRoot>
          <PenguinProvider>
            <VoteProvider>
              <Component {...pageProps} />
            </VoteProvider>
          </PenguinProvider>
        </RecoilRoot>
      </SolanaProvider>
    </>
  );
}
