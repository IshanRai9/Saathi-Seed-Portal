# User Portal - Saathi Seed Portal

## Overview

The User Portal is a comprehensive web application that allows customers to browse, purchase, and manage seed orders through a blockchain-based platform. It provides a user-friendly interface for interacting with the seed traceability system.

## Features

### 🏠 Dashboard
- **User Statistics**: View total purchases, spending, favorite crops, and last purchase date
- **Recent Purchases**: Quick overview of recent orders with status tracking
- **Available Seeds**: Browse featured seeds with quick purchase options
- **Real-time Metrics**: Live data from blockchain smart contracts

### 🌱 Seed Catalog
- **Comprehensive Search**: Find seeds by name, variety, or crop type
- **Advanced Filtering**: Filter by crop type, certification, and price range
- **Detailed Information**: View seed specifications, pricing, and availability
- **Quick Purchase**: Add seeds to cart with quantity selection
- **Visual Cards**: Beautiful seed cards with emoji representations

### 🛒 Purchase History
- **Order Tracking**: View all past and current orders
- **Status Management**: Track order status (Pending, Confirmed, Shipped, Delivered, Cancelled)
- **Detailed Information**: Complete order details including tracking numbers
- **Order Actions**: Cancel pending orders, track shipments, leave reviews
- **Statistics**: Purchase summaries and spending analytics

### 👤 User Profile
- **Profile Management**: Update personal information (name, email, address, phone)
- **Account Information**: View registration date and user role
- **Wallet Integration**: Display connected wallet address with copy functionality
- **Secure Updates**: Blockchain-verified profile updates

## Technical Architecture

### Frontend Components
- **UserPortal.js**: Main portal container with tab-based navigation
- **UserSidebar.js**: Navigation sidebar with portal-specific menu items
- **UserDashboard.js**: Dashboard with statistics and recent activity
- **SeedCatalog.js**: Seed browsing and purchasing interface
- **PurchaseHistory.js**: Order history and management
- **UserProfile.js**: User profile management interface

### Smart Contract Integration
- **UserPortal.sol**: Main smart contract for user operations
- **AdminPortal.sol**: Integration with admin portal for seed data
- **Web3 Integration**: Seamless blockchain interaction through web3.js

### Key Smart Contract Functions
```solidity
// User Registration
function registerUser(string memory _name, string memory _email, string memory _address, string memory _phone)

// Profile Management
function updateProfile(string memory _name, string memory _email, string memory _address, string memory _phone)

// Purchase Management
function createPurchase(string memory _purchaseId, string memory _seedId, uint256 _quantity)
function cancelPurchase(string memory _purchaseId)

// Data Retrieval
function getUserPurchases(address _user) returns (string[] memory)
function getPurchaseStats(address _user) returns (uint256, uint256, uint256, uint256, uint256)
```

## User Journey

### 1. Registration
- Users connect their wallet
- Complete profile registration on blockchain
- Receive confirmation and access to portal

### 2. Browsing Seeds
- Navigate to Seed Catalog
- Use search and filters to find desired seeds
- View detailed seed information and pricing

### 3. Making Purchases
- Select quantity and add to cart
- Confirm purchase details
- Complete transaction on blockchain
- Receive purchase confirmation

### 4. Order Management
- View purchase history
- Track order status
- Cancel pending orders if needed
- Leave reviews for delivered orders

### 5. Profile Management
- Update personal information
- View account statistics
- Manage wallet connection

## Navigation Structure

```
User Portal
├── Dashboard
│   ├── User Statistics
│   ├── Recent Purchases
│   └── Available Seeds
├── Seed Catalog
│   ├── Search & Filters
│   ├── Seed Grid
│   └── Purchase Actions
├── My Purchases
│   ├── Purchase History
│   ├── Order Details
│   └── Order Actions
└── Profile
    ├── Personal Information
    ├── Account Details
    └── Wallet Information
```

## Styling & UI

### Design System
- **Color Scheme**: Modern gradient backgrounds with professional color palette
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent card-based layout with hover effects
- **Responsive**: Mobile-first design with responsive breakpoints
- **Icons**: Emoji-based icons for visual appeal and accessibility

### CSS Architecture
- **Component-based**: Separate CSS files for each component
- **Modular**: Reusable styles and utility classes
- **Responsive**: Mobile-optimized layouts
- **Animations**: Smooth transitions and hover effects

## Integration Points

### Admin Portal Connection
- **Seed Data**: User portal reads seed information from AdminPortal contract
- **User Management**: Admin can manage user accounts and permissions
- **Order Processing**: Admin can update order status and tracking information

### Blockchain Integration
- **Web3.js**: Ethereum blockchain interaction
- **Smart Contracts**: UserPortal and AdminPortal contract integration
- **Wallet Connection**: MetaMask and other wallet support
- **Transaction Management**: Gas fee handling and transaction confirmation

## Development Setup

### Prerequisites
- Node.js and npm
- Truffle framework
- Ganache or local blockchain
- MetaMask browser extension

### Installation
```bash
# Install dependencies
npm install

# Compile contracts
truffle compile

# Deploy contracts
truffle migrate

# Start development server
npm start
```

### Contract Deployment
```bash
# Deploy to local network
truffle migrate --network development

# Deploy to testnet
truffle migrate --network ropsten
```

## Usage

### Accessing User Portal
1. Navigate to `/user` route
2. Connect wallet if not already connected
3. Register user profile if first time
4. Start browsing and purchasing seeds

### Switching Between Portals
- Use top navigation to switch between Admin and User portals
- Portal state is maintained during navigation
- Each portal has independent functionality

## Future Enhancements

### Planned Features
- **Wishlist**: Save favorite seeds for later purchase
- **Notifications**: Real-time order status updates
- **Reviews**: Rate and review purchased seeds
- **Recommendations**: AI-powered seed recommendations
- **Mobile App**: Native mobile application
- **Multi-language**: Internationalization support

### Technical Improvements
- **Performance**: Optimize blockchain queries and caching
- **Security**: Enhanced smart contract security audits
- **Scalability**: Layer 2 solutions for reduced gas costs
- **Analytics**: User behavior tracking and analytics

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Note**: This user portal is part of the larger Saathi Seed Portal ecosystem and integrates seamlessly with the admin portal for complete seed traceability and management.

