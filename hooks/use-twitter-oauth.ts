import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';

// Initialize web browser
WebBrowser.maybeCompleteAuthSession();

export interface TwitterOAuthResult {
  username: string;
  name: string;
  profileImageUrl: string;
}

const TWITTER_CLIENT_ID = process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID || '';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Twitter OAuth endpoints
const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';

// Get redirect URL - use AuthSession.makeRedirectUri for proper platform handling
const getRedirectUrl = () => {
  const scheme = Constants.expoConfig?.scheme;
  const schemeString = Array.isArray(scheme) ? scheme[0] : scheme || 'templateexpobasic';
  return AuthSession.makeRedirectUri({
    scheme: schemeString,
    path: 'oauthredirect',
  });
};

export function useTwitterOAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = getRedirectUrl();

  const authenticate = useCallback(async (walletAddress?: string): Promise<TwitterOAuthResult | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Twitter OAuth] Redirect URL:', redirectUrl);
      console.log('[Twitter OAuth] Client ID:', TWITTER_CLIENT_ID);

      // Create auth request
      const request = new AuthSession.AuthRequest({
        clientId: TWITTER_CLIENT_ID,
        redirectUri: redirectUrl,
        scopes: ['tweet.read', 'users.read'],
        usePKCE: true,
        responseType: AuthSession.ResponseType.Code,
      });

      console.log('[Twitter OAuth] Auth request created, prompting user...');
      
      // Log the full auth URL for debugging
      const authUrl = await request.makeAuthUrlAsync({
        authorizationEndpoint: TWITTER_AUTH_URL,
      });
      console.log('[Twitter OAuth] Full auth URL:', authUrl);

      // Prompt user to authenticate
      const result = await request.promptAsync({
        authorizationEndpoint: TWITTER_AUTH_URL,
      });

      console.log('[Twitter OAuth] Result type:', result.type);
      console.log('[Twitter OAuth] Result:', JSON.stringify(result, null, 2));

      if (result.type !== 'success') {
        // Dismiss browser on error
        await WebBrowser.dismissBrowser();
        const errorMsg = result.type === 'error' 
          ? `Authentication error: ${result.error?.message || 'Unknown error'}`
          : 'Authentication cancelled';
        setError(errorMsg);
        console.error('[Twitter OAuth] Failed:', errorMsg, result);
        return null;
      }

      const { code } = result.params;

      if (!code) {
        setError('No authorization code received');
        return null;
      }

      // Get the code verifier for PKCE
      const codeVerifier = request.codeVerifier;
      console.log('[Twitter OAuth] Code verifier:', codeVerifier?.substring(0, 20) + '...');

      // Send authorization code to backend for secure token exchange
      const backendResponse = await fetch(`${API_URL}/api/social/twitter/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUrl: redirectUrl,
          codeVerifier: codeVerifier,
          walletAddress: walletAddress,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        // Dismiss browser on error
        await WebBrowser.dismissBrowser();
        throw new Error(errorData.error || 'Failed to verify with backend');
      }

      const oauthResult: TwitterOAuthResult = await backendResponse.json();
      
      // Dismiss browser after successful verification
      await WebBrowser.dismissBrowser();

      return oauthResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Twitter OAuth error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    authenticate,
    loading,
    error,
  };
}
