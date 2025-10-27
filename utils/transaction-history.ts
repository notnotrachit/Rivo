import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TransactionHistoryItem {
  id: string;
  recipient: string;
  amount: string;
  flow: 'linked' | 'unlinked';
  transactionSignature: string;
  timestamp: number;
}

const TRANSACTIONS_KEY = 'transactionHistory';

/**
 * Save a transaction to history
 */
export async function saveTransaction(transaction: Omit<TransactionHistoryItem, 'timestamp'>): Promise<void> {
  try {
    const history = await getTransactionHistory();
    const newTransaction: TransactionHistoryItem = {
      ...transaction,
      timestamp: Date.now(),
    };
    
    // Add to the beginning of the array (most recent first)
    history.unshift(newTransaction);
    
    // Keep only the last 100 transactions
    const limitedHistory = history.slice(0, 100);
    
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save transaction:', error);
  }
}

/**
 * Get all transaction history
 */
export async function getTransactionHistory(): Promise<TransactionHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get transaction history:', error);
    return [];
  }
}

/**
 * Clear all transaction history
 */
export async function clearTransactionHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
  } catch (error) {
    console.error('Failed to clear transaction history:', error);
  }
}

/**
 * Delete a specific transaction
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  try {
    const history = await getTransactionHistory();
    const filteredHistory = history.filter(tx => tx.id !== transactionId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to delete transaction:', error);
  }
}

/**
 * Generate a unique ID for a transaction
 */
export function generateTransactionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

