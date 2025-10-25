import React, { useState } from 'react';
import { View, TextInput, Alert, ActivityIndicator } from 'react-native';
import { AppText } from '../app-text';
import { AppView } from '../app-view';
import { Button } from '@react-navigation/elements';
import { useAuthorization } from '../solana/use-authorization';
import { API_CONFIG } from '@/constants/api-config';

export function SocialLinkFeature() {
  const { selectedAccount } = useAuthorization();
  const [twitterHandle, setTwitterHandle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkTwitter = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!twitterHandle.trim()) {
      Alert.alert('Error', 'Please enter your Twitter handle');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.linkTwitter}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: selectedAccount.publicKey.toBase58(),
          twitter: twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link Twitter account');
      }

      Alert.alert('Success', `Successfully linked Twitter account ${twitterHandle}!`);
      setTwitterHandle('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to link Twitter account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView>
      <View style={{ padding: 20 }}>
        <AppText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Link Social Account
        </AppText>
        <AppText style={{ marginBottom: 20, opacity: 0.7 }}>
          Link your Twitter account to receive payments from anyone
        </AppText>

        <View style={{ marginBottom: 20 }}>
          <AppText style={{ marginBottom: 8, fontWeight: '600' }}>Twitter Handle</AppText>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="@username"
            value={twitterHandle}
            onChangeText={setTwitterHandle}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <Button onPress={handleLinkTwitter} disabled={loading || !selectedAccount}>
          {loading ? <ActivityIndicator color="#fff" /> : <AppText>Link Twitter Account</AppText>}
        </Button>

        {!selectedAccount && (
          <AppText style={{ marginTop: 10, textAlign: 'center', opacity: 0.6 }}>
            Please connect your wallet to link social accounts
          </AppText>
        )}
      </View>
    </AppView>
  );
}
