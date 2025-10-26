import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'
import { AppView } from '@/components/app-view'
import { AppPage } from '@/components/app-page'
import { AccountUiButtons } from './account-ui-buttons'
import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { AccountUiTokenAccounts } from '@/components/account/account-ui-token-accounts'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useCallback, useState } from 'react'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { PublicKey } from '@solana/web3.js'
import { useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { useThemeColor } from '@/hooks/use-theme-color'

export function AccountFeature() {
  const { account } = useWalletUi()
  const [refreshing, setRefreshing] = useState(false)
  const invalidateBalance = useGetBalanceInvalidate({ address: account?.publicKey as PublicKey })
  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({ address: account?.publicKey as PublicKey })
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([invalidateBalance(), invalidateTokenAccounts()])
    setRefreshing(false)
  }, [invalidateBalance, invalidateTokenAccounts])

  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border')
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#0f0f0f' }, 'background')

  return (
    <AppPage>
      {account ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <AppText type="title" style={[styles.headerTitle, { color: textColor }]}>
              Account
            </AppText>
          </View>

          {/* Balance Card */}
          <View style={[styles.balanceCard, { backgroundColor: cardBg, borderColor }]}>
            <AppText style={[styles.balanceLabel, { color: textColor, opacity: 0.6 }]}>
              Total Balance
            </AppText>
            <AccountUiBalance address={account.publicKey} />
            <AppText style={[styles.walletAddress, { color: textColor, opacity: 0.5 }]}>
              {ellipsify(account.publicKey.toString(), 12)}
            </AppText>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <AppText style={[styles.sectionTitle, { color: textColor }]}>
              Quick Actions
            </AppText>
            <AccountUiButtons />
          </View>

          {/* Token Accounts */}
          <View style={styles.tokensSection}>
            <AppText style={[styles.sectionTitle, { color: textColor }]}>
              Token Accounts
            </AppText>
            <AccountUiTokenAccounts address={account.publicKey} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <AppText style={[styles.emptyTitle, { color: textColor }]}>
            Wallet Not Connected
          </AppText>
          <AppText style={[styles.emptyText, { color: textColor, opacity: 0.6 }]}>
            Connect your wallet to view your account details
          </AppText>
          <View style={styles.connectButtonContainer}>
            <WalletUiButtonConnect />
          </View>
        </View>
      )}
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    marginBottom: 4,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletAddress: {
    fontSize: 12,
    marginTop: 16,
    fontFamily: 'monospace',
  },
  buttonsSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tokensSection: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  connectButtonContainer: {
    width: '100%',
  },
})
