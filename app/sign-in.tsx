import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useAuth } from '@/components/auth/auth-provider'
import { AppConfig } from '@/constants/app-config'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Button } from '@react-navigation/elements'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignIn() {
  const { signIn, isLoading } = useAuth()
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const accentColor = useThemeColor({ light: '#5865F2', dark: '#5865F2' }, 'text')
  
  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <AppText style={{ marginTop: 16, textAlign: 'center', opacity: 0.7 }}>
            Connecting wallet...
          </AppText>
        </View>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          {/* Dummy view to push the next view to the center. */}
          <View />
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <Image source={require('../assets/logo.svg')} style={styles.logo} />
              <AppText type="title" style={[styles.appName, { color: textColor }]}>
                {AppConfig.name}
              </AppText>
              <AppText style={[styles.subtitle, { color: textColor, opacity: 0.6 }]}>
                Connect your Solana wallet to get started
              </AppText>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              variant="filled"
              style={styles.connectButton}
              onPress={async () => {
                await signIn()
                router.replace('/')
              }}
            >
              Connect Wallet
            </Button>
          </View>
        </SafeAreaView>
      )}
    </AppView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    gap: 24,
  },
  headerSection: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  appName: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  connectButton: {
    paddingVertical: 12,
  },
})
