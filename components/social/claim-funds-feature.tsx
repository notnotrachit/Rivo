import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { AppView } from '../app-view';
import { Button } from '@react-navigation/elements';
import { useAuthorization } from '../solana/use-authorization';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Transaction } from '@solana/web3.js';
import { API_CONFIG } from '@/constants/api-config';
import { Base64 } from 'js-base64';

interface PendingClaim {
  handle: string;
  amount: number;
  sender: string;
  paymentCount: number;
  pda: string;
}

interface PaymentHistory {
  payments: Array<{
    sender: string;
    amount: number;
    timestamp: number;
    pda: string;
  }>;
}

export function ClaimFundsFeature() {
  const { selectedAccount, authorizeSession } = useAuthorization();
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const checkPendingClaims = async () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pendingClaims}`, {
        headers: {
          'x-wallet-address': selectedAccount.publicKey.toBase58(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check pending claims');
      }

      setPendingClaims(data.claims || []);

      if (data.claims.length === 0) {
        Alert.alert('No Claims', 'No pending claims found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check pending claims');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async (handle: string) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.paymentHistory}?handle=${encodeURIComponent(handle)}`,
        {
          headers: {
            'x-wallet-address': selectedAccount!.publicKey.toBase58(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to load payment history');
      }

      setPaymentHistory(data);
      setExpandedClaim(handle);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load payment history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const claimFunds = async (handle: string) => {
    if (!selectedAccount) return;

    setClaiming(true);
    try {
      // Build claim transaction
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.buildClaimTransaction}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': selectedAccount.publicKey.toBase58(),
        },
        body: JSON.stringify({ socialHandle: handle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to build claim transaction');
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
          `Successfully claimed ${data.amount / 1_000_000} USDC!`
        );

        // Refresh claims
        setTimeout(() => checkPendingClaims(), 2000);
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to claim funds');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AppView>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <AppText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Claim Pending Funds
        </AppText>
        <AppText style={{ marginBottom: 20, opacity: 0.7 }}>
          Check if anyone has sent you USDC before you linked your wallet
        </AppText>

        <Button onPress={checkPendingClaims} disabled={!selectedAccount || loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <AppText>Check for Pending Claims</AppText>}
        </Button>

        {pendingClaims.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <AppText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Pending Claims:
            </AppText>
            {pendingClaims.map((claim, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 15,
                  marginBottom: 10,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <AppText style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {(claim.amount / 1_000_000).toFixed(2)} USDC
                </AppText>
                <AppText style={{ marginTop: 5 }}>For: {claim.handle}</AppText>
                {claim.paymentCount > 1 ? (
                  <AppText style={{ marginTop: 2, fontSize: 12, opacity: 0.7 }}>
                    From: {claim.paymentCount} payments (most recent: {claim.sender.slice(0, 8)}...
                    {claim.sender.slice(-8)})
                  </AppText>
                ) : (
                  <AppText style={{ marginTop: 2, fontSize: 12, opacity: 0.7 }}>
                    From: {claim.sender.slice(0, 8)}...{claim.sender.slice(-8)}
                  </AppText>
                )}

                <TouchableOpacity
                  onPress={() => {
                    if (expandedClaim === claim.handle) {
                      setExpandedClaim(null);
                      setPaymentHistory(null);
                    } else {
                      loadPaymentHistory(claim.handle);
                    }
                  }}
                  disabled={loadingHistory}
                  style={{ marginTop: 10 }}
                >
                  <AppText style={{ color: '#007AFF', fontSize: 12 }}>
                    {loadingHistory && expandedClaim === claim.handle
                      ? 'Loading...'
                      : expandedClaim === claim.handle
                      ? 'Hide payment history'
                      : 'View payment history'}
                  </AppText>
                </TouchableOpacity>

                {expandedClaim === claim.handle && paymentHistory && (
                  <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ddd' }}>
                    <AppText style={{ fontWeight: 'bold', marginBottom: 5 }}>
                      Payment History ({paymentHistory.payments.length})
                    </AppText>
                    {paymentHistory.payments.map((payment, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          borderRadius: 5,
                          marginBottom: 5,
                        }}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <AppText style={{ fontSize: 12 }}>
                            {payment.sender.slice(0, 8)}...{payment.sender.slice(-8)}
                          </AppText>
                          <AppText style={{ fontSize: 12, fontWeight: 'bold' }}>
                            {payment.amount.toFixed(2)} USDC
                          </AppText>
                        </View>
                        <AppText style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                          {new Date(payment.timestamp * 1000).toLocaleString()}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}

                <View style={{ marginTop: 10 }}>
                  <Button
                    onPress={() => claimFunds(claim.handle)}
                    disabled={claiming}
                  >
                    {claiming ? <ActivityIndicator color="#fff" /> : <AppText>Claim</AppText>}
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}

        {!selectedAccount && (
          <AppText style={{ marginTop: 10, textAlign: 'center', opacity: 0.6 }}>
            Please connect your wallet to check for pending claims
          </AppText>
        )}
      </ScrollView>
    </AppView>
  );
}
