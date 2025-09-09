import { Router, Request, Response } from 'express';
import { PoolService, CreatePoolRequest, TradeRequest } from '../services/pool.service';

const router = Router();
const poolService = new PoolService();

// POST /api/pool/create
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { tokenMint, initialLiquidity } = req.body;
    const creator = req.headers['x-wallet-address'] as string;

    // Validate required fields
    if (!tokenMint || !initialLiquidity) {
      return res.status(400).json({
        error: 'Missing required fields: tokenMint, initialLiquidity'
      });
    }

    if (!creator) {
      return res.status(400).json({
        error: 'Wallet address required in x-wallet-address header'
      });
    }

    // Validate input
    if (initialLiquidity <= 0) {
      return res.status(400).json({
        error: 'Initial liquidity must be greater than 0'
      });
    }

    const createRequest: CreatePoolRequest = {
      tokenMint,
      initialLiquidity: parseFloat(initialLiquidity),
      creator
    };

    const result = await poolService.createPool(createRequest);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating pool:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create pool'
    });
  }
});

// POST /api/pool/buy
router.post('/buy', async (req: Request, res: Response) => {
  try {
    const { poolId, amount } = req.body;
    const userWallet = req.headers['x-wallet-address'] as string;

    // Validate required fields
    if (!poolId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: poolId, amount'
      });
    }

    if (!userWallet) {
      return res.status(400).json({
        error: 'Wallet address required in x-wallet-address header'
      });
    }

    // Validate input
    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      });
    }

    const tradeRequest: TradeRequest = {
      poolId,
      amount: parseFloat(amount),
      userWallet,
      isBuy: true
    };

    const result = await poolService.buyToken(tradeRequest);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error buying token:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to buy token'
    });
  }
});

// POST /api/pool/sell
router.post('/sell', async (req: Request, res: Response) => {
  try {
    const { poolId, amount } = req.body;
    const userWallet = req.headers['x-wallet-address'] as string;

    // Validate required fields
    if (!poolId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: poolId, amount'
      });
    }

    if (!userWallet) {
      return res.status(400).json({
        error: 'Wallet address required in x-wallet-address header'
      });
    }

    // Validate input
    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      });
    }

    const tradeRequest: TradeRequest = {
      poolId,
      amount: parseFloat(amount),
      userWallet,
      isBuy: false
    };

    const result = await poolService.sellToken(tradeRequest);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error selling token:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to sell token'
    });
  }
});

// GET /api/pool/:poolId
router.get('/:poolId', async (req: Request, res: Response) => {
  try {
    const { poolId } = req.params;
    
    const pool = await poolService.getPoolInfo(poolId);
    
    if (!pool) {
      return res.status(404).json({
        error: 'Pool not found'
      });
    }

    res.json({
      success: true,
      data: pool
    });
  } catch (error) {
    console.error('Error getting pool info:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get pool info'
    });
  }
});

// GET /api/pool
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tokenMint } = req.query;
    
    let pools;
    if (tokenMint) {
      pools = await poolService.getPoolsByToken(tokenMint as string);
    } else {
      pools = await poolService.getAllPools();
    }

    res.json({
      success: true,
      data: pools
    });
  } catch (error) {
    console.error('Error getting pools:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get pools'
    });
  }
});

export { router as poolRoutes };
