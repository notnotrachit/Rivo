import { buildClaimTransaction, getPendingClaims, lamportsToUsdc, PendingClaim } from '@/utils/send-money'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Transaction } from '@solana/web3.js'
import * as bs58 from 'bs58'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AppPage } from '../app-page'
import { AppText } from '../app-text'
import { useAuthorization } from '../solana/use-authorization'
import { useMobileWallet } from '../solana/use-mobile-wallet'

interface Props {
  socialHandle: string
}

export function ClaimTokensFeature({ socialHandle }: Props) {
  const { selectedAccount } = useAuthorization()
  const { signAndSendTransaction } = useMobileWallet()

  // Theme colors
  const tintColor = useThemeColor({}, 'tint')

  const [pendingClaim, setPendingClaim] = useState<PendingClaim | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingClaims()
  }, [socialHandle])

  const fetchPendingClaims = async () => {
    try {
      setIsFetching(true)
      setError(null)

      const claim = await getPendingClaims(socialHandle)
      setPendingClaim(claim)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending claims')
    } finally {
      setIsFetching(false)
    }
  }

  const handleClaimTokens = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first')
      return
    }

    if (!pendingClaim || pendingClaim.amount === 0) {
      Alert.alert('Error', 'No pending tokens to claim')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build claim transaction
      const txBase58 = await buildClaimTransaction(socialHandle)

      // Decode transaction
      const txBuffer = bs58.decode(txBase58)
      const tx = Transaction.from(txBuffer)

      // Sign and send transaction
      const signature = await signAndSendTransaction(tx, 0)

      Alert.alert(
        'Success',
        `Claimed ${lamportsToUsdc(pendingClaim.amount)} USDC! Signature: ${signature.substring(0, 20)}...`,
      )

      // Refresh pending claims
      await fetchPendingClaims()
    } catch (err: any) {
      setError(err.message || 'Failed to claim tokens')
    } finally {
      setLoading(false)
    }
  }

  if (isFetching) {
    return (
      <AppPage>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={tintColor} />
          <AppText style={styles.loadingText}>Checking pending claims...</AppText>
        </View>
      </AppPage>
    )
  }

  if (!pendingClaim || pendingClaim.amount === 0 || pendingClaim.claimed) {
    return null
  }

  const amountInUsdc = lamportsToUsdc(pendingClaim.amount)

  return (
    <AppPage>
      <View style={styles.container}>
        <View style={styles.claimCard}>
          <AppText style={styles.claimTitle}>Pending USDC</AppText>
          <AppText style={styles.claimAmount}>{amountInUsdc.toFixed(2)} USDC</AppText>
          <AppText style={styles.claimSubtitle}>
            {pendingClaim.paymentCount} payment{pendingClaim.paymentCount !== 1 ? 's' : ''} received
          </AppText>

          <TouchableOpacity
            style={[styles.claimButton, loading && styles.buttonDisabled]}
            onPress={handleClaimTokens}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.claimButtonText}>Claim Tokens</Text>}
          </TouchableOpacity>

          {error && (
            <View style={styles.errorCard}>
              <AppText style={styles.errorText}>{error}</AppText>
            </View>
          )}
        </View>
      </View>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  claimCard: {
    width: '100%',
    backgroundColor: '#1e4620',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    alignItems: 'center',
  },
  claimTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  claimAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 4,
  },
  claimSubtitle: {
    fontSize: 12,
    color: '#86efac',
    marginBottom: 20,
  },
  claimButton: {
    width: '100%',
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  claimButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorCard: {
    width: '100%',
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
})
