'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { poolAPI } from '../lib/api';
import { TrendingUp, TrendingDown, Loader2, ExternalLink } from 'lucide-react';

interface PoolCardProps {
  token: {
    tokenMint: string;
    symbol: string;
    name: string;
    currentPrice: number;
    totalLiquidity: number;
    totalVolume: number;
    tokenReserve: number;
    solReserve: number;
    poolId?: string;
    status: string;
  };
  onTrade?: () => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ token, onTrade }) => {
  const { connected } = useWallet();
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [isBuy, setIsBuy] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!connected || !token.poolId) {
      alert('Please connect your wallet and ensure pool exists');
      return;
    }

    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    try {
      const response = isBuy 
        ? await poolAPI.buy({ poolId: token.poolId, amount: parseFloat(tradeAmount) })
        : await poolAPI.sell({ poolId: token.poolId, amount: parseFloat(tradeAmount) });

      if (response.data.success) {
        alert(`${isBuy ? 'Buy' : 'Sell'} order executed successfully!`);
        setShowTradeModal(false);
        setTradeAmount('');
        onTrade?.();
      } else {
        throw new Error(response.data.error || 'Trade failed');
      }
    } catch (error: any) {
      console.error('Error executing trade:', error);
      alert(error.response?.data?.error || error.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(6);
  };

  const formatPrice = (price: number) => {
    if (price < 0.000001) {
      return price.toExponential(2);
    }
    return price.toFixed(8);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{token.name}</h3>
            <p className="text-sm text-gray-500">{token.symbol}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {formatPrice(token.currentPrice)} SOL
            </div>
            <div className="text-xs text-gray-500">per token</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Liquidity</div>
            <div className="font-semibold">{formatNumber(token.totalLiquidity)} SOL</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Volume</div>
            <div className="font-semibold">{formatNumber(token.totalVolume)} SOL</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Token Reserve</div>
            <div className="font-semibold">{formatNumber(token.tokenReserve)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">SOL Reserve</div>
            <div className="font-semibold">{formatNumber(token.solReserve)} SOL</div>
          </div>
        </div>

        <div className="flex space-x-2">
          {token.poolId && token.status === 'active' ? (
            <>
              <button
                onClick={() => {
                  setIsBuy(true);
                  setShowTradeModal(true);
                }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Buy
              </button>
              <button
                onClick={() => {
                  setIsBuy(false);
                  setShowTradeModal(true);
                }}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
              >
                <TrendingDown className="w-4 h-4 mr-1" />
                Sell
              </button>
            </>
          ) : (
            <div className="flex-1 text-center py-2 text-gray-500">
              {token.status === 'no_pool' ? 'No Pool Created' : 'Pool Inactive'}
            </div>
          )}
        </div>

        {token.tokenMint && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Mint Address:</span>
              <div className="flex items-center">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {token.tokenMint.slice(0, 8)}...{token.tokenMint.slice(-8)}
                </code>
                <ExternalLink className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {isBuy ? 'Buy' : 'Sell'} {token.symbol}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({isBuy ? 'SOL' : token.symbol})
              </label>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder={`Enter ${isBuy ? 'SOL' : 'token'} amount`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="0.000001"
                min="0"
              />
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">
                Current Price: {formatPrice(token.currentPrice)} SOL per token
              </div>
              {tradeAmount && (
                <div className="text-sm text-gray-600 mt-1">
                  {isBuy 
                    ? `You'll receive: ${(parseFloat(tradeAmount) / token.currentPrice).toFixed(6)} ${token.symbol}`
                    : `You'll receive: ${(parseFloat(tradeAmount) * token.currentPrice).toFixed(6)} SOL`
                  }
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowTradeModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                disabled={loading || !tradeAmount}
                className={`flex-1 py-2 px-4 rounded-md text-white flex items-center justify-center ${
                  isBuy 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `${isBuy ? 'Buy' : 'Sell'} ${token.symbol}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoolCard;
