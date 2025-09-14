import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContract } from '@/hooks/useContract';
import { useUserStore } from '@/stores/userStore';
import { formatDateTime } from '@/lib/utils';

export const UserActivation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userContract, setUserContract, setError } = useUserStore();
  const { getUserInfo, deactivateUser } = useContract();

  const handleDeactivate = async () => {
    if (!userContract?.address) return;

    setIsLoading(true);
    try {
      await deactivateUser(userContract.address);
      
      // Update local state
      setUserContract({
        ...userContract,
        isActive: false,
      });
    } catch (error) {
      console.error('Deactivation failed:', error);
      setError('Failed to deactivate account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!userContract?.address) return;

    setIsLoading(true);
    try {
      const userInfo = await getUserInfo(userContract.address);
      setUserContract({
        address: userContract.address,
        ...userInfo,
      });
    } catch (error) {
      console.error('Failed to refresh user info:', error);
      setError('Failed to refresh user information');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userContract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activation</CardTitle>
          <CardDescription>No user contract found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activation Status</CardTitle>
        <CardDescription>
          Manage your account activation status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userContract.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {userContract.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created
            </label>
            <div className="text-sm">
              {formatDateTime(userContract.createdAt)}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Contract Address
          </label>
          <div className="text-sm font-mono bg-muted p-2 rounded">
            {userContract.address}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Status'}
          </Button>
          
          {userContract.isActive && (
            <Button 
              onClick={handleDeactivate} 
              variant="destructive" 
              disabled={isLoading}
            >
              {isLoading ? 'Deactivating...' : 'Deactivate Account'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
