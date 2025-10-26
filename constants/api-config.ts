// API configuration for Cypherpunk backend
export const API_CONFIG = {
  // Change this to your production URL when deploying
  baseUrl: __DEV__ ? 'http://192.168.29.170:3000' : 'http://192.168.29.170:3000',
  
  endpoints: {
    // Social linking
    linkTwitter: '/api/social/link',
    findWallet: '/api/social/find-wallet',
    
    // Token operations
    buildTransaction: '/api/tokens/build-transaction',
    buildUnlinkedTransaction: '/api/tokens/build-unlinked-transaction',
    buildClaimTransaction: '/api/tokens/build-claim-transaction',
    pendingClaims: '/api/tokens/pending-claims',
    paymentHistory: '/api/tokens/payment-history',
    
    // User
    me: '/api/user/me',
    
    // Auth
    authNonce: '/api/auth/nonce',
    authVerify: '/api/auth/verify',
  },
  
  // USDC mint address on devnet
  usdcMint: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
};
