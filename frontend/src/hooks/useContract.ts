import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useUserStore } from '@/stores/userStore';
import YIDFactoryABI from '@/contracts/YIDFactory.json';
import YIDUserABI from '@/contracts/YIDUser.json';


// Import types to make global declarations available
import "@/types";
// Sepolia Network Configuration
const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const YID_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_YID_FACTORY_ADDRESS;

export const useContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const { walletAddress, setError } = useUserStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  useEffect(() => {
    if (provider && walletAddress) {
      provider.getSigner().then(setSigner).catch(console.error);
    }
  }, [provider, walletAddress]);

  useEffect(() => {
    checkNetwork();
  }, [provider]);

  // Check user registration when network becomes correct and wallet is connected
  useEffect(() => {
    if (isCorrectNetwork && walletAddress && provider) {
      checkUserRegistration(walletAddress);
    }
  }, [isCorrectNetwork, walletAddress, provider]);

  const checkNetwork = async () => {
    if (!provider) return;

    try {
      const network = await provider.getNetwork();
      const isSepolia = Number(network.chainId) === SEPOLIA_CHAIN_ID;
      setIsCorrectNetwork(isSepolia);
      
      if (!isSepolia) {
        setError(`Please switch to Sepolia testnet (Chain ID: ${SEPOLIA_CHAIN_ID})`);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Error checking network:', error);
      setError('Failed to check network');
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [SEPOLIA_RPC_URL],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          setError('Failed to add Sepolia network');
        }
      } else {
        console.error('Error switching to Sepolia:', switchError);
        setError('Failed to switch to Sepolia network');
      }
    }
  };

  const validateContractAddress = () => {
    if (!YID_FACTORY_ADDRESS || YID_FACTORY_ADDRESS === '0x...' || !ethers.isAddress(YID_FACTORY_ADDRESS)) {
      throw new Error('YID Factory contract address not configured. Please deploy contracts and update .env.local');
    }
    return YID_FACTORY_ADDRESS;
  };

  const getUserContract = async (userAddress: string) => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    try {
      const factoryAddress = validateContractAddress();
      
      const factory = new ethers.Contract(
        factoryAddress,
        YIDFactoryABI.abi,
        provider
      );

      const contractAddress = await factory.getUserContract(userAddress);
      return contractAddress;
    } catch (error) {
      console.error('Error getting user contract:', error);
      throw error;
    }
  };

  const getUserInfo = async (contractAddress: string) => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    try {
      const userContract = new ethers.Contract(
        contractAddress,
        YIDUserABI.abi,
        provider
      );

      const [name, email, isActive, createdAt] = await userContract.getUserInfo();
      
      return {
        name,
        email,
        isActive,
        createdAt: Number(createdAt),
        contractAddress,
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  };

  // Check if user is already registered when wallet connects
  const checkUserRegistration = async (userAddress: string) => {
    try {
      if (!provider || !isCorrectNetwork) return false;

      const factoryAddress = validateContractAddress();
      
      const factory = new ethers.Contract(
        factoryAddress,
        YIDFactoryABI.abi,
        provider
      );

      const contractAddress = await factory.getUserContract(userAddress);
      
      // Check if contract address is valid (not zero address)
      if (!contractAddress || contractAddress === ethers.ZeroAddress) {
        return false;
      }

      // Get user info from the contract
      const userInfo = await getUserInfo(contractAddress);
      
      if (userInfo) {
        // Set user data in store
        const { setUser, setUserContract } = useUserStore.getState();
        
        setUser({
          name: userInfo.name,
          email: userInfo.email,
          isActive: userInfo.isActive,
          createdAt: userInfo.createdAt,
          contractAddress: userInfo.contractAddress,
        });

        setUserContract({
          address: userInfo.contractAddress,
          name: userInfo.name,
          email: userInfo.email,
          isActive: userInfo.isActive,
          createdAt: userInfo.createdAt,
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        useUserStore.getState().setWalletAddress(accounts[0]);
        useUserStore.getState().setConnected(true);
        
        // Check network after connecting
        await checkNetwork();
        
        // Check if user is already registered and auto-load their data
        if (isCorrectNetwork) {
          await checkUserRegistration(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    }
  };

  const deployUserContract = async (name: string, email: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Sepolia testnet');
    }

    try {
      const factoryAddress = validateContractAddress();
      
      const factory = new ethers.Contract(
        factoryAddress,
        YIDFactoryABI.abi,
        signer
      );

      const tx = await factory.deployUserContract(name, email);
      await tx.wait();

      // Get the deployed contract address
      const userContractAddress = await factory.getUserContract(walletAddress);
      
      return userContractAddress;
    } catch (error) {
      console.error('Error deploying user contract:', error);
      throw error;
    }
  };

  const updateUserInfo = async (contractAddress: string, name: string, email: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Sepolia testnet');
    }

    try {
      const userContract = new ethers.Contract(
        contractAddress,
        YIDUserABI.abi,
        signer
      );

      const tx = await userContract.updateUser(name, email);
      await tx.wait();
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  };

  const deactivateUser = async (contractAddress: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectNetwork) {
      throw new Error('Please switch to Sepolia testnet');
    }

    try {
      const userContract = new ethers.Contract(
        contractAddress,
        YIDUserABI.abi,
        signer
      );

      const tx = await userContract.deactivate();
      await tx.wait();
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  };

  return {
    provider,
    signer,
    isCorrectNetwork,
    connectWallet,
    switchToSepolia,
    deployUserContract,
    getUserContract,
    getUserInfo,
    updateUserInfo,
    deactivateUser,
    checkUserRegistration,
  };
};
