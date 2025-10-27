import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { StyleSheet, View } from 'react-native'

export default function TabHistoryScreen() {
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  return (
    <AppPage>
      <View style={styles.container}>
        <AppText type="title" style={[styles.title, { color: textColor }]}>
          History
        </AppText>
        <AppText style={[styles.subtitle, { color: textColor, opacity: 0.6 }]}>
          Your transaction history will appear here
        </AppText>
      </View>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
})

