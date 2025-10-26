import { SettingsUiCluster } from '@/components/settings/settings-ui-cluster'
import { AppText } from '@/components/app-text'
import { SettingsAppConfig } from '@/components/settings/settings-app-config'
import { SettingsUiAccount } from '@/components/settings/settings-ui-account'
import { AppPage } from '@/components/app-page'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

export default function TabSettingsScreen() {
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')

  return (
    <AppPage>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <AppText type="title" style={[styles.headerTitle, { color: textColor }]}>
            Settings
          </AppText>
          <AppText style={[styles.headerSubtitle, { color: textColor, opacity: 0.6 }]}>
            Configure your app preferences
          </AppText>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { color: textColor }]}>Account</AppText>
          <SettingsUiAccount />
        </View>

        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { color: textColor }]}>Network</AppText>
          <SettingsUiCluster />
        </View>

        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { color: textColor }]}>Configuration</AppText>
          <SettingsAppConfig />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <AppText type="default" style={[styles.footerText, { color: textColor, opacity: 0.5 }]}>
            Configure app info and clusters in{' '}
            <AppText type="defaultSemiBold" style={[{ color: textColor, opacity: 0.7 }]}>
              constants/app-config.tsx
            </AppText>
          </AppText>
        </View>
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 28,
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
  },
})
