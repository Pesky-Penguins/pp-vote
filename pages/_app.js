import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import * as Fathom from 'fathom-client';

import '../styles/globals.css';

const description = 'On-chain voting for the Pesky Penguins NFT Project and NootDAO';

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

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Open+Sans:wght@300;400;700&display=swap"
          rel="stylesheet"
        />

        {/* Metadata */}
        <meta name="description" content={description}></meta>
        <meta name="twitter:title" content="Pesky Penguins" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="https://twitter.com/peskypenguins" />
        <meta name="twitter:image" content="https://pesky-penguins.com/logonoot.png" />
        <meta property="og:title" content="Pesky Vote" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vote.pesky-penguins.com" />
        <meta property="og:image" content="https://pesky-penguins.com/logonoot.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
