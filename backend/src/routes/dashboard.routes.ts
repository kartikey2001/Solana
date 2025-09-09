import { Router, Request, Response } from 'express';
import { TokenService } from '../services/token.service';
import { PoolService } from '../services/pool.service';

const router = Router();
const tokenService = new TokenService();
const poolService = new PoolService();

// GET /api/dashboard/tokens
router.get('/tokens', async (req: Request, res: Response) => {
  try {
    const tokens = await tokenService.getAllTokens();
    const pools = await poolService.getAllPools();

    // Combine token and pool data for dashboard
    const dashboardData = tokens.map(token => {
      const tokenPools = pools.filter(pool => pool.tokenMint === token.mint);
      const activePool = tokenPools.find(pool => pool.status === 'active');
      
      return {
        tokenMint: token.mint,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        totalSupply: token.totalSupply,
        creator: token.creator,
        createdAt: token.createdAt,
        description: token.description,
        image: token.image,
        poolAddress: activePool?.poolAddress || null,
        poolId: activePool?.id || null,
        currentPrice: activePool?.currentPrice || 0,
        totalLiquidity: activePool?.totalLiquidity || 0,
        totalVolume: activePool?.totalVolume || 0,
        tokenReserve: activePool?.tokenReserve || 0,
        solReserve: activePool?.solReserve || 0,
        status: activePool?.status || 'no_pool',
        poolCreatedAt: activePool?.createdAt || null,
      };
    });

    // Sort by creation date (newest first)
    dashboardData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard tokens:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get dashboard data'
    });
  }
});

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const tokens = await tokenService.getAllTokens();
    const pools = await poolService.getAllPools();

    const activePools = pools.filter(pool => pool.status === 'active');
    const totalLiquidity = activePools.reduce((sum, pool) => sum + pool.totalLiquidity, 0);
    const totalVolume = activePools.reduce((sum, pool) => sum + pool.totalVolume, 0);
    const totalTokens = tokens.length;

    const stats = {
      totalTokens,
      activePools: activePools.length,
      totalLiquidity,
      totalVolume,
      averageLiquidity: activePools.length > 0 ? totalLiquidity / activePools.length : 0,
      averageVolume: activePools.length > 0 ? totalVolume / activePools.length : 0,
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get dashboard stats'
    });
  }
});

// GET /api/dashboard/pools
router.get('/pools', async (req: Request, res: Response) => {
  try {
    const pools = await poolService.getAllPools();
    const tokens = await tokenService.getAllTokens();

    // Enrich pool data with token information
    const enrichedPools = pools.map(pool => {
      const token = tokens.find(t => t.mint === pool.tokenMint);
      return {
        ...pool,
        tokenName: token?.name || 'Unknown',
        tokenSymbol: token?.symbol || 'UNK',
        tokenDecimals: token?.decimals || 9,
      };
    });

    // Sort by volume (highest first)
    enrichedPools.sort((a, b) => b.totalVolume - a.totalVolume);

    res.json({
      success: true,
      data: enrichedPools
    });
  } catch (error) {
    console.error('Error getting dashboard pools:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get dashboard pools'
    });
  }
});

export { router as dashboardRoutes };
