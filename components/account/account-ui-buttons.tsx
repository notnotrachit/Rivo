import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@react-navigation/elements'

export function AccountUiButtons() {
  const router = useRouter()
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        <Button onPressIn={() => router.navigate('/(tabs)/account/airdrop')}>Airdrop</Button>
        <Button onPressIn={() => router.navigate('/(tabs)/account/send')}>Send</Button>
        <Button onPressIn={() => router.navigate('/(tabs)/account/receive')}>Receive</Button>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <Button onPressIn={() => router.navigate('/(tabs)/account/link-social')}>Link Social</Button>
        <Button onPressIn={() => router.navigate('/(tabs)/account/send-usdc')}>Send USDC</Button>
        <Button onPressIn={() => router.navigate('/(tabs)/account/claim-funds')}>Claim Funds</Button>
      </View>
    </View>
  )
}
