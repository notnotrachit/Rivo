import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { AppText } from '@/components/app-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwitterOAuth, TwitterOAuthResult } from '@/hooks/use-twitter-oauth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LinkedTwitter {
  username: string;
  name: string;
  profileImageUrl: string;
}

export function TwitterLinkButton() {
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#e5e5e5', dark: '#333333' }, 'border');
  const { authenticate, loading, error } = useTwitterOAuth();
  const [linkedTwitter, setLinkedTwitter] = useState<LinkedTwitter | null>(null);
  const [linking, setLinking] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load linked Twitter account on mount
  useEffect(() => {
    loadLinkedTwitter();
  }, []);

  const loadLinkedTwitter = async () => {
    try {
      const stored = await AsyncStorage.getItem('linkedTwitter');
      if (stored) {
        setLinkedTwitter(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load linked Twitter:', err);
    }
  };

  const handleLinkTwitter = async () => {
    try {
      setLinking(true);

      // Start OAuth flow
      const result = await authenticate();

      if (!result) {
        // Error is already set in the hook
        return;
      }

      // Store locally (already verified by backend)
      const twitterData: LinkedTwitter = {
        username: result.username,
        name: result.name,
        profileImageUrl: result.profileImageUrl,
      };

      await AsyncStorage.setItem('linkedTwitter', JSON.stringify(twitterData));
      
      // Show success message BEFORE refreshing to ensure it's visible
      const successMsg = `Successfully linked @${result.username}`;
      console.log('🎉 Setting success message:', successMsg);
      setSuccessMessage(successMsg);
      
      // Refresh the linked account display
      await loadLinkedTwitter();
      
      // Keep success message visible for 5 seconds
      setTimeout(() => {
        console.log('⏰ Clearing success message');
        setSuccessMessage(null);
      }, 5000);
      
      console.log(`✅ Successfully linked Twitter account @${result.username}`);
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

  // Debug logging
  console.log('🔍 TwitterLinkButton render - successMessage:', successMessage);
  console.log('🔍 TwitterLinkButton render - linkedTwitter:', linkedTwitter?.username);

  return (
    <View style={styles.container}>
      <AppText style={[styles.title, { color: textColor }]}>Link Twitter Account</AppText>
      <AppText style={[styles.description, { color: textColor, opacity: 0.7 }]}>
        Link your Twitter / X account to receive direct payments from your profile
      </AppText>

      {successMessage && (
        <View style={[styles.successBox, { borderColor: '#22c55e' }]}>
          <AppText style={styles.successText}>✓ {successMessage}</AppText>
        </View>
      )}

      {error && (
        <View style={[styles.errorBox, { borderColor: '#ef4444' }]}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      )}

      {linkedTwitter ? (
        <View style={[styles.linkedCard, { borderColor }]}>
          <View style={styles.linkedContent}>
            {linkedTwitter.profileImageUrl ? (
              <Image
                source={{ uri: linkedTwitter.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: '#5865F2' }]}>
                <AppText style={styles.profileImagePlaceholderText}>
                  {linkedTwitter.username.charAt(0).toUpperCase()}
                </AppText>
              </View>
            )}

            <View style={styles.linkedInfo}>
              <AppText style={[styles.linkedName, { color: textColor }]}>
                {linkedTwitter.name}
              </AppText>
              <AppText style={[styles.linkedHandle, { color: textColor, opacity: 0.6 }]}>
                @{linkedTwitter.username}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.relinkButton, { borderColor }]}
            onPress={handleLinkTwitter}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#5865F2" />
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
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.linkButton]}
          onPress={handleLinkTwitter}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <AppText style={styles.linkButtonText}>Link with Twitter</AppText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  linkButton: {
    backgroundColor: '#5865F2',
  },
  linkButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  linkedCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  linkedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  linkedInfo: {
    flex: 1,
  },
  linkedName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  linkedHandle: {
    fontSize: 14,
  },
  relinkButton: {
    backgroundColor: '#5865F2',
    marginBottom: 8,
  },
  relinkButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  unlinkButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  unlinkButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  successBox: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#16a34a',
    marginTop: 16,
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
    marginTop: 12,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
});
