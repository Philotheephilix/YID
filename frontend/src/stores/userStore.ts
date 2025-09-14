import { create } from 'zustand';
import { User, UserContract } from '@/types';

interface UserState {
  user: User | null;
  userContract: UserContract | null;
  isConnected: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserContract: (contract: UserContract | null) => void;
  setConnected: (connected: boolean) => void;
  setWalletAddress: (address: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userContract: null,
  isConnected: false,
  walletAddress: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setUserContract: (userContract) => set({ userContract }),
  setConnected: (isConnected) => set({ isConnected }),
  setWalletAddress: (walletAddress) => set({ walletAddress }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({
    user: null,
    userContract: null,
    isConnected: false,
    walletAddress: null,
    isLoading: false,
    error: null,
  }),
}));
