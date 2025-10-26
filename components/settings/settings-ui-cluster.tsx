import { AppText } from '@/components/app-text'
import { useCluster } from '../cluster/cluster-provider'
import { ClusterUiVersion } from '@/components/cluster/cluster-ui-version'
import { AppDropdown } from '@/components/app-dropdown'
import { ClusterUiGenesisHash } from '@/components/cluster/cluster-ui-genesis-hash'
import { View, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'

export function SettingsUiCluster() {
  const { selectedCluster, clusters, setSelectedCluster } = useCluster()
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text')
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border')
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#0f0f0f' }, 'background')

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.content}>
        <AppText style={[styles.label, { color: textColor, opacity: 0.6 }]}>
          Select Network
        </AppText>
        <View style={styles.dropdownContainer}>
          <AppDropdown
            items={clusters.map((c) => c.name)}
            selectedItem={selectedCluster.name}
            selectItem={(name) => setSelectedCluster(clusters.find((c) => c.name === name)!)}
          />
        </View>
        
        <View style={[styles.infoSection, { borderTopColor: borderColor }]}>
          <ClusterUiVersion selectedCluster={selectedCluster} />
          <ClusterUiGenesisHash selectedCluster={selectedCluster} />
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  infoSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
})
