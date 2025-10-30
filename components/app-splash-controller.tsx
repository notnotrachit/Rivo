import { SplashScreen } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppView } from '@/components/app-view'
import { AppText } from '@/components/app-text'
import { AppConfig } from '@/constants/app-config'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Image } from 'expo-image'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useEffect } from 'react'

export function AppSplashController() {
  const { isLoading } = useAuth()
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const accentColor = useThemeColor({ light: '#5865F2', dark: '#5865F2' }, 'text')

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync()
    }
  }, [isLoading])

  if (!isLoading) {
    return null
  }

  return (
    <AppView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Image source={require('../assets/logo.svg')} style={styles.logo} />
          <AppText type="title" style={[styles.appName, { color: textColor }]}>
            {AppConfig.name}
          </AppText>
          <AppText style={[styles.subtitle, { color: textColor, opacity: 0.6 }]}>
            Your gateway to seamless crypto payments
          </AppText>
        </View>
        <ActivityIndicator size="large" color={accentColor} style={styles.loader} />
      </View>
    </AppView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  contentContainer: {
    alignItems: 'center',
    gap: 32,
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
  loader: {
    marginTop: 8,
  },
})
