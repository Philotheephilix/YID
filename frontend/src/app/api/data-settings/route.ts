import { NextRequest, NextResponse } from 'next/server';

// Mock data store (in a real app, this would be a database)
let mockDataSettings = [
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

export async function GET() {
  return NextResponse.json(mockDataSettings);
}

export async function PUT(request: NextRequest) {
  try {
    const { id, isEnabled } = await request.json();
    
    const settingIndex = mockDataSettings.findIndex(s => s.id === id);
    if (settingIndex === -1) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    mockDataSettings[settingIndex] = {
      ...mockDataSettings[settingIndex],
      isEnabled,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(mockDataSettings[settingIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
