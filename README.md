# Meteora DBC - Token Creation & Trading Platform

A decentralized application (dApp) for creating and trading tokens on Solana using dynamic bonding curves. Built with Next.js, Node.js, TypeScript, and Solana Web3.js.

## 🚀 Features

- **Token Creation**: Create SPL tokens on Solana Devnet
- **Dynamic Bonding Curves**: Set up trading pools with linear bonding curve pricing
- **Real-time Trading**: Buy and sell tokens through the bonding curve
- **Wallet Integration**: Connect with Phantom wallet
- **Dashboard**: View all tokens, pools, and trading statistics
- **Responsive UI**: Modern, mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Solana Wallet Adapter** for wallet integration
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Solana Web3.js** for blockchain interaction
- **SPL Token Program** for token operations
- **JSON file storage** (MVP, ready for MongoDB migration)

### Blockchain
- **Solana Devnet** for testing
- **SPL Token Program** for token minting
- **Custom bonding curve logic** (simulated)

## 📁 Project Structure

```
meteora-dbc/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── lib/            # Utilities and API
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── config/         # Configuration
│   │   └── db/            # Data storage
│   └── package.json
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.17.0 or higher
- npm or yarn
- Phantom wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meteora-dbc
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Backend (`backend/.env`):
   ```env
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_PRIVATE_KEY=your_private_key_here
   PORT=3001
   NODE_ENV=development
   METEORA_PROGRAM_ID=your_meteora_program_id_here
   ```

   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:3001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3000

3. **Open your browser**
   Navigate to http://localhost:3000

## 🔧 Configuration

### Solana Setup

1. **Get Devnet SOL**
   - Visit [Solana Faucet](https://faucet.solana.com/)
   - Request SOL for your wallet address

2. **Set up server keypair**
   - Generate a new keypair or use an existing one
   - Add the private key to your backend `.env` file
   - Fund the keypair with Devnet SOL

### Wallet Setup

1. **Install Phantom Wallet**
   - Download from [phantom.app](https://phantom.app/)
   - Create a new wallet or import existing
   - Switch to Devnet in wallet settings

## 📊 API Endpoints

### Token Endpoints
- `POST /api/token/create` - Create a new token
- `GET /api/token/:mintAddress` - Get token information
- `GET /api/token` - Get all tokens

### Pool Endpoints
- `POST /api/pool/create` - Create a trading pool
- `POST /api/pool/buy` - Buy tokens
- `POST /api/pool/sell` - Sell tokens
- `GET /api/pool/:poolId` - Get pool information
- `GET /api/pool` - Get all pools

### Dashboard Endpoints
- `GET /api/dashboard/tokens` - Get dashboard token data
- `GET /api/dashboard/stats` - Get platform statistics
- `GET /api/dashboard/pools` - Get dashboard pool data

## 🎯 Usage

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select Phantom wallet
   - Approve connection

2. **Create Token**
   - Click "Create Token" button
   - Fill in token details (name, symbol, supply)
   - Submit transaction

3. **Create Pool**
   - After token creation, create a trading pool
   - Set initial liquidity amount
   - Pool will be created with bonding curve pricing

4. **Trade Tokens**
   - View tokens in dashboard
   - Click "Buy" or "Sell" on active pools
   - Enter amount and confirm trade

## 🔮 Future Enhancements

- **MongoDB Integration**: Replace JSON storage with MongoDB
- **Real Meteora DBC SDK**: Integrate actual Meteora DBC contracts
- **Advanced Analytics**: Charts, volume tracking, price history
- **Multi-wallet Support**: Support for Solflare, Backpack, etc.
- **Mainnet Deployment**: Deploy to Solana Mainnet
- **Advanced Bonding Curves**: Non-linear pricing models
- **Liquidity Mining**: Rewards for providing liquidity

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure Phantom wallet is installed
   - Check if wallet is connected to Devnet
   - Refresh the page and try again

2. **Transaction Failed**
   - Check if you have enough SOL for fees
   - Verify wallet is connected
   - Check console for error messages

3. **API Connection Error**
   - Ensure backend server is running
   - Check API URL in frontend environment
   - Verify CORS settings

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Note**: This is a development version running on Solana Devnet. Do not use real funds or deploy to mainnet without proper security audits.
