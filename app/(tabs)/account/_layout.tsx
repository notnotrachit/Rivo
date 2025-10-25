import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTitle: 'Account', headerRight: () => <WalletUiDropdown /> }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="airdrop" options={{ headerTitle: 'Airdrop', headerRight: () => null }} />
      <Stack.Screen name="send" options={{ headerTitle: 'Send', headerRight: () => null }} />
      <Stack.Screen name="receive" options={{ headerTitle: 'Receive', headerRight: () => null }} />
      <Stack.Screen name="link-social" options={{ headerTitle: 'Link Social', headerRight: () => null }} />
      <Stack.Screen name="send-usdc" options={{ headerTitle: 'Send USDC', headerRight: () => null }} />
      <Stack.Screen name="claim-funds" options={{ headerTitle: 'Claim Funds', headerRight: () => null }} />
    </Stack>
  )
}
