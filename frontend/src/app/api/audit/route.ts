import { NextResponse } from 'next/server';

// Mock audit trail data
const mockAuditEntries = [
  {
    id: '1',
    action: 'Data Access',
    appName: 'DeFi Protocol',
    timestamp: '2024-01-15T14:20:00Z',
    details: 'Accessed wallet balance for transaction',
    status: 'success',
  },
  {
    id: '2',
    action: 'Permission Granted',
    appName: 'NFT Marketplace',
    timestamp: '2024-01-12T11:15:00Z',
    details: 'Granted NFT transfer permissions',
    status: 'success',
  },
  {
    id: '3',
    action: 'Data Update',
    appName: 'YID Dashboard',
    timestamp: '2024-01-10T09:30:00Z',
    details: 'Updated personal information',
    status: 'success',
  },
  {
    id: '4',
    action: 'Failed Login',
    appName: 'Unknown App',
    timestamp: '2024-01-08T16:45:00Z',
    details: 'Unauthorized access attempt blocked',
    status: 'failed',
  },
  {
    id: '5',
    action: 'Permission Revoked',
    appName: 'Social DApp',
    timestamp: '2024-01-05T13:20:00Z',
    details: 'Revoked social media access permissions',
    status: 'success',
  },
];

export async function GET() {
  return NextResponse.json(mockAuditEntries);
}
