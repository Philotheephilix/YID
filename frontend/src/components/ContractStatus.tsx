import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ContractStatus: React.FC = () => {
  const factoryAddress = process.env.NEXT_PUBLIC_YID_FACTORY_ADDRESS;
  const isConfigured = factoryAddress && factoryAddress !== '0x...' && factoryAddress.length > 10;

  if (isConfigured) {
    return null; // Don't show anything if contracts are configured
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">⚠️ Contracts Not Configured</CardTitle>
        <CardDescription className="text-yellow-700">
          The YID smart contracts need to be deployed and configured before you can use this application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-800">
          <p className="mb-2">To fix this:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Deploy the YID contracts to Sepolia testnet</li>
            <li>Copy the deployed YIDFactory contract address</li>
            <li>Update <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_YID_FACTORY_ADDRESS</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
            <li>Restart the development server</li>
          </ol>
        </div>
        
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">Current configuration:</p>
          <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
            NEXT_PUBLIC_YID_FACTORY_ADDRESS={factoryAddress || 'Not set'}
          </code>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://sepolia.etherscan.io/', '_blank')}
          >
            View Sepolia Explorer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://sepoliafaucet.com/', '_blank')}
          >
            Get Sepolia ETH
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
