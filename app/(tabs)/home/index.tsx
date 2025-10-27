import { View, StyleSheet, ScrollView } from 'react-native';
import { AppView } from '../../../components/app-view';
import { TwitterLinkFeature } from '@/components/social/twitter-link-feature';
import { AppText } from '@/components/app-text';
import { useAuth } from '@/components/auth/auth-provider';
import { useAuthorization } from '@/components/solana/use-authorization';
import { BaseButton } from '@/components/solana/base-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ellipsify } from '@/utils/ellipsify';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  const { isAuthenticated, signOut } = useAuth();
  const { selectedAccount } = useAuthorization();
  
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#1a1a1a' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'border');
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#0f0f0f' }, 'background');

  return (
    <AppView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <AppText type="title" style={[styles.headerTitle, { color: textColor }]}>
              Welcome
            </AppText>
            <AppText style={[styles.headerSubtitle, { color: textColor, opacity: 0.6 }]}>
              Manage your wallet and social connections
            </AppText>
          </View>

          {/* Wallet Status Card */}
          <View style={[styles.statusCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.statusHeader}>
              <AppText style={[styles.statusTitle, { color: textColor }]}>Wallet Status</AppText>
              <View style={[styles.statusBadge, { backgroundColor: isAuthenticated ? '#10b98126' : '#ef444426' }]}>
                <View style={[styles.statusDot, { backgroundColor: isAuthenticated ? '#4ade80' : '#ef4444' }]} />
                <AppText style={[styles.statusBadgeText, { color: isAuthenticated ? '#4ade80' : '#ef4444' }]}>
                  {isAuthenticated ? 'Connected' : 'Disconnected'}
                </AppText>
              </View>
            </View>
            
            {isAuthenticated && (
              <View style={{ alignItems: 'flex-end', marginBottom: 16 }}>
                <BaseButton label="Disconnect" onPress={signOut} />
              </View>
            )}

            {selectedAccount && (
              <View style={styles.walletInfo}>
                <AppText style={[styles.walletLabel, { color: textColor, opacity: 0.6 }]}>
                  Wallet Address
                </AppText>
                <AppText style={[styles.walletAddress, { color: textColor }]}>
                  {ellipsify(selectedAccount.publicKey.toBase58(), 12)}
                </AppText>
              </View>
            )}
          </View>

          {/* Twitter Linking */}
          {isAuthenticated && (
            <View style={styles.twitterSection}>
              <TwitterLinkFeature />
            </View>
          )}

          {!isAuthenticated && (
            <View style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
              <AppText style={[styles.emptyStateTitle, { color: textColor }]}>
                Connect Your Wallet
              </AppText>
              <AppText style={[styles.emptyStateText, { color: textColor, opacity: 0.6 }]}>
                Connect your Solana wallet to link social accounts and manage your funds
              </AppText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AppView>
  );
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
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  walletInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  walletLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletAddress: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  twitterSection: {
    marginBottom: 16,
  },
  emptyState: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});