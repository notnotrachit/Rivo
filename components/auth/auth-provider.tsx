import { Account, useAuthorization } from '@/components/solana/use-authorization'
import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { API_CONFIG } from '@/constants/api-config'
import { AppConfig } from '@/constants/app-config'
import { useMutation } from '@tanstack/react-query'
import * as bs58 from 'bs58'
import { createContext, type PropsWithChildren, use, useMemo } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn, signMessage: mobileWalletSignMessage } = useMobileWallet()
  const { authorizeSession, selectedAccount } = useAuthorization()

  return useMutation({
    mutationFn: async () => {
      try {
        // First connect wallet using Mobile Wallet Adapter
        const account = await signIn({
          uri: AppConfig.uri,
        });

        // Now implement the auth nonce flow
        const address = account.publicKey.toBase58();
        
        // Step 1: Get nonce and message
        const nonceResponse = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.authNonce}?address=${address}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!nonceResponse.ok) {
          throw new Error('Failed to get nonce');
        }

        const { nonce, message } = await nonceResponse.json();

        // Step 2: Sign the message using Mobile Wallet Adapter
        const messageBytes = new TextEncoder().encode(message);
        const signedMessage = await mobileWalletSignMessage(messageBytes);

        // Convert signature to base58
        const signatureB58 = bs58.encode(signedMessage);

        // Step 3: Verify signature
        const verifyResponse = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.authVerify}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address,
              signature: signatureB58,
              message,
            }),
          }
        );

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json().catch(() => ({}));
          throw new Error(
            (errorData as { error?: string }).error || 'Failed to verify signature'
          );
        }

        const { token } = await verifyResponse.json();
        
        // Store token securely if available
        if (token) {
          try {
            // Store in AsyncStorage for React Native
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.setItem('auth_token', token);
          } catch (e) {
            console.warn('Failed to store token:', e);
          }
        }

        return { ...account, token };
      } catch (error) {
        console.error('Failed to complete authentication:', error);
        throw error;
      }
    },
  })
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { disconnect } = useMobileWallet()
  const { accounts, isLoading } = useAuthorization()
  const signInMutation = useSignInMutation()

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => await signInMutation.mutateAsync(),
      signOut: async () => await disconnect(),
      isAuthenticated: (accounts?.length ?? 0) > 0,
      isLoading: signInMutation.isPending || isLoading,
    }),
    [accounts, disconnect, signInMutation, isLoading],
  )

  return <Context value={value}>{children}</Context>
}
