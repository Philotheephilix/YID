import React from 'react';
import { Button } from '@/components/ui/button';
import { useContract } from '@/hooks/useContract';
import { useUserStore } from '@/stores/userStore';

export const WalletConnect: React.FC = () => {
  const { connectWallet, switchToSepolia, isCorrectNetwork } = useContract();
  const { isConnected, walletAddress, isLoading, error } = useUserStore();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground">
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        {!isCorrectNetwork && (
          <Button variant="destructive" size="sm" onClick={handleSwitchNetwork}>
            Switch to Sepolia
          </Button>
        )}
        <Button variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
