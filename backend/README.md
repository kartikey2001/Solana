# Meteora DBC Backend

A Node.js backend service for the Meteora DBC Token Creation & Trading Platform. Handles Solana blockchain interactions, token creation, and bonding curve management.

## 🎯 **What This Backend Does**

### **Core Services**
- **Token Management**: Create and manage SPL tokens on Solana
- **Pool Management**: Handle trading pools with bonding curve pricing
- **Trading Engine**: Process buy/sell orders through bonding curves
- **Data Storage**: Store token and pool metadata (JSON-based)
- **API Gateway**: Provide REST endpoints for frontend communication

### **Blockchain Integration**
- **Solana Web3.js**: Direct blockchain interaction
- **SPL Token Program**: Token creation and management
- **Devnet Support**: Safe testing environment
- **Transaction Processing**: Handle wallet transactions

## 🛠 **Tech Stack**

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Solana Web3.js** - Solana blockchain SDK
- **SPL Token** - Solana token program
- **Axios** - HTTP client
- **UUID** - Unique identifier generation

## 📁 **Project Structure**

```
backend/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── routes/               # API route handlers
│   │   ├── token.routes.ts   # Token-related endpoints
│   │   ├── pool.routes.ts    # Pool-related endpoints
│   │   └── dashboard.routes.ts # Dashboard data endpoints
│   ├── services/             # Business logic
│   │   ├── token.service.ts  # Token creation and management
│   │   └── pool.service.ts   # Pool and trading logic
│   ├── config/               # Configuration files
│   │   ├── solana.ts         # Solana connection setup
│   │   └── meteora.ts        # Meteora DBC configuration
│   └── db/                   # Data storage (JSON files)
├── data/                     # JSON data files
│   ├── tokens.json          # Token metadata
│   └── pools.json           # Pool data
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 20.17.0 or higher
- npm or yarn
- Solana CLI (optional, for keypair generation)
- Devnet SOL for testing

### **Installation**
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration
```

### **Environment Variables**
```env
# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_private_key_here
PORT=3001
NODE_ENV=development
METEORA_PROGRAM_ID=simulated_meteora_dbc_program
```

### **Running the Backend**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The backend will be available at http://localhost:3001

## 🔧 **Core Services**

### **TokenService**
**Purpose**: Handles SPL token creation and management

**Key Methods**:
- `createToken()` - Create new SPL token on Solana
- `getTokenInfo()` - Retrieve token metadata
- `getAllTokens()` - Get all created tokens
- `getTokensByCreator()` - Get tokens by creator wallet

**Features**:
- Real SPL token minting
- Token account creation
- Initial supply minting
- Metadata storage

### **PoolService**
**Purpose**: Manages trading pools and bonding curve logic

**Key Methods**:
- `createPool()` - Create new trading pool
- `buyToken()` - Process buy orders
- `sellToken()` - Process sell orders
- `getPoolInfo()` - Get pool information

**Features**:
- Linear bonding curve pricing
- Real-time price calculations
- Trading volume tracking
- Pool state management

## 🌐 **API Endpoints**

### **Token Endpoints**
```
POST /api/token/create
- Create new SPL token
- Body: { name, symbol, decimals, initialSupply, description, image }
- Returns: { token, txHash }

GET /api/token/:mintAddress
- Get token information
- Returns: { token }

GET /api/token
- Get all tokens
- Query: ?creator=wallet_address
- Returns: [tokens]
```

### **Pool Endpoints**
```
POST /api/pool/create
- Create trading pool
- Body: { tokenMint, initialLiquidity }
- Returns: { pool, txHash }

POST /api/pool/buy
- Buy tokens
- Body: { poolId, amount }
- Returns: { txHash, tokensReceived, newPrice }

POST /api/pool/sell
- Sell tokens
- Body: { poolId, amount }
- Returns: { txHash, solReceived, newPrice }

GET /api/pool/:poolId
- Get pool information
- Returns: { pool }

GET /api/pool
- Get all pools
- Query: ?tokenMint=address
- Returns: [pools]
```

