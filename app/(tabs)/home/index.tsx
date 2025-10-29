import { AppText } from '@/components/app-text';
import { useAuth } from '@/components/auth/auth-provider';
import { TwitterLinkFeature } from '@/components/social/twitter-link-feature';
import { useAuthorization } from '@/components/solana/use-authorization';
import { API_CONFIG } from '@/constants/api-config';
import { AppConfig } from '@/constants/app-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ellipsify } from '@/utils/ellipsify';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppView } from '../../../components/app-view';

export default function HomePage() {
  const { isAuthenticated, signOut } = useAuth();
  const { selectedAccount } = useAuthorization();
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  
  const textColor = useThemeColor({}, 'text');
  const mutedText = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');

  // Fetch USDC balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!selectedAccount) {
        setUsdcBalance(null);
        return;
      }

      try {
        setLoadingBalance(true);
        const connection = new Connection(AppConfig.clusters[0].endpoint, 'confirmed');
        const mintPubkey = new PublicKey(API_CONFIG.usdcMint);
        const walletPubkey = selectedAccount.publicKey;

        const tokenAccount = await getAssociatedTokenAddress(mintPubkey, walletPubkey);
        const accountInfo = await connection.getTokenAccountBalance(tokenAccount);

        if (accountInfo.value) {
          // Convert from lamports to USDC (6 decimals)
          const balance = Number.parseFloat(accountInfo.value.amount) / 1_000_000;
          setUsdcBalance(balance);
        } else {
          setUsdcBalance(0);
        }
      } catch (error) {
        console.error('Failed to fetch USDC balance:', error);
        setUsdcBalance(0);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [selectedAccount]);

  return (
    <AppView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16 }]}>
          {/* Decorative backdrop */}
          <View style={[styles.backdropContainer]} pointerEvents="none">
            <View style={[styles.backdropBlob, { backgroundColor: `${tint}44`, top: 120, left: -20, transform: [{ rotate: '18deg' }] }]} />
            <View style={[styles.backdropBlob, { backgroundColor: `${tint}22`, top: 170, right: -10, transform: [{ rotate: '-12deg' }] }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <AppText type="title" style={[styles.headerTitle, { color: textColor }]}>Home</AppText>
          </View>

          {/* Wallet Status Card */}
          <View style={[styles.statusCard, { backgroundColor: '#2D2B55', borderColor }]}>
            <View style={styles.statusHeader}>
              <View style={{ flex: 1 }}>
                <AppText style={[styles.statusTitle, { color: textColor }]}>Wallet</AppText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: isAuthenticated ? '#10b98126' : '#ef444426' }]}>
                <View style={[styles.statusDot, { backgroundColor: isAuthenticated ? '#22c55e' : '#ef4444' }]} />
                <AppText style={[styles.statusBadgeText, { color: isAuthenticated ? '#22c55e' : '#ef4444' }]}>
                  {isAuthenticated ? 'Connected' : 'Disconnected'}
                </AppText>
              </View>
            </View>

            {selectedAccount && (
              <>
                <View style={[styles.walletInfo, { borderTopColor: borderColor }] }>
                  <AppText style={[styles.walletLabel, { color: mutedText }]}>Address</AppText>
                  <AppText style={[styles.walletAddress, { color: textColor }]}>
                    {ellipsify(selectedAccount.publicKey.toBase58(), 12)}
                  </AppText>
                </View>
                
                <View style={[styles.walletInfo, { marginTop: 12, borderTopColor: borderColor }] }>
                  <AppText style={[styles.walletLabel, { color: mutedText }]}>USDC Balance</AppText>
                  {loadingBalance ? (
                    <ActivityIndicator size="small" color={mutedText} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                  ) : (
                    <AppText style={[styles.balanceAmount, { color: textColor }]}>
                      {usdcBalance !== null ? `${usdcBalance.toFixed(2)} USDC` : '0.00 USDC'}
                    </AppText>
                  )}
                </View>
              </>
            )}
          </View>

          {/* Twitter Linking */}
          {isAuthenticated && (
            <View style={styles.twitterSection}>
              <AppText style={[styles.sectionTitle, { color: textColor }]}>Social</AppText>
              <TwitterLinkFeature />
            </View>
          )}

          {isAuthenticated ? null : (
            <View style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
              <View style={styles.emptyBadgeContainer}>
                <View style={styles.emptyBadgeGlow} />
                <View style={styles.emptyBadge} />
              </View>
              <AppText style={[styles.emptyStateTitle, { color: textColor }]}>Connect Your Wallet</AppText>
              <AppText style={[styles.emptyStateText, { color: mutedText }]}> 
                Link your Solana wallet to unlock payments, airdrops, and social features.
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
    paddingBottom: 28,
  },
  backdropContainer: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    height: 200,
  },
  backdropBlob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.16,
  },
  backdropBlobA: {
    backgroundColor: '#60a5fa',
    top: 140,
    left: -20,
    transform: [{ rotate: '18deg' }],
  },
  backdropBlobB: {
    backgroundColor: '#a78bfa',
    top: 180,
    right: -10,
    transform: [{ rotate: '-12deg' }],
  },
  header: {
    marginTop: 4,
    marginBottom: 20,
  },
  headerTitle: {
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  statusCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusEyebrow: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  walletInfo: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  walletLabel: {
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  walletAddress: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  twitterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyBadgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBadgeGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#60a5fa33',
  },
  emptyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#60a5fa',
  },
});