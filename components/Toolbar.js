import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getPubkeyShorthand } from '../lib/blockchain.js';

export default function Toolbar() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const pubkeyShorthand = useMemo(() => {
    const [start, end] = getPubkeyShorthand(publicKey);
    return (
      <span className="font-mono font-light">
        {start}&hellip;{end}
      </span>
    );
  }, [publicKey]);

  console.log('my shorthand is', pubkeyShorthand);

  return (
    <div className="flex py-2 px-4 justify-between items-center">
      <p className="pt-3 font-lucky text-2xl md:text-3xl">Pesky Vote</p>
      <div>
        {publicKey ? (
          <WalletDisconnectButton>
            <div className="flex flex-col leading-snug">
              <p>Disconnect</p>
              <p className="text-sm font-mono">{pubkeyShorthand}</p>
            </div>
          </WalletDisconnectButton>
        ) : (
          <WalletMultiButton />
        )}
      </div>
    </div>
  );
}
