// Meteora DBC Configuration
// This will be updated once we integrate the actual Meteora SDK

export const METEORA_CONFIG = {
  PROGRAM_ID: process.env.METEORA_PROGRAM_ID || 'MeteoraDBCProgramId',
  FEE_RATE: 0.01, // 1% fee
  MIN_LIQUIDITY: 1000000, // Minimum SOL liquidity required
  MAX_LIQUIDITY: 1000000000, // Maximum SOL liquidity
};

// Bonding curve parameters
export const BONDING_CURVE_PARAMS = {
  // Linear bonding curve: price = basePrice + (supply * priceIncrement)
  BASE_PRICE: 0.000001, // Base price in SOL per token
  PRICE_INCREMENT: 0.0000001, // Price increase per token
  MAX_SUPPLY: 1000000000, // Maximum token supply
};

// Pool statuses
export enum PoolStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Trading limits
export const TRADING_LIMITS = {
  MIN_TRADE_AMOUNT: 0.001, // Minimum SOL amount for trades
  MAX_TRADE_AMOUNT: 10, // Maximum SOL amount for trades
  DAILY_TRADE_LIMIT: 100, // Maximum SOL per day per user
};
