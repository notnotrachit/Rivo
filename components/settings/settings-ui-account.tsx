import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { ellipsify } from '@/utils/ellipsify'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { WalletUiButtonDisconnect } from '@/components/solana/wallet-ui-button-disconnect'
import { View, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

export function SettingsUiAccount() {
  const { account } = useWalletUi()
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border')
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#0f0f0f' }, 'background')

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      {account ? (
        <View style={styles.content}>
          <AppText style={[styles.label, { color: textColor, opacity: 0.6 }]}>
            Connected Wallet
          </AppText>
          <AppText style={[styles.address, { color: textColor }]}>
            {ellipsify(account.publicKey.toString(), 12)}
          </AppText>
          <View style={styles.buttonContainer}>
            <WalletUiButtonDisconnect />
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <AppText style={[styles.label, { color: textColor, opacity: 0.6 }]}>
            No Wallet Connected
          </AppText>
          <AppText style={[styles.description, { color: textColor, opacity: 0.5 }]}>
            Connect your Solana wallet to get started
          </AppText>
          <View style={styles.buttonContainer}>
            <WalletUiButtonConnect />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  address: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
})
