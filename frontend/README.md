# Meteora DBC Frontend

A modern React-based frontend for the Meteora DBC Token Creation & Trading Platform. Built with Next.js 15, TypeScript, and TailwindCSS.

## 🎯 **What This Frontend Does**

### **Core Features**
- **Wallet Integration**: Connect with Phantom wallet for Solana transactions
- **Token Creation**: Create new SPL tokens on Solana Devnet
- **Trading Interface**: Buy and sell tokens through bonding curves
- **Dashboard**: View all tokens, pools, and trading statistics
- **Real-time Updates**: Live price updates and trading data

### **User Experience**
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Mobile Friendly**: Works perfectly on desktop and mobile devices
- **Real-time Feedback**: Loading states, success/error messages
- **Interactive Trading**: Modal-based buy/sell interface

## 🛠 **Tech Stack**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Solana Wallet Adapter** - Wallet integration
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── WalletConnect.tsx  # Wallet connection component
│   │   ├── TokenForm.tsx      # Token creation form
│   │   └── PoolCard.tsx       # Token pool display card
│   ├── contexts/              # React contexts
│   │   └── WalletContext.tsx  # Wallet state management
│   └── lib/                   # Utilities
│       └── api.ts            # API client configuration
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 20.17.0 or higher
- npm or yarn
- Phantom wallet browser extension

### **Installation**
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.local.example .env.local
# Edit .env.local with your API URL
```

### **Environment Variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **Running the Frontend**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The frontend will be available at http://localhost:3000

## 🎨 **Key Components**

### **WalletConnect Component**
- **Purpose**: Handles wallet connection and disconnection
- **Features**: 
  - Phantom wallet integration
  - Connection status display
  - Automatic API header management

### **TokenForm Component**
- **Purpose**: Form for creating new SPL tokens
- **Features**:
  - Input validation
  - Loading states
  - Success/error feedback
  - Wallet connection check

### **PoolCard Component**
- **Purpose**: Displays token pool information and trading interface
- **Features**:
  - Real-time price display
  - Buy/sell modals
  - Trading calculations
  - Pool statistics

### **Dashboard Page**
- **Purpose**: Main application interface
- **Features**:
  - Statistics overview
  - Token grid display
  - Create token button
  - Refresh functionality

## 🔌 **API Integration**

The frontend communicates with the backend through these endpoints:

### **Token APIs**
- `POST /api/token/create` - Create new token
- `GET /api/token/:mintAddress` - Get token info
- `GET /api/token` - Get all tokens

### **Pool APIs**
- `POST /api/pool/create` - Create trading pool
- `POST /api/pool/buy` - Buy tokens
- `POST /api/pool/sell` - Sell tokens
- `GET /api/pool/:poolId` - Get pool info

### **Dashboard APIs**
- `GET /api/dashboard/tokens` - Get dashboard data
- `GET /api/dashboard/stats` - Get platform statistics
- `GET /api/dashboard/pools` - Get pool data

## 🎯 **User Flow**

1. **Connect Wallet** → User connects Phantom wallet
2. **View Dashboard** → See all available tokens and pools
3. **Create Token** → Fill form and create new SPL token
4. **Create Pool** → Set up trading pool for the token
5. **Trade Tokens** → Buy/sell tokens through bonding curve
6. **Monitor Activity** → View real-time price updates

## 🔧 **Development**

### **Adding New Components**
```bash
# Create new component
touch src/components/NewComponent.tsx
```

### **Styling Guidelines**
- Use TailwindCSS classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use Lucide React for icons

### **State Management**
- Use React hooks for local state
- Wallet state managed by Solana Wallet Adapter
- API state managed by component-level useState

## 🐛 **Troubleshooting**

### **Common Issues**

**Wallet Connection Failed**
- Ensure Phantom wallet is installed
- Check if wallet is connected to Devnet
- Refresh the page and try again

**API Connection Error**
- Verify backend is running on port 3001
- Check API URL in environment variables
- Ensure CORS is properly configured

**Build Errors**
- Check TypeScript errors
- Verify all imports are correct
- Ensure all dependencies are installed

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables for Production**
- Set `NEXT_PUBLIC_API_URL` to your production API URL
- Ensure backend is deployed and accessible

## 📱 **Responsive Design**

The frontend is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 **UI/UX Features**

- **Dark/Light Mode**: Ready for theme switching
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear success confirmations
- **Responsive Grid**: Adaptive layout for all screen sizes

## 🔮 **Future Enhancements**

- **Multi-wallet Support**: Solflare, Backpack, etc.
- **Advanced Charts**: Price history and analytics
- **Real-time Updates**: WebSocket integration
- **PWA Support**: Offline functionality
- **Advanced Trading**: Limit orders, stop losses
- **Social Features**: Token sharing, comments

---

**Note**: This frontend is designed to work with the Meteora DBC backend. Make sure the backend is running before starting the frontend.