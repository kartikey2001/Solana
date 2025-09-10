'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { setWalletAddress, clearWalletAddress } from '../lib/api';

const WalletConnect: React.FC = () => {
  const { connected, publicKey } = useWallet();

  React.useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      clearWalletAddress();
    }
  }, [connected, publicKey]);

  return (
    <div className="flex items-center space-x-4">
      {connected ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </span>
        </div>
      ) : (
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-colors" />
      )}
    </div>
  );
};

export default WalletConnect;
