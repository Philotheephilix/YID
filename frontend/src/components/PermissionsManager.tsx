import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission } from '@/types';

export const PermissionsManager: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokePermission = async (id: string) => {
    try {
      // In a real app, this would make an API call to revoke the permission
      setPermissions(prev => 
        prev.map(permission => 
          permission.id === id 
            ? { ...permission, isActive: false }
            : permission
        )
      );
    } catch (error) {
      console.error('Error revoking permission:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>App Permissions</CardTitle>
          <CardDescription>Loading your app permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Permissions</CardTitle>
        <CardDescription>
          Manage permissions granted to third-party applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{permission.appIcon}</div>
                <div>
                  <h3 className="font-medium">{permission.appName}</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>Granted: {new Date(permission.grantedAt).toLocaleDateString()}</p>
                    <p>Last used: {new Date(permission.lastUsed).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {permission.permissions.map((perm, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${permission.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {permission.isActive ? 'Active' : 'Revoked'}
                </span>
                {permission.isActive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokePermission(permission.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
