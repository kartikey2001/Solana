'use client';

import React, { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import TokenForm from '../components/TokenForm';
import PoolCard from '../components/PoolCard';
import { dashboardAPI } from '../lib/api';
import { RefreshCw, Plus, TrendingUp, DollarSign, Coins } from 'lucide-react';

interface DashboardStats {
  totalTokens: number;
  activePools: number;
  totalLiquidity: number;
  totalVolume: number;
  averageLiquidity: number;
  averageVolume: number;
}

interface TokenData {
  tokenMint: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: number;
  creator: string;
  createdAt: string;
  description?: string;
  image?: string;
  poolAddress?: string;
  poolId?: string;
  currentPrice: number;
  totalLiquidity: number;
  totalVolume: number;
  tokenReserve: number;
  solReserve: number;
  status: string;
  poolCreatedAt?: string;
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchData = async () => {
    try {
      const [tokensResponse, statsResponse] = await Promise.all([
        dashboardAPI.getTokens(),
        dashboardAPI.getStats(),
      ]);

      if (tokensResponse.data.success) {
        setTokens(tokensResponse.data.data);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleTokenCreated = () => {
    setShowCreateForm(false);
    fetchData();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Meteora DBC</h1>
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Devnet
              </span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Coins className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tokens</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTokens}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Pools</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activePools}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Liquidity</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalLiquidity)} SOL</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <RefreshCw className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Volume</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalVolume)} SOL</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Token Pools</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Token
            </button>
          </div>
        </div>

        {/* Create Token Form */}
        {showCreateForm && (
          <div className="mb-8">
            <TokenForm onTokenCreated={handleTokenCreated} />
          </div>
        )}

        {/* Tokens Grid */}
        {tokens.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tokens yet</h3>
            <p className="text-gray-500 mb-4">Create your first token to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Token
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <PoolCard
                key={token.tokenMint}
                token={token}
                onTrade={handleRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}