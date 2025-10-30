# Rivo - Social Payments on Solana

<p align="center">
  <img src="https://rivo.rcht.dev/logo.svg" alt="Rivo Logo" width="120" height="120">
</p>

## 📋 Table of Contents

- [🚀 Project Overview](#-project-overview)
  - [The Problem](#the-problem)
  - [Our Solution](#our-solution)
  - [Platform Architecture](#platform-architecture)
  - [Core Innovation: Social-to-Wallet Mapping](#core-innovation-social-to-wallet-mapping)
  - [Key Differentiators](#key-differentiators)
- [🎯 Key Features](#-key-features)
- [🏗️ Technical Architecture](#️-technical-architecture)
  - [Tech Stack](#tech-stack)
  - [Accounts Structure](#accounts-structure)
- [🌐 Web Dashboard Features](#-web-dashboard-features)
- [📱 Mobile App Features](#-mobile-app-features)
- [🔌 Browser Extension](#-browser-extension-payment-method-for-desktop)
- [🏗️ Platform Summary](#️-platform-summary)
- [🎨 UI/UX Highlights](#-uiux-highlights)
- [📊 Technical Specifications](#-technical-specifications)
- [🎯 Future Implementations](#-future-implementations)
- [💰 Business Model](#-business-model)
- [🔗 Links](#-links)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🚀 Project Overview

**Rivo** is a revolutionary social payment ecosystem built on Solana that transforms how people send and receive cryptocurrency. By bridging social media identities with blockchain wallets, Rivo makes crypto payments as intuitive as tagging someone in a post.

**🔗 Related Repository**: The **webapp**, **smart contracts**, and **Chrome extension** are maintained in a separate repository: [https://github.com/arnabdotpy/cypherpunk](https://github.com/arnabdotpy/cypherpunk)

**🌐 Web Dashboard**: Access the Rivo web application at [rivo.rcht.dev](https://rivo.rcht.dev/)

### The Problem

Cryptocurrency adoption faces a critical UX barrier: **wallet addresses**. A 44-character alphanumeric string like `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU` is:

- ❌ Impossible to remember
- ❌ Easy to mistype (one wrong character = lost funds)
- ❌ Not human-readable
- ❌ Creates friction in peer-to-peer payments
- ❌ Intimidating for non-crypto users

This fundamental UX problem prevents mainstream adoption and limits crypto to tech-savvy users.

### Our Solution

Rivo eliminates wallet addresses entirely by using **social media handles** as payment identifiers. The platform consists of:

1. **Web Dashboard** - Link social accounts, connect wallets, claim escrow funds
2. **Mobile App** (React Native) - Full dashboard + send payments via share functionality
3. **Browser Extension** (Chrome/Firefox) - Send USDC directly from Twitter profiles
4. **Smart Contract** (Solana Program) - On-chain social linking and escrow system

#### Platform Architecture

**Dashboard (Web + Mobile App):**

- Link Twitter account to Solana wallet
- Connect and manage wallets
- View pending escrow claims
- Claim accumulated USDC
- View transaction history

**Payment Methods:**

- 🖥️ **Desktop/Laptop**: Browser extension adds "Send USDC" button on Twitter profiles
- 📱 **Mobile**: Share Twitter profile to Rivo app for instant payments

#### Core Innovation: Social-to-Wallet Mapping

- Users link their Twitter handle to their Solana wallet **on-chain** (via web or app)
- Anyone can send USDC using `@username` instead of wallet addresses
- **Escrow system** holds funds for unlinked users until they claim
- Multiple social platforms supported (Twitter now, Instagram/LinkedIn coming soon)

#### Key Differentiators

- ✅ **No wallet address needed** - Use @handles you already know
- ✅ **Works with unlinked users** - Send now, they claim later (unique escrow feature)
- ✅ **Multi-platform** - Mobile app + browser extension
- ✅ **Native mobile experience** - Solana Mobile Wallet Adapter integration
- ✅ **Fast & cheap** - Solana's speed and low fees
- ✅ **Open source** - Transparent and community-driven

---

## 🎯 Key Features

### 1. **Social Account Linking**

- Link your Twitter account to your Solana wallet via OAuth 2.0
- Stored on-chain using a custom Solana program
- One-click authentication flow
- Supports relinking and unlinking

### 2. **Direct Payments (Linked Users)**

- Send USDC directly to linked Twitter users
- Instant transfer using SPL Token program
- Real-time wallet lookup via backend API
- Transaction history tracking

### 3. **Escrow Payments (Unlinked Users)**

- Send USDC to any Twitter handle, even if not linked
- Funds held in program-controlled escrow account
- Recipients can claim anytime after linking their wallet
- Multiple payments accumulate in escrow
- View detailed payment history before claiming

### 4. **Browser Extension**

- **Chrome/Firefox extension** that integrates directly with Twitter
- Adds "Send USDC" button on any Twitter profile page
- Detects if user has linked their wallet
- One-click payment flow without leaving Twitter
- Seamless UI integration matching Twitter's design

### 5. **Mobile Wallet Integration**

- Native integration with Solana Mobile Wallet Adapter
- Works with Phantom
- Secure transaction signing
- Biometric authentication support

### 6. **Transaction History**

- Complete payment history with timestamps
- Filter by direct/escrow transfers
- Transaction signature tracking
- Pull-to-refresh functionality

---

## 🏗️ Technical Architecture

### **Tech Stack**

#### Mobile App

- **Framework**: Solana Mobile framework (React Native + Expo)
- **Navigation**: Expo Router (file-based routing)
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Mobile Wallet Adapter Protocol
- **Storage**: AsyncStorage

#### Browser Extension

- Chrome/Firefox extension for social media integration

#### WebApp (Separate Repository)

- **Framework**: NextJS
- **UI**: TailwindCSS
- **Auth**: Twitter OAuth 2.0

#### Accounts Structure:

1. **SocialLink Account** - Stores Twitter handle → Wallet mapping
2. **EscrowAccount** - Holds USDC for unlinked users
3. **PaymentRecord** - Individual payment tracking
4. **Config Account** - Program configuration

#### Key Instructions:

- `linkTwitter` - Link Twitter handle to wallet
- `sendToLinked` - Direct USDC transfer
- `sendToUnlinked` - Create escrow payment
- `claimFunds` - Claim escrowed USDC

---

## 🌐 Web Dashboard Features

The web dashboard provides a full management interface accessible from any browser:

### Account Management

- Connect Solana wallet (Phantom)
- Link Twitter account via OAuth 2.0
- View linked social accounts
- Manage wallet connections

### Claim Escrow Funds

- Check for pending payments sent to your @username
- View accumulated USDC amounts
- See detailed payment history (senders, amounts, timestamps)
- Claim all funds in one transaction
- Transaction confirmation and history

### Transaction History

- View all sent and received payments
- Transaction signatures and details

---

## 📱 Mobile App Features

The mobile app includes **all web dashboard features** plus mobile-specific capabilities:

### Dashboard (Same as Web)

- Wallet connection and management
- Link Twitter account via OAuth 2.0
- Claim escrow funds
- View transaction history
- Account settings

### Mobile-Specific: Send USDC via Share

- Browse Twitter on mobile
- Share any Twitter profile to Rivo app
- @username auto-filled in payment screen
- Real-time linked status check
- Amount input with decimal support
- Direct transfer or escrow routing
- Mobile wallet integration (Phantom)

### Home Screen

- Wallet connection status
- USDC balance display
- Twitter account linking status
- Quick access to send and claim features
- Recent transaction overview

---

## 🔌 Browser Extension (Payment Method for Desktop)

The browser extension is specifically for **sending payments** on desktop/laptop. It integrates directly with Twitter, adding "Send USDC" buttons on user profiles for seamless payments without leaving the platform.

**Note:** For account management (linking socials, claiming funds), users should visit the web dashboard or use the mobile app.

---


## 🏗️ Platform Summary

### Three Components Working Together:

1. **Web Dashboard** (rivo.app)
   - Account management hub
   - Link social accounts
   - Connect wallets
   - Claim escrow funds
   - View transaction history

2. **Mobile App** (Android/iOS)
   - All dashboard features
   - PLUS: Send payments via share functionality
   - Native mobile wallet integration

3. **Browser Extension** (Chrome/Firefox)
   - Payment-only tool for desktop
   - Adds "Send USDC" button on Twitter profiles
   - Quick payments while browsing

**User Journey:**

- **Setup**: Use web dashboard or mobile app to link Twitter + wallet
- **Send Money**: Use browser extension (desktop) or share to app (mobile)
- **Claim Funds**: Use web dashboard or mobile app

---

## 🎨 UI/UX Highlights

### Design Principles

- **Mobile-first**: Optimized for one-handed use
- **Dark theme**: Reduces eye strain, modern aesthetic
- **Minimal friction**: 3 taps to send money
- **Clear feedback**: Loading states, success/error messages
- **Familiar patterns**: Twitter-like UI elements

### Visual Elements

- Custom Rivo logo and branding
- Smooth animations and transitions
- Status badges (Connected, Linked, etc.)
- Color-coded transaction types
- Profile pictures from Twitter

---

## 📊 Technical Specifications

### Compatibility

- **Mobile**: Android 8.0+, iOS 13.0+
- **Wallets**: Phantom
- **Browser**: Chrome, Brave, Edge, etc (all Chromium-based browser)
- **Network**: Solana Devnet (ready for mainnet)

---

### Open Source

This project is open source and welcomes contributions:

- Report bugs via GitHub Issues
- Submit feature requests
- Contribute code via Pull Requests
- Improve documentation
- Share feedback

---

## 🎯 Future Implementations

### Phase 1: Multi-Platform Social Integration (Q1 2025)

#### Instagram Integration

#### LinkedIn Integration

#### Reddit Integration

### Phase 2: Enhanced Features (Q2 2025)

#### Multi-Token Support

- Support for SOL, USDT, BONK, and other SPL tokens
- Token selection in payment flow
- Multi-currency balance display
- Automatic token swapping (Jupiter integration)

#### Payment Features

- **QR code payments** - Generate and scan QR codes
- **Payment requests** - Request specific amounts from users
- **Recurring payments** - Subscriptions and scheduled transfers
- **Payment splitting** - Split bills among multiple users
- **Payment notes** - Add memos to transactions

#### Mobile Enhancements

- **iOS app release** - Full iOS support with TestFlight beta
- **Push notifications** - Payment alerts and claim reminders
- **Biometric security** - Face ID / Touch ID for transactions

### Phase 3: Business & Enterprise (Q3-Q4 2025)

#### Merchant Tools

- **Payment links** - Generate shareable payment URLs
- **Merchant dashboard** - Analytics and reporting
- **API access** - Integrate Rivo into third-party apps
- **Webhooks** - Real-time payment notifications
- **Bulk payments** - Send to multiple recipients at once

#### Advanced Features

- **NFT gating** - Premium features for NFT holders
- **DAO governance** - Community-driven development
- **Analytics dashboard** - Transaction insights and trends

---

## 💰 Business Model

### Revenue Streams

#### 1. Escrow Claiming Fees (Primary)

- **2-5% fee on claiming unclaimed tokens** for previously unlinked accounts
- Applied only when users claim funds that were held in escrow
- Covers escrow infrastructure and operational costs
- Incentivizes users to link accounts early for direct transfers

#### 2. Yield Generation from Unclaimed Tokens (Passive)

- **Staking unclaimed USDC** while held in escrow to generate yield
- Yield earned on escrowed funds creates additional revenue
- Helps offset operational costs of escrow system
- Potential to share portion of yield with users as incentive

#### 3. x402 Protocol API Services

- **API endpoints for wallet and social account lookups** via x402 protocol
- Enable third-party developers to access social-to-wallet mapping data
- Monetize through API call pricing via x402 protocol
- B2B integration for wallets, exchanges, and DeFi platforms

---

## 🔗 Links

- **Mobile App GitHub**: https://github.com/notnotrachit/

- **Smart Contracts GitHub**: https://github.com/arnabdotpy/cypherpunk

- **Browser Extension GitHub**: https://github.com/arnabdotpy/cypherpunk

- **Web Dashboard GitHub**: https://github.com/arnabdotpy/cypherpunk

- **Web Dashboard**: https://rivo.rcht.dev

---

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- Solana Mobile Stack for wallet adapter
- Twitter API for OAuth integration
- Expo team
- Open source community

---

**Built with ❤️ on Solana**
