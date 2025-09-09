import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { connection } from '../config/solana';
import { BONDING_CURVE_PARAMS, PoolStatus, TRADING_LIMITS } from '../config/meteora';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Types
export interface PoolMetadata {
  id: string;
  tokenMint: string;
  poolAddress: string;
  status: PoolStatus;
  totalLiquidity: number; // SOL amount
  tokenReserve: number; // Token amount
  solReserve: number; // SOL amount
  currentPrice: number; // SOL per token
  totalVolume: number; // Total SOL traded
  createdAt: string;
  creator: string;
  curveParams: {
    basePrice: number;
    priceIncrement: number;
    maxSupply: number;
  };
}

export interface CreatePoolRequest {
  tokenMint: string;
  initialLiquidity: number; // SOL amount
  creator: string;
}

export interface TradeRequest {
  poolId: string;
  amount: number; // SOL amount for buy, token amount for sell
  userWallet: string;
  isBuy: boolean;
}

export class PoolService {
  private dataFile: string;

  constructor() {
    this.dataFile = path.join(__dirname, '../../data/pools.json');
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    const dataDir = path.dirname(this.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(this.dataFile, '[]');
    }
  }

  private loadPools(): PoolMetadata[] {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading pools:', error);
      return [];
    }
  }

  private savePools(pools: PoolMetadata[]): void {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(pools, null, 2));
    } catch (error) {
      console.error('Error saving pools:', error);
      throw new Error('Failed to save pool data');
    }
  }

  // Calculate price using linear bonding curve
  private calculatePrice(tokenSupply: number): number {
    return BONDING_CURVE_PARAMS.BASE_PRICE + (tokenSupply * BONDING_CURVE_PARAMS.PRICE_INCREMENT);
  }

  // Calculate tokens received for SOL amount
  private calculateTokensForSol(solAmount: number, currentSupply: number): number {
    // Simple linear calculation - in real implementation, this would be more complex
    const price = this.calculatePrice(currentSupply);
    return Math.floor(solAmount / price);
  }

  // Calculate SOL received for token amount
  private calculateSolForTokens(tokenAmount: number, currentSupply: number): number {
    const price = this.calculatePrice(currentSupply - tokenAmount);
    return tokenAmount * price;
  }

  async createPool(request: CreatePoolRequest): Promise<{ pool: PoolMetadata; txHash: string }> {
    try {
      // Validate initial liquidity
      if (request.initialLiquidity < TRADING_LIMITS.MIN_TRADE_AMOUNT) {
        throw new Error(`Initial liquidity must be at least ${TRADING_LIMITS.MIN_TRADE_AMOUNT} SOL`);
      }

      // Generate pool address (in real implementation, this would be derived from program)
      const poolAddress = new PublicKey().toString(); // Placeholder

      // Calculate initial token amount based on bonding curve
      const initialTokenAmount = this.calculateTokensForSol(request.initialLiquidity, 0);

      const poolMetadata: PoolMetadata = {
        id: uuidv4(),
        tokenMint: request.tokenMint,
        poolAddress,
        status: PoolStatus.ACTIVE,
        totalLiquidity: request.initialLiquidity,
        tokenReserve: initialTokenAmount,
        solReserve: request.initialLiquidity,
        currentPrice: this.calculatePrice(initialTokenAmount),
        totalVolume: 0,
        createdAt: new Date().toISOString(),
        creator: request.creator,
        curveParams: {
          basePrice: BONDING_CURVE_PARAMS.BASE_PRICE,
          priceIncrement: BONDING_CURVE_PARAMS.PRICE_INCREMENT,
          maxSupply: BONDING_CURVE_PARAMS.MAX_SUPPLY,
        },
      };

      // Save pool to storage
      const pools = this.loadPools();
      pools.push(poolMetadata);
      this.savePools(pools);

      // In real implementation, this would be the actual transaction hash
      const txHash = 'simulated_tx_hash_' + Date.now();

      console.log(`✅ Pool created successfully for token ${request.tokenMint}`);
      console.log(`📍 Pool Address: ${poolAddress}`);
      console.log(`💰 Initial Liquidity: ${request.initialLiquidity} SOL`);

      return { pool: poolMetadata, txHash };
    } catch (error) {
      console.error('Error creating pool:', error);
      throw new Error(`Failed to create pool: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async buyToken(request: TradeRequest): Promise<{ txHash: string; tokensReceived: number; newPrice: number }> {
    try {
      const pools = this.loadPools();
      const pool = pools.find(p => p.id === request.poolId);
      
      if (!pool) {
        throw new Error('Pool not found');
      }

      if (pool.status !== PoolStatus.ACTIVE) {
        throw new Error('Pool is not active');
      }

      // Validate trade amount
      if (request.amount < TRADING_LIMITS.MIN_TRADE_AMOUNT) {
        throw new Error(`Trade amount must be at least ${TRADING_LIMITS.MIN_TRADE_AMOUNT} SOL`);
      }

      // Calculate tokens to receive
      const tokensReceived = this.calculateTokensForSol(request.amount, pool.tokenReserve);
      
      if (tokensReceived <= 0) {
        throw new Error('Insufficient amount for trade');
      }

      // Update pool state
      pool.solReserve += request.amount;
      pool.tokenReserve -= tokensReceived;
      pool.totalVolume += request.amount;
      pool.currentPrice = this.calculatePrice(pool.tokenReserve);

      // Save updated pool
      this.savePools(pools);

      // In real implementation, this would be the actual transaction hash
      const txHash = 'simulated_buy_tx_' + Date.now();

      console.log(`✅ Buy order executed: ${tokensReceived} tokens for ${request.amount} SOL`);
      console.log(`💰 New price: ${pool.currentPrice} SOL per token`);

      return { 
        txHash, 
        tokensReceived, 
        newPrice: pool.currentPrice 
      };
    } catch (error) {
      console.error('Error buying token:', error);
      throw new Error(`Failed to buy token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sellToken(request: TradeRequest): Promise<{ txHash: string; solReceived: number; newPrice: number }> {
    try {
      const pools = this.loadPools();
      const pool = pools.find(p => p.id === request.poolId);
      
      if (!pool) {
        throw new Error('Pool not found');
      }

      if (pool.status !== PoolStatus.ACTIVE) {
        throw new Error('Pool is not active');
      }

      // Calculate SOL to receive
      const solReceived = this.calculateSolForTokens(request.amount, pool.tokenReserve);
      
      if (solReceived <= 0) {
        throw new Error('Insufficient tokens for trade');
      }

      // Update pool state
      pool.solReserve -= solReceived;
      pool.tokenReserve += request.amount;
      pool.totalVolume += solReceived;
      pool.currentPrice = this.calculatePrice(pool.tokenReserve);

      // Save updated pool
      this.savePools(pools);

      // In real implementation, this would be the actual transaction hash
      const txHash = 'simulated_sell_tx_' + Date.now();

      console.log(`✅ Sell order executed: ${request.amount} tokens for ${solReceived} SOL`);
      console.log(`💰 New price: ${pool.currentPrice} SOL per token`);

      return { 
        txHash, 
        solReceived, 
        newPrice: pool.currentPrice 
      };
    } catch (error) {
      console.error('Error selling token:', error);
      throw new Error(`Failed to sell token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPoolInfo(poolId: string): Promise<PoolMetadata | null> {
    try {
      const pools = this.loadPools();
      return pools.find(pool => pool.id === poolId) || null;
    } catch (error) {
      console.error('Error getting pool info:', error);
      return null;
    }
  }

  async getAllPools(): Promise<PoolMetadata[]> {
    try {
      return this.loadPools();
    } catch (error) {
      console.error('Error getting all pools:', error);
      return [];
    }
  }

  async getPoolsByToken(tokenMint: string): Promise<PoolMetadata[]> {
    try {
      const pools = this.loadPools();
      return pools.filter(pool => pool.tokenMint === tokenMint);
    } catch (error) {
      console.error('Error getting pools by token:', error);
      return [];
    }
  }
}
