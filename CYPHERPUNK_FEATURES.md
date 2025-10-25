# Cypherpunk Social Payment Features

This mobile app includes all the functionality from the Cypherpunk webapp for social payments on Solana.

## Features

### 1. Link Social Account
**Screen:** `/(tabs)/account/link-social`

Link your Twitter account to your Solana wallet so others can send you USDC using just your Twitter handle.

- Enter your Twitter handle (with or without @)
- Connects to your wallet automatically
- Stores the link on-chain via the Cypherpunk smart contract

### 2. Send USDC
**Screen:** `/(tabs)/account/send-usdc`

Send USDC to anyone using their Twitter handle, even if they haven't linked their wallet yet.

**Features:**
- Check if a Twitter user has linked their wallet
- Send directly if wallet is linked
- Send to escrow if wallet is not linked (they can claim later)
- Uses Mobile Wallet Adapter for secure signing

**Flow:**
1. Enter Twitter handle
2. Click "Check Wallet" to see if they're linked
3. Enter amount in USDC
4. Click "Send USDC"
5. Sign transaction with your mobile wallet

### 3. Claim Pending Funds
**Screen:** `/(tabs)/account/claim-funds`

Check if anyone has sent you USDC before you linked your wallet, and claim those funds.

**Features:**
- View all pending claims for your linked social accounts
- See payment history with individual transactions
- Shows sender addresses and amounts
- Claim all accumulated funds at once

**Flow:**
1. Click "Check for Pending Claims"
2. View pending claims (if any)
3. Expand to see payment history
4. Click "Claim" to receive the funds
5. Sign transaction with your mobile wallet

## Configuration

### API Endpoint
Update the API base URL in `constants/api-config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: __DEV__ ? 'http://localhost:3000' : 'https://your-production-url.com',
  // ...
};
```

For local development:
- Make sure your backend is running on `http://localhost:3000`
- Or use your computer's local IP address (e.g., `http://192.168.1.100:3000`)

### Network
The app is configured to use Solana Devnet by default. Update `constants/app-config.ts` to change networks.

## Technical Details

### Mobile Wallet Adapter
All transactions use the Solana Mobile Wallet Adapter protocol for secure signing:
- Transactions are built on the backend
- Sent to the mobile app as base64-encoded transactions
- User signs with their mobile wallet (Phantom, Solflare, etc.)
- Transaction is sent to the network

### Smart Contract Integration
The app integrates with the Cypherpunk smart contract:
- Program ID: `BCD29c55GrdmwUefJ8ndbp49TuH4h3khj62CrRaD1tx9`
- Supports social linking, direct payments, and escrow payments
- Payment history tracked on-chain with individual PaymentRecord accounts

### Dependencies
Key packages used:
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js` - Mobile wallet integration
- `@solana/web3.js` - Solana blockchain interaction
- `@solana/spl-token` - Token operations
- `js-base64` - Base64 encoding/decoding for transactions
- `expo-router` - Navigation

## Development

### Running the App

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run on Android
pnpm android

# Run on iOS
pnpm ios
```

### Testing

1. Connect a mobile wallet (Phantom, Solflare, etc.)
2. Make sure you have some SOL for transaction fees
3. Get devnet USDC from a faucet or the webapp
4. Test linking your social account
5. Test sending USDC to another Twitter handle
6. Test claiming pending funds

## Troubleshooting

### "Failed to connect to backend"
- Make sure your backend is running
- Check the API_CONFIG.baseUrl is correct
- For local development, use your computer's IP address, not localhost

### "Transaction failed"
- Make sure you have enough SOL for transaction fees
- Check that you have USDC in your wallet
- Verify the recipient's Twitter handle is correct

### "No pending claims found"
- Make sure you've linked your social account first
- Check that someone has actually sent you USDC
- Try refreshing by clicking "Check for Pending Claims" again

## Production Deployment

Before deploying to production:

1. Update `API_CONFIG.baseUrl` to your production API URL
2. Update the smart contract program ID if using a different deployment
3. Change the network from devnet to mainnet in `app-config.ts`
4. Update the USDC mint address to mainnet USDC
5. Test thoroughly on devnet first!

## Support

For issues or questions:
- Check the main Cypherpunk README
- Review the smart contract documentation
- Check the webapp implementation for reference
