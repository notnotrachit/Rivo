import { AppText } from '@/components/app-text';
import { AppView } from '@/components/app-view';
import { useAuthorization } from '@/components/solana/use-authorization';
import { useMobileWallet } from '@/components/solana/use-mobile-wallet';
import {
  buildLinkedTransaction,
  buildUnlinkedTransaction,
  checkRecipient,
  SendFlow,
  usdcToLamports,
} from '@/utils/send-money';
import { extractHandleFromShareIntent } from '@/utils/twitter-handle-extractor';
import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { useShareIntentContext } from 'expo-share-intent';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';

export default function ShareHandlerScreen() {
  const router = useRouter();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const { selectedAccount } = useAuthorization();
  const { signAndSendTransaction } = useMobileWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [flow, setFlow] = useState<SendFlow>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientWallet, setRecipientWallet] = useState<string | null>(null);
  const [isProcessingShare, setIsProcessingShare] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [hasProcessedIntent, setHasProcessedIntent] = useState(false);

  // Process share intent on mount
  useEffect(() => {
    console.log('ShareHandlerScreen mounted');
    console.log('hasShareIntent:', hasShareIntent);
    console.log('shareIntent:', shareIntent);
    
    if (hasShareIntent && shareIntent && !hasProcessedIntent) {
      const handle = extractHandleFromShareIntent(shareIntent);
      console.log('Extracted handle:', handle);
      
      if (handle) {
        setRecipient(handle);
        setHasProcessedIntent(true); // Mark as processed
        // Auto-check recipient
        checkRecipientAuto(handle);
      } else {
        setError('Could not extract Twitter handle from shared content');
        setIsProcessingShare(false);
      }
    } else if (!hasShareIntent && !hasProcessedIntent) {
      // Only redirect if we never processed a share intent
      console.log('No share intent, redirecting to home');
      setIsProcessingShare(false);
      router.replace('/(tabs)');
    } else {
      // Share intent was processed, just stop loading
      setIsProcessingShare(false);
    }
  }, [hasShareIntent, shareIntent, hasProcessedIntent]);

  const checkRecipientAuto = async (handle: string) => {
    console.log('checkRecipientAuto called with handle:', handle);
    try {
      setLoading(true);
      setError(null);

      console.log('Calling checkRecipient API...');
      const result = await checkRecipient(handle);
      console.log('checkRecipient result:', result);

      if (result.error) {
        console.log('Error from checkRecipient:', result.error);
        setError(result.error);
        setFlow(null);
      } else {
        console.log('Setting flow:', result.flow);
        setFlow(result.flow);
        setRecipientWallet(result.recipientWallet || null);
      }
    } catch (err: any) {
      console.error('Exception in checkRecipientAuto:', err);
      setError(err.message || 'Failed to check recipient');
      setFlow(null);
    } finally {
      console.log('checkRecipientAuto finished, setting loading to false');
      setLoading(false);
      setIsProcessingShare(false);
    }
  };

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

      // Show success screen
      setTransactionSignature(signature);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetShareIntent();
    router.replace('/(tabs)');
  };

  if (isProcessingShare) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5865F2" />
          <AppText style={styles.loadingText}>Processing shared content...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  // Success Screen
  if (showSuccess && transactionSignature) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          
          <AppText style={styles.successTitle}>Transaction Sent!</AppText>
          <AppText style={styles.successSubtitle}>
            Your USDC has been sent successfully
          </AppText>

          <View style={styles.successDetailsCard}>
            <View style={styles.successDetailRow}>
              <AppText style={styles.successDetailLabel}>Recipient</AppText>
              <AppText style={styles.successDetailValue}>{recipient}</AppText>
            </View>
            
            <View style={styles.successDetailRow}>
              <AppText style={styles.successDetailLabel}>Amount</AppText>
              <AppText style={styles.successDetailValue}>{amount} USDC</AppText>
            </View>
            
            <View style={styles.successDetailRow}>
              <AppText style={styles.successDetailLabel}>Status</AppText>
              <AppText style={styles.successDetailValue}>
                {flow === 'linked' ? 'Direct Transfer' : 'Held in Escrow'}
              </AppText>
            </View>

            <View style={[styles.successDetailRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#333' }]}>
              <AppText style={styles.successDetailLabel}>Transaction</AppText>
              <AppText style={styles.successDetailValueSmall} numberOfLines={1}>
                {transactionSignature.substring(0, 8)}...{transactionSignature.substring(transactionSignature.length - 8)}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={() => {
              resetShareIntent();
              router.replace('/(tabs)');
            }}
          >
            <Text style={styles.successButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText style={styles.title}>Send USDC via Twitter</AppText>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <AppText style={styles.subtitle}>
            Send USDC to this Twitter account
          </AppText>

          {/* Recipient Display */}
          <View style={styles.section}>
            <AppText style={styles.label}>Recipient</AppText>
            <View style={styles.recipientDisplay}>
              <AppText style={styles.recipientText}>{recipient}</AppText>
            </View>
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
                style={[
                  styles.button,
                  styles.sendButton,
                  loading && styles.buttonDisabled,
                ]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
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
  recipientDisplay: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  recipientText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
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
  // Success screen styles
  successContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
    textAlign: 'center',
  },
  successDetailsCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 32,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  successDetailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  successDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  successDetailValueSmall: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    maxWidth: 150,
  },
  successButton: {
    backgroundColor: '#5865F2',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
