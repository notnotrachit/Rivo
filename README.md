# Rivo - Social Payments on Solana

## 🚀 Project Overview

**Rivo** is a revolutionary social payment ecosystem built on Solana that transforms how people send and receive cryptocurrency. By bridging social media identities with blockchain wallets, Rivo makes crypto payments as intuitive as tagging someone in a post.

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
- Account management

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

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Mobile Wallet Adapter Protocol
- **State Management**: TanStack Query (React Query)
- **Storage**: AsyncStorage
- **UI**: React Native components with custom theming

#### Browser Extension

- Chrome/Firefox extension for social media integration

#### Backend (Separate Repository)

- **Runtime**: Node.js with Express
- **Blockchain**: Anchor framework for Solana programs
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
- Profile settings

### Claim Escrow Funds

- Check for pending payments sent to your @username
- View accumulated USDC amounts
- See detailed payment history (senders, amounts, timestamps)
- Claim all funds in one transaction
- Transaction confirmation and history

### Transaction History

- View all sent and received payments
- Filter by direct transfers vs escrow
- Transaction signatures and details
- Export transaction data

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

## 💡 User Flows

### Flow 1: Account Setup (Web Dashboard or Mobile App)

```
1. User visits Rivo web dashboard OR downloads mobile app
2. Clicks "Connect Wallet"
3. Connects Solana wallet (Phantom)
4. Clicks "Link Twitter Account"
5. Redirected to Twitter OAuth page
6. Authorizes Rivo app
7. Returns to dashboard with Twitter profile data
8. On-chain transaction creates SocialLink account
9. Twitter handle now mapped to wallet address
10. User can now receive payments via @username
```

**Platform Options:**

- 🌐 **Web Dashboard**: Full-featured management interface
- 📱 **Mobile App**: Same features + mobile payment capabilities

---

### Flow 2: Sending Money via Browser Extension (Desktop/Laptop)

**Use Case:** Sending payments from desktop/laptop while browsing Twitter

**Prerequisites:**

- User must install Rivo browser extension (Chrome/Firefox)
- User must have Solana wallet browser extension (Phantom)

#### Scenario A: Recipient Has Linked Wallet (Direct Transfer)

```
1. User installs Rivo browser extension (Chrome/Firefox)
2. User visits any Twitter profile
3. Extension adds "Send USDC" button next to Follow button
4. User clicks "Send USDC"
5. Extension checks if @username has linked wallet
6. ✓ Wallet found - shows "Direct transfer to linked wallet"
7. User enters amount in modal
8. User clicks "Send"
9. Connects Solana wallet (Phantom browser extension)
10. Signs transaction
11. USDC instantly transferred to recipient's wallet
12. Success notification shown
```

#### Scenario B: Recipient Hasn't Linked Wallet (Escrow)

```
1. User installs Rivo browser extension
2. User visits Twitter profile of non-linked user
3. Extension adds "Send USDC" button
4. User clicks "Send USDC"
5. Extension checks if @username has linked wallet
6. ⏳ No wallet found - shows "Funds will be held in escrow"
7. User enters amount in modal
8. User clicks "Send"
9. Connects Solana wallet (browser extension)
10. Signs transaction
11. USDC transferred to escrow account (on-chain)
12. Recipient can claim anytime after linking
```

### Flow 3: Sending Money via Mobile App (Android/iOS)

**Use Case:** Sending payments from mobile phone while browsing Twitter

**Prerequisites:**

- User must install Rivo mobile app
- User must have mobile Solana wallet (Phantom)

#### Payment via Share Functionality

```
1. User browses Twitter on mobile (Twitter app or browser)
2. Finds a profile they want to send USDC to
3. User taps "Share" button on Twitter profile
4. Selects "Rivo" from share menu
5. Rivo app opens with @username pre-filled
6. App checks if @username has linked wallet
7. Shows status: "✓ Direct transfer" or "⏳ Escrow"
8. User enters amount
9. Taps "Send USDC"
10. Mobile wallet opens for signature
11. Signs transaction
12. USDC sent (direct or escrow based on link status)
13. Success notification shown
14. Returns to Twitter
```

**Key Differences:**

- 🖥️ **Desktop**: Browser extension adds button directly on Twitter pages
- 📱 **Mobile**: Uses native share functionality to send profiles to Rivo app
- 🌐 **Both**: Account management done via web dashboard or mobile app

---

### Flow 4: Claiming Escrow Funds (Web Dashboard or Mobile App)

**Use Case:** Claiming funds that were sent before linking account

```
1. User logs into web dashboard OR opens mobile app
2. Navigates to "Claim Funds" section
3. Clicks/Taps "Check for Pending Claims"
4. System queries on-chain escrow accounts for @username
5. Shows accumulated USDC amount
6. Shows number of payments received
7. User clicks/taps "View Payment History"
8. Sees list of senders, amounts, and timestamps
9. User clicks/taps "Claim All"
10. Wallet opens for signature (browser or mobile)
11. Signs transaction
12. All escrowed USDC transferred to user's wallet
13. Escrow accounts closed
14. Success message shown
```

**Platform Options:**

- 🌐 **Web Dashboard**: Claim via browser with wallet extension
- 📱 **Mobile App**: Claim via app with mobile wallet

---

### Flow 5: End-to-End Example

**Alice wants to tip Bob for a helpful tweet:**

