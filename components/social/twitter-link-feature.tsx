import { API_CONFIG } from '@/constants/api-config';
import { EXTENDED_API_CONFIG } from '@/constants/extended-api-config';
import { Button } from '@react-navigation/elements';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../app-text';
import { useAuthorization } from '../solana/use-authorization';
import { useThemeColor } from '@/hooks/use-theme-color';

type LinkedAccounts = {
  twitter?: string | null;
};

export function TwitterLinkFeature() {
  const { selectedAccount } = useAuthorization();
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts | null>(null);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');

  // Fetch linked accounts when component mounts or wallet changes
  useEffect(() => {
    if (selectedAccount) {
      fetchLinkedAccounts();
    }
  }, [selectedAccount]);

  const fetchLinkedAccounts = async () => {
    if (!selectedAccount) return;

    try {
      setIsFetchingAccounts(true);
      const walletAddress = selectedAccount.publicKey.toBase58();
      
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/social/get?wallet=${walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.linked && data.socials) {
        setLinkedAccounts(data.socials);
        // Pre-fill the input field with existing handle
        setTwitterHandle(data.socials.twitter || '');
      } else {
        setLinkedAccounts(null);
      }
    } catch (error) {
      console.error('Failed to fetch linked accounts:', error);
      setLinkedAccounts(null);
    } finally {
      setIsFetchingAccounts(false);
    }
  };

  const handleLinkTwitter = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!twitterHandle.trim()) {
      Alert.alert('Error', 'Please enter your Twitter handle');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = EXTENDED_API_CONFIG.endpoints.linkTwitter;
      console.log('Linking Twitter account:', { handle: twitterHandle, endpoint });

      const response = await fetch(`${EXTENDED_API_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'twitter',
          handle: twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link Twitter account');
      }

      Alert.alert('Success', `Successfully linked Twitter account ${twitterHandle}!`);
      
      // Refresh linked accounts to show the newly linked account
      await fetchLinkedAccounts();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to link Twitter account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AppText style={styles.title}>Link Your Twitter</AppText>
      <AppText style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
        Connect your Twitter account to receive payments from anyone
      </AppText>

      {/* Loading State */}
      {isFetchingAccounts && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5865F2" />
          <AppText style={[styles.loadingText, { color: textColor }]}>Fetching your linked accounts...</AppText>
        </View>
      )}

      {/* Linked Account Display */}
      {!isFetchingAccounts && linkedAccounts?.twitter && (
        <View style={[styles.linkedAccountCard, { backgroundColor, borderColor }]}>
          <AppText style={styles.linkedAccountPlatform}>𝕏 Twitter</AppText>
          <AppText style={styles.linkedAccountHandle}>{linkedAccounts.twitter}</AppText>
          <View style={styles.linkedBadge}>
            <AppText style={styles.linkedBadgeText}>✓ Linked</AppText>
          </View>
        </View>
      )}

      {/* Twitter Input */}
      <View style={styles.inputContainer}>
        <AppText style={[styles.label, { color: textColor }]}>Twitter Handle</AppText>
        <TextInput
          style={[styles.input, { borderColor, color: textColor, backgroundColor }]}
          placeholder="@username"
          placeholderTextColor={textColor}
          value={twitterHandle}
          onChangeText={setTwitterHandle}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <Button
          onPress={handleLinkTwitter}
          disabled={isLoading || !selectedAccount}>
          {isLoading ? 'Linking...' : 'Link Twitter'}
        </Button>
      </View>

      {!selectedAccount && (
        <AppText style={[styles.connectWalletText, { color: textColor }]}>
          Please connect your wallet to link Twitter
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  linkedAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#5865F2',
    borderWidth: 1,
  },
  linkedAccountPlatform: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 10,
  },
  linkedAccountHandle: {
    fontSize: 13,
    opacity: 0.6,
    flex: 1,
    fontFamily: 'monospace',
  },
  linkedBadge: {
    backgroundColor: '#1e4620',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2d7a2d',
  },
  linkedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4ade80',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  connectWalletText: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 13,
  },
});
