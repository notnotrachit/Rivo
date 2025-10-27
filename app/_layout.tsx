import { PortalHost } from '@rn-primitives/portal'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { AppProviders } from '@/components/app-providers'
import { useCallback, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { View } from 'react-native'
import { useTrackLocations } from '@/hooks/use-track-locations'
import { AppSplashController } from '@/components/app-splash-controller'
import { useAuth } from '@/components/auth/auth-provider'
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Use this hook to track the locations for analytics or debugging.
  // Delete if you don't need it.
  useTrackLocations((pathname, params) => {
    console.log(`Track ${pathname}`, { params })
  })
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    console.log('onLayoutRootView')
    if (loaded) {
      console.log('loaded')
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ShareIntentProvider>
        <ShareLogger />
        <AppProviders>
          <AppSplashController />
          <RootNavigator />
          <StatusBar style="auto" />
        </AppProviders>
      </ShareIntentProvider>
      <PortalHost />
    </View>
  )
}

function ShareLogger() {
  const { hasShareIntent, shareIntent, error } = useShareIntentContext()
  useEffect(() => {
    if (error) {
      console.log('ShareIntent error:', error)
    }
  }, [error])
  useEffect(() => {
    if (!hasShareIntent) return
    try {
      console.log('ShareIntent received:')
      console.log('  text:', shareIntent?.text ?? null)
      console.log('  webUrl:', shareIntent?.webUrl ?? null)
      if (Array.isArray(shareIntent?.files)) {
        console.log(
          '  files:',
          shareIntent.files.map(f => ({ fileName: f.fileName, mimeType: f.mimeType, path: f.path }))
        )
      } else {
        console.log('  files:', null)
      }
      console.log('  meta:', shareIntent?.meta ?? null)
    } catch (e) {
      console.log('ShareIntent log failed:', e)
    }
  }, [hasShareIntent, shareIntent])
  return null
}

function RootNavigator() {
  const { isAuthenticated } = useAuth()
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  )
}
