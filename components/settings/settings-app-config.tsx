import { AppConfig } from '@/constants/app-config'
import { AppText } from '@/components/app-text'
import { AppExternalLink, AppExternalLinkProps } from '@/components/app-external-link'
import { View, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

export function SettingsAppConfig() {
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border')
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#0f0f0f' }, 'background')

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.content}>
        <View style={styles.configItem}>
          <AppText style={[styles.label, { color: textColor, opacity: 0.6 }]}>
            App Name
          </AppText>
          <AppText style={[styles.value, { color: textColor }]}>
            {AppConfig.name}
          </AppText>
        </View>

        <View style={[styles.divider, { borderBottomColor: borderColor }]} />

        <View style={styles.configItem}>
          <AppText style={[styles.label, { color: textColor, opacity: 0.6 }]}>
            Website
          </AppText>
          <AppText type="link" style={styles.link}>
            <AppExternalLink href={AppConfig.uri as AppExternalLinkProps['href']}>
              {AppConfig.uri}
            </AppExternalLink>
          </AppText>
        </View>
      </View>
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
  configItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  link: {
    fontSize: 14,
  },
})
