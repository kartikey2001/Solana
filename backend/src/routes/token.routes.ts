import { Router, Request, Response } from 'express';
import { TokenService, CreateTokenRequest } from '../services/token.service';

const router = Router();
const tokenService = new TokenService();

// POST /api/token/create
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { name, symbol, decimals, initialSupply, description, image } = req.body;
    const creatorWallet = req.headers['x-wallet-address'] as string;

    // Validate required fields
    if (!name || !symbol || !decimals || !initialSupply) {
      return res.status(400).json({
        error: 'Missing required fields: name, symbol, decimals, initialSupply'
      });
    }

    if (!creatorWallet) {
      return res.status(400).json({
        error: 'Wallet address required in x-wallet-address header'
      });
    }

    // Validate input
    if (decimals < 0 || decimals > 9) {
      return res.status(400).json({
        error: 'Decimals must be between 0 and 9'
      });
    }

    if (initialSupply <= 0) {
      return res.status(400).json({
        error: 'Initial supply must be greater than 0'
      });
    }

    const createRequest: CreateTokenRequest = {
      name,
      symbol,
      decimals: parseInt(decimals),
      initialSupply: parseFloat(initialSupply),
      description,
      image
    };

    const result = await tokenService.createToken(createRequest, creatorWallet);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create token'
    });
  }
});

// GET /api/token/:mintAddress
router.get('/:mintAddress', async (req: Request, res: Response) => {
  try {
    const { mintAddress } = req.params;
    
    const token = await tokenService.getTokenInfo(mintAddress);
    
    if (!token) {
      return res.status(404).json({
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      data: token
    });
  } catch (error) {
    console.error('Error getting token info:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get token info'
    });
  }
});

// GET /api/token
router.get('/', async (req: Request, res: Response) => {
  try {
    const { creator } = req.query;
    
    let tokens;
    if (creator) {
      tokens = await tokenService.getTokensByCreator(creator as string);
    } else {
      tokens = await tokenService.getAllTokens();
    }

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get tokens'
    });
  }
});

export { router as tokenRoutes };
