import {
    buildLinkedTransaction,
    buildUnlinkedTransaction,
    checkRecipient,
    SendFlow,
    usdcToLamports
} from '@/utils/send-money';
import { Transaction } from '@solana/web3.js';
import * as bs58 from 'bs58';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../app-text';
import { AppView } from '../app-view';
import { useAuthorization } from '../solana/use-authorization';
import { useMobileWallet } from '../solana/use-mobile-wallet';

export function SendUSDCFeature() {
  const { selectedAccount } = useAuthorization();
  const { signAndSendTransaction } = useMobileWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [flow, setFlow] = useState<SendFlow>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientWallet, setRecipientWallet] = useState<string | null>(null);

  const handleCheckRecipient = async () => {
    if (!recipient.trim()) {
      Alert.alert('Error', 'Please enter a recipient');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await checkRecipient(recipient);

      if (result.error) {
        setError(result.error);
        setFlow(null);
      } else {
        setFlow(result.flow);
        setRecipientWallet(result.recipientWallet || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check recipient');
      setFlow(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    if (!flow || !recipientWallet) {
      Alert.alert('Error', 'Please check recipient first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const senderWallet = selectedAccount.publicKey.toBase58();
      const amountInLamports = usdcToLamports(parseFloat(amount));

      // Build transaction based on flow
      let txBase58: string;

      if (flow === 'linked') {
        txBase58 = await buildLinkedTransaction(
          senderWallet,
          recipientWallet,
          amountInLamports
        );
      } else {
        txBase58 = await buildUnlinkedTransaction(
          senderWallet,
          recipientWallet,
          amountInLamports
        );
      }

      // Decode transaction
      const txBuffer = bs58.decode(txBase58);
      const tx = Transaction.from(txBuffer);

      // Sign and send transaction
      const signature = await signAndSendTransaction(tx, 0);

      Alert.alert(
        'Success',
        `Transaction sent! Signature: ${signature.substring(0, 20)}...`
      );

      // Reset form
      setRecipient('');
      setAmount('');
      setFlow(null);
      setRecipientWallet(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <AppText style={styles.title}>Send USDC</AppText>
          <AppText style={styles.subtitle}>
            Send USDC to linked wallets or unlinked social handles
          </AppText>

          {/* Recipient Input */}
          <View style={styles.section}>
            <AppText style={styles.label}>Recipient</AppText>
            <TextInput
              style={styles.input}
              placeholder="Wallet address or @handle"
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCheckRecipient}
              disabled={loading || !recipient.trim()}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Check Recipient</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Flow Status */}
          {flow && (
            <View
              style={[
                styles.statusCard,
                flow === 'linked' ? styles.statusLinked : styles.statusUnlinked,
              ]}
            >
              <AppText style={styles.statusText}>
                {flow === 'linked'
                  ? '✓ Recipient has linked account - direct transfer'
                  : '⏳ Recipient not linked - tokens will be held in escrow'}
              </AppText>
            </View>
          )}

          {/* Amount Input */}
          {flow && (
            <View style={styles.section}>
              <AppText style={styles.label}>Amount (USDC)</AppText>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, styles.sendButton, loading && styles.buttonDisabled]}
                onPress={handleSendMoney}
                disabled={loading || !amount.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Send Money</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorCard}>
              <AppText style={styles.errorText}>{error}</AppText>
            </View>
          )}

          {/* Info Message */}
          {!selectedAccount && (
            <View style={styles.infoCard}>
              <AppText style={styles.infoText}>
                Please connect your wallet to send USDC
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#5865F2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#10b981',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  statusLinked: {
    backgroundColor: '#1e4620',
    borderLeftColor: '#10b981',
  },
  statusUnlinked: {
    backgroundColor: '#1e3a5f',
    borderLeftColor: '#3b82f6',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#1e3a5f',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    color: '#93c5fd',
    fontSize: 14,
  },
});
