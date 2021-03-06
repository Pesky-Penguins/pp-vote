import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import {
  METAPLEX_METADATA_PROGRAM_ADDRESS,
  VOTE_PROGRAM_ADDRESS,
  NFT_CREATOR_ADDRESS,
} from '../lib/constants.js';
import { nftsState, isLoadingNftsState } from '../lib/state.js';
import { getNFTsForWallet } from '../lib/NFTs.js';

export default function PenguinProvider({ children }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [nfts, setNfts] = useRecoilState(nftsState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingNftsState);

  useEffect(() => {
    if (!publicKey) {
      setNfts([]); // Clear NFTs if we're not logged in
      return;
    }
    async function retrieve() {
      setIsLoading(true);
      if (publicKey) {
        const myNfts = await getNFTsForWallet(
          connection,
          new PublicKey(publicKey),
          NFT_CREATOR_ADDRESS
        );
        setNfts(myNfts);
      }
      setIsLoading(false);
    }
    retrieve();
  }, [connection, publicKey, setIsLoading, setNfts]);

  return children;
}
