import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add wallet address to requests
export const setWalletAddress = (address: string) => {
  api.defaults.headers.common['x-wallet-address'] = address;
};

// Remove wallet address from requests
export const clearWalletAddress = () => {
  delete api.defaults.headers.common['x-wallet-address'];
};

// Token API
export const tokenAPI = {
  create: (data: {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
    description?: string;
    image?: string;
  }) => api.post('/api/token/create', data),
  
  get: (mintAddress: string) => api.get(`/api/token/${mintAddress}`),
  
  getAll: (creator?: string) => api.get('/api/token', { params: { creator } }),
};

// Pool API
export const poolAPI = {
  create: (data: {
    tokenMint: string;
    initialLiquidity: number;
  }) => api.post('/api/pool/create', data),
  
  buy: (data: {
    poolId: string;
    amount: number;
  }) => api.post('/api/pool/buy', data),
  
  sell: (data: {
    poolId: string;
    amount: number;
  }) => api.post('/api/pool/sell', data),
  
  get: (poolId: string) => api.get(`/api/pool/${poolId}`),
  
  getAll: (tokenMint?: string) => api.get('/api/pool', { params: { tokenMint } }),
};

// Dashboard API
export const dashboardAPI = {
  getTokens: () => api.get('/api/dashboard/tokens'),
  getStats: () => api.get('/api/dashboard/stats'),
  getPools: () => api.get('/api/dashboard/pools'),
};

export default api;
