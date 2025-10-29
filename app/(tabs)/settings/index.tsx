import { AppPage } from '@/components/app-page';
import { AppText } from '@/components/app-text';
import { WalletUiDropdown } from '@/components/solana/wallet-ui-dropdown';
import { TwitterLinkButton } from '@/components/social/twitter-link-button';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');

  return (
    <AppPage>
      <View style={styles.headerContainer}>
        <AppText type="title" style={[styles.title, { color: textColor }]}>
          Settings
        </AppText>
        <WalletUiDropdown />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { color: textColor }]}>Social Accounts</AppText>
          <TwitterLinkButton />
        </View>
      </ScrollView>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});
