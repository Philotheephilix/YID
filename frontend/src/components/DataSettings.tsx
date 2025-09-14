import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSettings } from '@/types';

// Mock data for demonstration
const mockDataSettings: DataSettings[] = [
  {
    id: '1',
    name: 'Personal Information',
    description: 'Name, email, and basic profile data',
    isEnabled: true,
    category: 'personal',
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Financial Data',
    description: 'Wallet addresses and transaction history',
    isEnabled: false,
    category: 'financial',
    lastUpdated: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    name: 'Social Connections',
    description: 'Social media profiles and connections',
    isEnabled: true,
    category: 'social',
    lastUpdated: '2024-01-13T09:20:00Z',
  },
  {
    id: '4',
    name: 'App Preferences',
    description: 'UI preferences and notification settings',
    isEnabled: true,
    category: 'preferences',
    lastUpdated: '2024-01-12T14:15:00Z',
  },
];

export const DataSettingsComponent: React.FC = () => {
  const [settings, setSettings] = useState<DataSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSettings(mockDataSettings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleSetting = async (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { 
              ...setting, 
              isEnabled: !setting.isEnabled,
              lastUpdated: new Date().toISOString()
            }
          : setting
      )
    );

    // Simulate API call
    try {
      const response = await fetch('/api/data-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isEnabled: !settings.find(s => s.id === id)?.isEnabled }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert on error
      setSettings(prev => 
        prev.map(setting => 
          setting.id === id 
            ? { 
                ...setting, 
                isEnabled: !setting.isEnabled,
                lastUpdated: new Date().toISOString()
              }
            : setting
        )
      );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'preferences': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Settings</CardTitle>
          <CardDescription>Loading your data preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Settings</CardTitle>
        <CardDescription>
          Control what data you share and how it's used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium">{setting.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(setting.category)}`}>
                    {setting.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {setting.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(setting.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${setting.isEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {setting.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Button
                  variant={setting.isEnabled ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => toggleSetting(setting.id)}
                >
                  {setting.isEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
