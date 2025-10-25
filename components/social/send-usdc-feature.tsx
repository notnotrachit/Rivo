import React, { useState } from 'react';
import { View, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { AppText } from '../app-text';
import { AppView } from '../app-view';
import { Button } from '@react-navigation/elements';
import { useAuthorization } from '../solana/use-authorization';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Transaction } from '@solana/web3.js';
import { API_CONFIG } from '@/constants/api-config';
import { Base64 } from 'js-base64';

export function SendUSDCFeature() {
  const { selectedAccount, authorizeSession } = useAuthorization();
  const [handle, setHandle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<{ found: boolean; wallet?: string } | null>(null);

  const checkWallet = async () => {
    if (!handle.trim()) {
      Alert.alert('Error', 'Please enter a Twitter handle');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.findWallet}?handle=${encodeURIComponent(
          handle.startsWith('@') ? handle : `@${handle}`
        )}&platform=twitter`
      );

      const data = await response.json();
      setWalletInfo(data);

      if (data.found) {
        Alert.alert('Wallet Found', `This user has linked their wallet: ${data.wallet.slice(0, 8)}...${data.wallet.slice(-8)}`);
      } else {
        Alert.alert(
          'Wallet Not Linked',
          'This user hasn\'t linked their wallet yet. Your USDC will be held in escrow and they can claim it when they link their wallet.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check wallet');
    } finally {
      setLoading(false);
    }
  };

  const sendUSDC = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!handle.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please enter both handle and amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const handleWithAt = handle.startsWith('@') ? handle : `@${handle}`;
      const amountInSmallestUnit = Math.floor(amountNum * 1_000_000);

      // Build transaction
      const endpoint = walletInfo?.found
        ? API_CONFIG.endpoints.buildTransaction
        : API_CONFIG.endpoints.buildUnlinkedTransaction;

      const body = walletInfo?.found
        ? {
          senderWallet: selectedAccount.publicKey.toBase58(),
          recipientWallet: walletInfo.wallet,
          mint: API_CONFIG.usdcMint,
          amount: amountInSmallestUnit,
        }
        : {
          senderWallet: selectedAccount.publicKey.toBase58(),
          socialHandle: handleWithAt,
          mint: API_CONFIG.usdcMint,
          amount: amountInSmallestUnit,
        };

      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to build transaction');
      }

      // Decode transaction
      const transactionBuffer = Base64.toUint8Array(data.transaction);
      const transaction = Transaction.from(transactionBuffer);

      // Sign and send with Mobile Wallet Adapter
      await transact(async (wallet) => {
        const authResult = await authorizeSession(wallet);

        const signedTransactions = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        Alert.alert(
          'Success',
          `Successfully sent ${amountNum} USDC to ${handleWithAt}!`
        );

        // Reset form
        setHandle('');
        setAmount('');
        setWalletInfo(null);
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send USDC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <AppText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Send USDC
        </AppText>
        <AppText style={{ marginBottom: 20, opacity: 0.7 }}>
          Send USDC to anyone using their Twitter handle
        </AppText>

        <View style={{ marginBottom: 15 }}>
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
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={{ marginBottom: 15 }}>
          <Button onPress={checkWallet} disabled={loading || !handle.trim()}>
            {loading ? <ActivityIndicator color="#fff" /> : <AppText>Check Wallet</AppText>}
          </Button>
        </View>

        {walletInfo && (
          <View
            style={{
              backgroundColor: walletInfo.found ? '#d4edda' : '#fff3cd',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <AppText style={{ fontWeight: 'bold', marginBottom: 5 }}>
              {walletInfo.found ? '✅ Wallet Linked' : '⚠️ Wallet Not Linked'}
            </AppText>
            <AppText style={{ fontSize: 12 }}>
              {walletInfo.found
                ? `Wallet: ${walletInfo.wallet!.slice(0, 8)}...${walletInfo.wallet!.slice(-8)}`
                : 'USDC will be held in escrow until they link their wallet'}
            </AppText>
          </View>
        )}

        <View style={{ marginBottom: 15 }}>
          <AppText style={{ marginBottom: 8, fontWeight: '600' }}>Amount (USDC)</AppText>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <Button onPress={sendUSDC} disabled={loading || !selectedAccount || !walletInfo}>
          {loading ? <ActivityIndicator color="#fff" /> : <AppText>Send USDC</AppText>}
        </Button>

        {!selectedAccount && (
          <AppText style={{ marginTop: 10, textAlign: 'center', opacity: 0.6 }}>
            Please connect your wallet to send USDC
          </AppText>
        )}
      </ScrollView>
    </AppView>
  );
}
