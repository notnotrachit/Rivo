import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { useThemeColor } from '@/hooks/use-theme-color'
import { clearTransactionHistory, getTransactionHistory, TransactionHistoryItem } from '@/utils/transaction-history'
import React, { useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TabHistoryScreen() {
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const backgroundColor = useThemeColor({}, 'background')
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const history = await getTransactionHistory()
      setTransactions(history)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'Are you sure you want to clear all transaction history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearTransactionHistory()
          setTransactions([])
        },
      },
    ])
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <AppPage>
        <View style={styles.headerContainer}>
          <AppText type="title" style={[styles.title, { color: textColor }]}>
            History
          </AppText>
          <WalletUiDropdown />
        </View>
        <View style={styles.emptyContainer}>
          <AppText style={[styles.emptyText, { color: textColor, opacity: 0.6 }]}>Loading...</AppText>
        </View>
      </AppPage>
    )
  }

  return (
    <AppPage>
      <View style={styles.headerContainer}>
        <AppText type="title" style={[styles.title, { color: textColor }]}>
          History
        </AppText>
        <WalletUiDropdown />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTransactions} tintColor={textColor} />}
      >
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText style={[styles.emptyText, { color: textColor, opacity: 0.6 }]}>No transactions yet</AppText>
            <AppText style={[styles.emptySubtext, { color: textColor, opacity: 0.4 }]}>
              Your transaction history will appear here
            </AppText>
          </View>
        ) : (
          <>
            {transactions.map((tx) => (
              <View key={tx.id} style={[styles.transactionCard, { borderColor, backgroundColor: '#1a1830' }]}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionHeaderLeft}>
                    <View
                      style={[styles.transactionIcon, tx.flow === 'linked' ? styles.iconLinked : styles.iconUnlinked]}
                    >
                      <Text style={styles.transactionIconText}>{tx.flow === 'linked' ? '✓' : '⏳'}</Text>
                    </View>
                    <View>
                      <AppText style={[styles.recipientName, { color: textColor }]}>{tx.recipient}</AppText>
                      <AppText style={[styles.timestamp, { color: textColor, opacity: 0.6 }]}>
                        {formatTimestamp(tx.timestamp)}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.amountContainer}>
                    <AppText style={styles.amount}>{tx.amount} USDC</AppText>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <AppText style={[styles.statusLabel, { color: textColor, opacity: 0.7 }]}>Status: </AppText>
                  <AppText style={[styles.statusValue, { color: tx.flow === 'linked' ? '#10b981' : '#3b82f6' }]}>
                    {tx.flow === 'linked' ? 'Direct Transfer' : 'Escrow'}
                  </AppText>
                </View>

                <View style={[styles.signatureRow, { borderTopColor: borderColor }]}>
                  <AppText style={[styles.signatureLabel, { color: textColor, opacity: 0.5 }]}>
                    {tx.transactionSignature.substring(0, 8)}...
                    {tx.transactionSignature.substring(tx.transactionSignature.length - 8)}
                  </AppText>
                </View>
              </View>
            ))}

            {transactions.length > 0 && (
              <TouchableOpacity style={[styles.clearButton, { borderColor }]} onPress={handleClearHistory}>
                <Text style={[styles.clearButtonText, { color: '#ef4444' }]}>Clear History</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  transactionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: '#1a1830',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconLinked: {
    backgroundColor: '#1e4620',
  },
  iconUnlinked: {
    backgroundColor: '#1e3a5f',
  },
  transactionIconText: {
    fontSize: 20,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  signatureRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  signatureLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  clearButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
