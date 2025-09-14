import { NextResponse } from 'next/server';

// Mock permissions data
const mockPermissions = [
  {
    id: '1',
    appName: 'DeFi Protocol',
    appIcon: '🦄',
    permissions: ['Read wallet balance', 'Execute transactions'],
    grantedAt: '2024-01-10T09:30:00Z',
    lastUsed: '2024-01-15T14:20:00Z',
    isActive: true,
  },
  {
    id: '2',
    appName: 'NFT Marketplace',
    appIcon: '🎨',
    permissions: ['View NFTs', 'Transfer NFTs'],
    grantedAt: '2024-01-08T16:45:00Z',
    lastUsed: '2024-01-12T11:15:00Z',
    isActive: true,
  },
  {
    id: '3',
    appName: 'Social DApp',
    appIcon: '👥',
    permissions: ['Read profile', 'Post updates'],
    grantedAt: '2024-01-05T13:20:00Z',
    lastUsed: '2024-01-14T10:30:00Z',
    isActive: false,
  },
];

export async function GET() {
  return NextResponse.json(mockPermissions);
}
