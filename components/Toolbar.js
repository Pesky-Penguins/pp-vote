import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getPubkeyShorthand } from '../lib/blockchain.js';

export default function Toolbar() {
  const { publicKey } = useWallet();

  const pubkeyShorthand = useMemo(() => {
    const [start, end] = getPubkeyShorthand(publicKey);
    return (
      <span className="font-mono font-light">
        {start}&hellip;{end}
      </span>
    );
  }, [publicKey]);

  return (
    <div className="flex py-2 px-4 w-full justify-between items-center">
      <p className="pt-3 font-lucky text-3xl md:text-5xl">Pesky Vote</p>
      <div className="bg-blue-800">
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