```
Without Rivo:
❌ Alice asks Bob for his wallet address
❌ Bob shares: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
❌ Alice copies address (risk of typo)
❌ Alice opens wallet app
❌ Alice pastes address and sends
❌ Total: 5+ steps, high friction

With Rivo:
✅ Alice sees Bob's tweet
✅ Clicks "Send USDC" button (added by extension)
✅ Enters $10
✅ Clicks "Send"
✅ Signs transaction
✅ Done! Bob receives money instantly
✅ Total: 3 clicks, seamless experience
```

**If Bob hasn't linked his wallet yet:**

- Money goes to escrow automatically
- Bob gets notified (future: Twitter DM or email)
- Bob visits web dashboard OR downloads mobile app
- Connects wallet and links Twitter account
- Claims all pending payments in one click

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

- **OAuth 2.0 authentication** with Instagram
- Link Instagram handles to Solana wallets
- Send USDC via Instagram usernames
- Browser extension support for Instagram profiles
- Instagram DM payment requests

#### LinkedIn Integration

- **Professional payment network** for freelancers and businesses
- Link LinkedIn profiles to wallets
- B2B payments using company pages
- Invoice generation and payment tracking
- Professional networking with crypto payments

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
- **Offline mode** - Queue transactions for later

### Phase 3: Business & Enterprise (Q3-Q4 2025)

#### Merchant Tools

- **Payment links** - Generate shareable payment URLs
- **Merchant dashboard** - Analytics and reporting
- **API access** - Integrate Rivo into third-party apps
- **Webhooks** - Real-time payment notifications
- **Bulk payments** - Send to multiple recipients at once

#### Advanced Features

- **Fiat on/off ramps** - Buy crypto with credit cards
- **NFT gating** - Premium features for NFT holders
- **DAO governance** - Community-driven development
- **Analytics dashboard** - Transaction insights and trends

---

## 💰 Business Model

### Revenue Streams

#### 1. Transaction Fees (Primary)

- **0.5% fee on all transactions** (competitive with traditional payment processors)
- Significantly lower than credit cards (2-3%) or PayPal (2.9% + $0.30)
- Example: $100 transfer = $0.50 fee
- Scalable revenue as transaction volume grows

#### 2. Premium Features (Subscription)

- **Rivo Pro** - $4.99/month
  - Zero transaction fees
  - Priority support
  - Advanced analytics
  - Custom payment links
  - API access
  - Higher transaction limits

#### 3. Enterprise Solutions (B2B)

- **Custom pricing** for businesses
- White-label solutions
- Dedicated support
- Custom integrations
- Volume discounts
- SLA guarantees

#### 4. Value-Added Services

- **Express claims** - Instant escrow claims for a small fee
- **Payment insurance** - Protection against errors
- **Currency conversion** - Fees on token swaps
- **Premium analytics** - Advanced reporting tools

### Market Opportunity

#### Target Market Size

- **Crypto users**: 420M+ globally (2024)
- **Twitter users**: 550M+ active users
- **Instagram users**: 2B+ active users
- **LinkedIn users**: 900M+ professionals
- **Freelancers**: 1.5B+ worldwide

#### Addressable Market

- **P2P payments**: $2.3T market (growing 15% annually)
- **Cross-border remittances**: $700B+ annually
- **Creator economy**: $250B+ market
- **Freelance payments**: $1.5T+ market

#### Competitive Advantages

- ✅ **Lower fees** than traditional payment processors
- ✅ **Faster settlements** (seconds vs. days)
- ✅ **Global reach** without currency conversion
- ✅ **No chargebacks** (blockchain finality)
- ✅ **Privacy-focused** (no personal data required)
- ✅ **Open source** (community trust)

### Go-to-Market Strategy

#### Phase 1: Community Building (Months 1-3)

- Launch on Solana devnet
- Build crypto-native user base
- Gather feedback and iterate
- Create educational content
- Partner with crypto influencers

#### Phase 2: Mainnet Launch (Months 4-6)

- Deploy to Solana mainnet
- Onboard early adopters
- Implement transaction fees
- Launch referral program
- PR and media outreach

#### Phase 3: Growth & Scale (Months 7-12)

- Add Instagram and LinkedIn
- Launch premium subscriptions
- Expand to enterprise customers
- International expansion
- Strategic partnerships

### Unit Economics

#### Customer Acquisition

- **CAC (Customer Acquisition Cost)**: $5-10 per user
- **Organic growth** through social sharing
- **Referral program**: $5 bonus for referrer + referee
- **Viral coefficient**: 1.5-2.0 (each user brings 1-2 more)

#### Revenue Per User

- **Average transaction**: $50
- **Transactions per month**: 4-6
- **Monthly revenue per user**: $1-1.50 (at 0.5% fee)
- **Premium subscribers**: $4.99/month
- **LTV (Lifetime Value)**: $50-100 per user

#### Profitability Timeline

- **Break-even**: 50,000 active users
- **Target**: 100,000 users by end of Year 1
- **Projected revenue**: $600K-1M annually at 100K users

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Links

- **GitHub**: https://github.com/notnotrachit/Rivo

---

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- Solana Mobile Stack for wallet adapter
- Twitter API for OAuth integration
- Expo team for React Native framework
- Open source community

---

**Built with ❤️ on Solana**