### **Dashboard Endpoints**
```
GET /api/dashboard/tokens
- Get combined token and pool data
- Returns: [enriched_token_data]

GET /api/dashboard/stats
- Get platform statistics
- Returns: { totalTokens, activePools, totalLiquidity, etc. }

GET /api/dashboard/pools
- Get pool data with token info
- Returns: [enriched_pool_data]
```

## 🔗 **Solana Integration**

### **Connection Setup**
- **RPC Endpoint**: Solana Devnet
- **Commitment Level**: Confirmed
- **Keypair Management**: Server-side keypair for operations

### **Token Operations**
- **Mint Creation**: Using SPL Token Program
- **Account Creation**: Token accounts for users
- **Supply Minting**: Initial token distribution
- **Transaction Signing**: Server-side transaction handling

### **Bonding Curve Logic**
- **Linear Pricing**: `price = basePrice + (supply * priceIncrement)`
- **Real-time Calculation**: Prices update with each trade
- **Supply Management**: Token supply affects pricing
- **Liquidity Tracking**: SOL and token reserves

## 💾 **Data Storage**

### **Current Implementation (JSON)**
- **tokens.json**: Token metadata and information
- **pools.json**: Pool data and trading history
- **File-based**: Simple, no database setup required

### **Future Migration (MongoDB)**
- **Scalable Storage**: Better for production
- **Query Capabilities**: Advanced data retrieval
- **Concurrent Access**: Multiple user support

## 🔒 **Security Features**

### **Input Validation**
- **Required Fields**: All endpoints validate required data
- **Type Checking**: TypeScript ensures type safety
- **Range Validation**: Numeric values within valid ranges

### **Error Handling**
- **Graceful Failures**: Proper error responses
- **Logging**: Console logging for debugging
- **Transaction Safety**: Rollback on failures

## 🧪 **Testing**

### **Health Check**
```bash
curl http://localhost:3001/health
```

### **Test Script**
```bash
# Run the test script
node test-backend.js
```

### **Manual Testing**
- Use Postman or curl to test endpoints
- Check console logs for debugging
- Verify Solana transactions on explorer

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
```

### **Environment Setup**
- Set production RPC URL
- Use production keypair
- Configure proper CORS
- Set up monitoring

### **Docker Support** (Future)
- Containerized deployment
- Environment variable management
- Scalable infrastructure

## 📊 **Monitoring & Logging**

### **Console Logging**
- **Token Creation**: Success/failure logs
- **Trading Activity**: Buy/sell transactions
- **Error Tracking**: Detailed error messages
- **Performance**: Response time monitoring

### **Health Monitoring**
- **Health Endpoint**: `/health`
- **Status Checks**: Database and blockchain connectivity
- **Uptime Tracking**: Service availability

## 🔮 **Future Enhancements**

### **Database Migration**
- **MongoDB Integration**: Replace JSON storage
- **Advanced Queries**: Complex data retrieval
- **Data Analytics**: Trading pattern analysis

### **Real Meteora Integration**
- **DBC SDK**: Actual Meteora contracts
- **Program Integration**: Real bonding curve contracts
- **Advanced Features**: Complex pricing models

### **Performance Improvements**
- **Caching**: Redis for frequently accessed data
- **Rate Limiting**: API request throttling
- **Load Balancing**: Multiple server instances

### **Advanced Features**
- **WebSocket Support**: Real-time updates
- **Advanced Analytics**: Trading insights
- **Liquidity Mining**: Reward mechanisms
- **Multi-chain Support**: Other blockchains

## 🐛 **Troubleshooting**

### **Common Issues**

**Solana Connection Failed**
- Check RPC URL in environment
- Verify network connectivity
- Ensure Devnet is accessible

**Token Creation Failed**
- Verify private key is correct
- Check if keypair has enough SOL
- Ensure SPL Token Program is accessible

**Pool Creation Failed**
- Verify token mint exists
- Check initial liquidity amount
- Ensure proper validation

### **Debugging**
- Check console logs for errors
- Verify environment variables
- Test individual endpoints
- Check Solana transaction status

---

**Note**: This backend is designed to work with the Meteora DBC frontend. Make sure to configure the frontend to point to this backend's API endpoints.
