import { API_CONFIG } from '@/constants/api-config'
import { EXTENDED_API_CONFIG } from '@/constants/extended-api-config'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Button } from '@react-navigation/elements'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, TextInput, View } from 'react-native'
import { AppText } from '../app-text'
import { AppView } from '../app-view'
import { useAuthorization } from '../solana/use-authorization'

type LinkedAccounts = {
  twitter?: string | null
  instagram?: string | null
  linkedin?: string | null
}

export function SocialLinkFeature() {
  const { selectedAccount } = useAuthorization()

  // Theme colors
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')

  const [twitterHandle, setTwitterHandle] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [linkedinHandle, setLinkedinHandle] = useState('')
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null)
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts | null>(null)
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false)

  // Fetch linked accounts when component mounts or wallet changes
  useEffect(() => {
    if (selectedAccount) {
      fetchLinkedAccounts()
    }
  }, [selectedAccount])

  const fetchLinkedAccounts = async () => {
    if (!selectedAccount) return

    try {
      setIsFetchingAccounts(true)
      const walletAddress = selectedAccount.publicKey.toBase58()

      const response = await fetch(`${API_CONFIG.baseUrl}/api/social/get?wallet=${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.linked && data.socials) {
        setLinkedAccounts(data.socials)
        // Pre-fill the input fields with existing handles
        setTwitterHandle(data.socials.twitter || '')
        setInstagramHandle(data.socials.instagram || '')
        setLinkedinHandle(data.socials.linkedin || '')
      } else {
        setLinkedAccounts(null)
      }
    } catch (error) {
      console.error('Failed to fetch linked accounts:', error)
      setLinkedAccounts(null)
    } finally {
      setIsFetchingAccounts(false)
    }
  }

  const handleLinkSocial = async (platform: 'twitter' | 'instagram' | 'linkedin') => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first')
      return
    }

    let handle = ''
    switch (platform) {
      case 'twitter':
        handle = twitterHandle
        break
      case 'instagram':
        handle = instagramHandle
        break
      case 'linkedin':
        handle = linkedinHandle
        break
    }

    if (!handle.trim()) {
      Alert.alert('Error', `Please enter your ${platform} handle`)
      return
    }

    setLoadingPlatform(platform)
    try {
      const endpoint = EXTENDED_API_CONFIG.endpoints.linkTwitter // All platforms use the same endpoint
      console.log('Linking social account:', { platform, handle, endpoint })

      const response = await fetch(`${EXTENDED_API_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to link ${platform} account`)
      }

      Alert.alert('Success', `Successfully linked ${platform} account ${handle}!`)

      // Refresh linked accounts to show the newly linked account
      await fetchLinkedAccounts()
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to link ${platform} account`)
    } finally {
      setLoadingPlatform(null)
    }
  }

  return (
    <AppView>
      <View style={styles.container}>
        <AppText style={styles.title}>Link Social Accounts</AppText>
        <AppText style={styles.subtitle}>Link your social media accounts to receive payments from anyone</AppText>

        {/* Loading State */}
        {isFetchingAccounts && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <AppText style={styles.loadingText}>Fetching your linked accounts...</AppText>
          </View>
        )}

        {/* Linked Accounts Display */}
        {!isFetchingAccounts && linkedAccounts && (
          <View style={styles.linkedAccountsSection}>
            <AppText style={styles.linkedAccountsTitle}>Your Linked Accounts</AppText>

            {linkedAccounts.twitter && (
              <View style={[styles.linkedAccountCard, { borderColor, borderLeftColor: tintColor }]}>
                <AppText style={styles.linkedAccountPlatform}>𝕏 Twitter</AppText>
                <AppText style={styles.linkedAccountHandle}>{linkedAccounts.twitter}</AppText>
                <View style={styles.linkedBadge}>
                  <AppText style={styles.linkedBadgeText}>✓ Linked</AppText>
                </View>
              </View>
            )}

            {linkedAccounts.instagram && (
              <View style={[styles.linkedAccountCard, { borderColor, borderLeftColor: tintColor }]}>
                <AppText style={styles.linkedAccountPlatform}>📷 Instagram</AppText>
                <AppText style={styles.linkedAccountHandle}>{linkedAccounts.instagram}</AppText>
                <View style={styles.linkedBadge}>
                  <AppText style={styles.linkedBadgeText}>✓ Linked</AppText>
                </View>
              </View>
            )}

            {linkedAccounts.linkedin && (
              <View style={[styles.linkedAccountCard, { borderColor, borderLeftColor: tintColor }]}>
                <AppText style={styles.linkedAccountPlatform}>💼 LinkedIn</AppText>
                <AppText style={styles.linkedAccountHandle}>{linkedAccounts.linkedin}</AppText>
                <View style={styles.linkedBadge}>
                  <AppText style={styles.linkedBadgeText}>✓ Linked</AppText>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Twitter Input */}
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>Twitter Handle</AppText>
          <TextInput
            style={[styles.input, { borderColor, backgroundColor: '#1a1830', color: textColor }]}
            placeholder="@username"
            placeholderTextColor={borderColor}
            value={twitterHandle}
            onChangeText={setTwitterHandle}
            autoCapitalize="none"
            editable={loadingPlatform !== 'twitter'}
          />
          <Button onPress={() => handleLinkSocial('twitter')} disabled={loadingPlatform !== null || !selectedAccount}>
            {loadingPlatform === 'twitter' ? 'Linking...' : 'Link Twitter'}
          </Button>
        </View>

        {/* Instagram Input */}
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>Instagram Handle</AppText>
          <TextInput
            style={[styles.input, { borderColor, backgroundColor: '#1a1830', color: textColor }]}
            placeholder="@username"
            placeholderTextColor={borderColor}
            value={instagramHandle}
            onChangeText={setInstagramHandle}
            autoCapitalize="none"
            editable={loadingPlatform !== 'instagram'}
          />
          <Button onPress={() => handleLinkSocial('instagram')} disabled={loadingPlatform !== null || !selectedAccount}>
            {loadingPlatform === 'instagram' ? 'Linking...' : 'Link Instagram'}
          </Button>
        </View>

        {/* LinkedIn Input */}
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>LinkedIn Handle</AppText>
          <TextInput
            style={[styles.input, { borderColor, backgroundColor: '#1a1830', color: textColor }]}
            placeholder="@username"
            placeholderTextColor={borderColor}
            value={linkedinHandle}
            onChangeText={setLinkedinHandle}
            autoCapitalize="none"
            editable={loadingPlatform !== 'linkedin'}
          />
          <Button onPress={() => handleLinkSocial('linkedin')} disabled={loadingPlatform !== null || !selectedAccount}>
            {loadingPlatform === 'linkedin' ? 'Linking...' : 'Link LinkedIn'}
          </Button>
        </View>

        {!selectedAccount && (
          <AppText style={styles.connectWalletText}>Please connect your wallet to link social accounts</AppText>
        )}
      </View>
    </AppView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    opacity: 0.7,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  linkedAccountsSection: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3A386D',
  },
  linkedAccountsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#e0e0e0',
  },
  linkedAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  linkedAccountPlatform: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    color: '#ffffff',
  },
  linkedAccountHandle: {
    fontSize: 12,
    opacity: 0.6,
    flex: 1,
    color: '#b0b0b0',
  },
  linkedBadge: {
    backgroundColor: '#1e4620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2d7a2d',
  },
  linkedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4ade80',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  connectWalletText: {
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.6,
  },
})
