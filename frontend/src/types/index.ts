export interface User {
  name: string;
  email: string;
  isActive: boolean;
  createdAt: number;
  contractAddress?: string;
}

export interface UserContract {
  address: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: number;
}

export interface DataSettings {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  category: 'personal' | 'financial' | 'social' | 'preferences';
  lastUpdated: string;
}

export interface Permission {
  id: string;
  appName: string;
  appIcon: string;
  permissions: string[];
  grantedAt: string;
  lastUsed: string;
  isActive: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  appName: string;
  timestamp: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSeen: string;
  isActive: boolean;
  location: string;
}
