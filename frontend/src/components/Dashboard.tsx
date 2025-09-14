import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRegistration } from './UserRegistration';
import { UserActivation } from './UserActivation';
import { DataSettingsComponent } from './DataSettings';
import { PermissionsManager } from './PermissionsManager';
import { AuditTrail } from './AuditTrail';
import { WalletConnect } from './WalletConnect';
import { ContractStatus } from './ContractStatus';
import { useContract } from '@/hooks/useContract';
import { useUserStore } from '@/stores/userStore';

export const Dashboard: React.FC = () => {
  const { isConnected, user, userContract, error } = useUserStore();
  const { isCorrectNetwork } = useContract();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">YID Dashboard</h1>
              <p className="text-muted-foreground">Your Decentralized Identity on Sepolia</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Network Status Banner */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-800 font-medium">
                  Please switch to Sepolia testnet to use YID features
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Contract Status Warning */}
        <div className="mb-6">
          <ContractStatus />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to access your YID dashboard on Sepolia testnet
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <h3 className="font-medium text-blue-900 mb-2">Sepolia Testnet</h3>
              <p className="text-sm text-blue-800">
                This application runs on Sepolia testnet. Make sure you have Sepolia ETH for transactions.
              </p>
            </div>
            <WalletConnect />
          </div>
        ) : !isCorrectNetwork ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Wrong Network</h2>
            <p className="text-muted-foreground mb-6">
              Please switch to Sepolia testnet to continue
            </p>
            <WalletConnect />
          </div>
        ) : !user ? (
          <div className="max-w-2xl mx-auto">
            <UserRegistration />
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserActivation />
              
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Your current profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Network</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Sepolia Testnet
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataSettingsComponent />
              <PermissionsManager />
            </div>

            {/* Audit Trail Section */}
            <AuditTrail />
          </div>
        )}
      </main>
    </div>
  );
};
