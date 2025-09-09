import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Solana configuration
export const SOLANA_CONFIG = {
  RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  COMMITMENT: 'confirmed' as const,
  TOKEN_PROGRAM_ID: TOKEN_PROGRAM_ID,
};

// Create Solana connection
export const connection = new Connection(
  SOLANA_CONFIG.RPC_URL,
  SOLANA_CONFIG.COMMITMENT
);

// Helper function to create keypair from private key
export const createKeypairFromPrivateKey = (privateKey: string): Keypair => {
  const privateKeyArray = privateKey.split(',').map(Number);
  return Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
};

// Helper function to get wallet keypair (for server operations)
export const getServerKeypair = (): Keypair | null => {
  const privateKey = process.env.SOLANA_PRIVATE_KEY;
  if (!privateKey) {
    console.warn('⚠️  SOLANA_PRIVATE_KEY not set. Some operations may fail.');
    return null;
  }
  return createKeypairFromPrivateKey(privateKey);
};

// Common program IDs
export const PROGRAM_IDS = {
  TOKEN_PROGRAM: TOKEN_PROGRAM_ID,
  METEORA_DBC: process.env.METEORA_PROGRAM_ID || 'MeteoraDBCProgramId', // Will be updated with real ID
};
