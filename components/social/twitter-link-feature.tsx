import { API_CONFIG } from '@/constants/api-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { AppText } from '../app-text';
import { useAuthorization } from '../solana/use-authorization';
import { useTwitterOAuth, TwitterOAuthResult } from '@/hooks/use-twitter-oauth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LinkedTwitter {
  username: string;
  name: string;
  profileImageUrl: string;
  walletAddress: string;
}

export function TwitterLinkFeature() {
  const { selectedAccount } = useAuthorization();
  const { authenticate, loading, error } = useTwitterOAuth();
  const [linkedTwitter, setLinkedTwitter] = useState<LinkedTwitter | null>(null);
  const [linking, setLinking] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#111216' }, 'background');
  const textColor = useThemeColor({ light: '#0b0b0c', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#e7e7ea', dark: '#1b1c20' }, 'border');
  const mutedText = useThemeColor({ light: '#5a5f6a', dark: '#9aa0aa' }, 'text');

  // Load linked Twitter account on mount and when wallet changes
  useEffect(() => {
    loadLinkedTwitter();
  }, [selectedAccount]);

  const loadLinkedTwitter = async () => {
    try {
      // First try to load from backend
      if (selectedAccount) {
        const walletAddress = selectedAccount.publicKey.toBase58();
        console.log('[Twitter] Fetching linked accounts from backend...');
        
        const response = await fetch(`${API_CONFIG.baseUrl}/api/social/get?wallet=${walletAddress}`);
        const data = await response.json();
        
        if (data.linked && data.socials?.twitter) {
          console.log('[Twitter] Found linked Twitter account:', data.socials.twitter);
          
          // Handle both string and object formats from backend
          const twitterData = data.socials.twitter;
          const twitterInfo = typeof twitterData === 'string' 
            ? { username: twitterData, name: twitterData, profileImageUrl: '' }
            : { 
                username: twitterData.handle?.replace('@', '') || twitterData.username || '',
                name: twitterData.name || twitterData.handle || '',
                profileImageUrl: twitterData.profileImageUrl || ''
              };
          
          setLinkedTwitter({
            ...twitterInfo,
            walletAddress: walletAddress,
          });
          return;
        }
      }
      
      // Fallback to local storage
      const stored = await AsyncStorage.getItem('linkedTwitter');
      if (stored) {
        const data = JSON.parse(stored);
        setLinkedTwitter(data);
      } else {
        setLinkedTwitter(null);
      }
    } catch (err) {
      console.error('Failed to load linked Twitter:', err);
      // Fallback to local storage on error
      try {
        const stored = await AsyncStorage.getItem('linkedTwitter');
        if (stored) {
          const data = JSON.parse(stored);
          setLinkedTwitter(data);
        }
      } catch (e) {
        console.error('Failed to load from local storage:', e);
      }
    }
  };

  const handleLinkTwitter = async () => {
    if (!selectedAccount) {
      console.error('No wallet connected');
      return;
    }

    try {
      setLinking(true);

      // Get wallet address
      const walletAddress = selectedAccount.publicKey.toBase58();
      
      // Start OAuth flow
      console.log('[Twitter OAuth] Starting OAuth flow...');
      const result = await authenticate(walletAddress);

      if (!result) {
        return;
      }
      
      // Store Twitter data with wallet address
      const twitterData: LinkedTwitter = {
        username: result.username,
        name: result.name,
        profileImageUrl: result.profileImageUrl,
        walletAddress: walletAddress,
      };

      await AsyncStorage.setItem('linkedTwitter', JSON.stringify(twitterData));
      
      // Update linked account immediately
      setLinkedTwitter(twitterData);
      
      // Show success message
      const successMsg = `✓ Successfully linked @${result.username} to your wallet!`;
      setSuccessMessage(successMsg);
      console.log(`✅ ${successMsg}`);
      
      // Keep success message visible for 5 seconds
      setTimeout(() => {
        console.log('⏰ Clearing success message');
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to link Twitter';
      console.error('Twitter linking error:', errorMessage, err);
    } finally {
      setLinking(false);
    }
  };

  const handleUnlink = async () => {
    try {
      await AsyncStorage.removeItem('linkedTwitter');
      setLinkedTwitter(null);
      setSuccessMessage('Twitter account unlinked');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to unlink Twitter account:', err);
    }
  };

  const isLoading = loading || linking;

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {/* Success Message */}
      {successMessage && (
        <View style={styles.successBox}>
          <AppText style={styles.successText}>✓ {successMessage}</AppText>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorBox}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}

      {linkedTwitter ? (
        // Linked Account Display
        <View style={styles.linkedCard}>
          <View style={styles.linkedContent}>
            {linkedTwitter.profileImageUrl ? (
              <Image
                source={{ uri: linkedTwitter.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: '#1d9bf0' }]}>
                <AppText style={styles.profileImagePlaceholderText}>
                  {linkedTwitter.username.charAt(0).toUpperCase()}
                </AppText>
              </View>
            )}

            <View style={styles.linkedInfo}>
              <AppText style={[styles.linkedName, { color: textColor }]}>
                {linkedTwitter.name}
              </AppText>
              <AppText style={[styles.linkedHandle, { color: mutedText }]}>
                @{linkedTwitter.username}
              </AppText>
              <View style={styles.linkedBadge}>
                <View style={styles.linkedBadgeDot} />
                <AppText style={styles.linkedBadgeText}>Linked to Wallet</AppText>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.relinkButton]}
              onPress={handleLinkTwitter}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#1d9bf0" size="small" />
              ) : (
                <AppText style={styles.relinkButtonText}>Relink</AppText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.unlinkButton]}
              onPress={handleUnlink}
              disabled={isLoading}
            >
              <AppText style={styles.unlinkButtonText}>Unlink</AppText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Link Button
        <TouchableOpacity
          style={[styles.button, styles.linkButton]}
          onPress={handleLinkTwitter}
          disabled={isLoading || !selectedAccount}
        >
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="white" size="small" />
              <AppText style={styles.linkButtonText}>Linking...</AppText>
            </View>
          ) : (
            <AppText style={styles.linkButtonText}>🐦 Link Twitter Account</AppText>
          )}
        </TouchableOpacity>
      )}

      {!selectedAccount && (
        <AppText style={[styles.connectWalletText, { color: mutedText }]}>
          Connect your wallet to link Twitter
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  successBox: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  linkedCard: {
    marginBottom: 0,
  },
  linkedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  profileImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  linkedInfo: {
    flex: 1,
  },
  linkedName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  linkedHandle: {
    fontSize: 14,
    marginBottom: 8,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14532d',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  linkedBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  linkedBadgeText: {
    color: '#86efac',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#1d9bf0',
    marginBottom: 12,
  },
  linkButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  relinkButton: {
    backgroundColor: '#1d9bf0',
  },
  relinkButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  unlinkButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  unlinkButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  connectWalletText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 13,
  },
});
