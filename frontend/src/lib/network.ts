// Sepolia Network Configuration
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const getSepoliaChainId = () => `0x${SEPOLIA_CONFIG.chainId.toString(16)}`;

export const isSepoliaNetwork = (chainId: number) => {
  return chainId === SEPOLIA_CONFIG.chainId;
};

export const formatChainId = (chainId: string | number) => {
  const id = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
  return id;
};
