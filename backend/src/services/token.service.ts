import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  createMint, 
  createAccount, 
  mintTo, 
  getAccount,
  getMint,
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token';
import { connection, getServerKeypair } from '../config/solana';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Types
export interface TokenMetadata {
  id: string;
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  creator: string;
  createdAt: string;
  description?: string;
  image?: string;
}

export interface CreateTokenRequest {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  description?: string;
  image?: string;
}

export class TokenService {
  private dataFile: string;

  constructor() {
    this.dataFile = path.join(__dirname, '../../data/tokens.json');
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

  private loadTokens(): TokenMetadata[] {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading tokens:', error);
      return [];
    }
  }

  private saveTokens(tokens: TokenMetadata[]): void {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw new Error('Failed to save token data');
    }
  }

  async createToken(request: CreateTokenRequest, creatorWallet: string): Promise<{ token: TokenMetadata; txHash: string }> {
    try {
      const serverKeypair = getServerKeypair();
      if (!serverKeypair) {
        throw new Error('Server keypair not configured');
      }

      // Create new mint
      console.log('Creating SPL token mint...');
      const mint = await createMint(
        connection,
        serverKeypair,
        serverKeypair.publicKey,
        null, // No freeze authority
        request.decimals,
        TOKEN_PROGRAM_ID
      );

      // Create token account for the creator
      console.log('Creating token account...');
      const tokenAccount = await createAccount(
        connection,
        serverKeypair,
        mint,
        new PublicKey(creatorWallet),
        undefined,
        undefined,
        TOKEN_PROGRAM_ID
      );

      // Mint initial supply to creator's account
      console.log('Minting initial supply...');
      const mintAmount = request.initialSupply * Math.pow(10, request.decimals);
      const mintTx = await mintTo(
        connection,
        serverKeypair,
        mint,
        tokenAccount,
        serverKeypair,
        mintAmount,
        [],
        undefined,
        TOKEN_PROGRAM_ID
      );

      // Get transaction signature
      const txHash = mintTx;

      // Create token metadata
      const tokenMetadata: TokenMetadata = {
        id: uuidv4(),
        mint: mint.toString(),
        name: request.name,
        symbol: request.symbol,
        decimals: request.decimals,
        totalSupply: request.initialSupply,
        creator: creatorWallet,
        createdAt: new Date().toISOString(),
        description: request.description,
        image: request.image,
      };

      // Save to local storage
      const tokens = this.loadTokens();
      tokens.push(tokenMetadata);
      this.saveTokens(tokens);

      console.log(`✅ Token created successfully: ${request.name} (${request.symbol})`);
      console.log(`📍 Mint Address: ${mint.toString()}`);
      console.log(`🔗 Transaction: ${txHash}`);

      return { token: tokenMetadata, txHash };
    } catch (error) {
      console.error('Error creating token:', error);
      throw new Error(`Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTokenInfo(mintAddress: string): Promise<TokenMetadata | null> {
    try {
      const tokens = this.loadTokens();
      return tokens.find(token => token.mint === mintAddress) || null;
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }

  async getAllTokens(): Promise<TokenMetadata[]> {
    try {
      return this.loadTokens();
    } catch (error) {
      console.error('Error getting all tokens:', error);
      return [];
    }
  }

  async getTokensByCreator(creatorWallet: string): Promise<TokenMetadata[]> {
    try {
      const tokens = this.loadTokens();
      return tokens.filter(token => token.creator === creatorWallet);
    } catch (error) {
      console.error('Error getting tokens by creator:', error);
      return [];
    }
  }
}
