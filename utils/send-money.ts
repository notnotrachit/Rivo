import { API_CONFIG } from '@/constants/api-config';

export type SendFlow = 'linked' | 'unlinked' | null;

export interface CheckRecipientResult {
  flow: SendFlow;
  recipientWallet?: string;
  error?: string;
}

export interface PendingClaim {
  handle: string;
  amount: number;
  paymentCount: number;
  claimed: boolean;
}

/**
 * Check if recipient is a linked wallet or unlinked social handle
 */
export async function checkRecipient(recipient: string): Promise<CheckRecipientResult> {
  try {
    // Try to parse as wallet address first
    if (recipient.length === 44 || recipient.length === 43) {
      // Likely a base58 wallet address
      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/social/get?wallet=${recipient}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.linked) {
        return {
          flow: 'linked',
          recipientWallet: recipient,
        };
      } else {
        return {
          flow: null,
          error: 'Wallet has no linked social accounts',
        };
      }
    } else {
      // Treat as social handle
      const platform = recipient.startsWith('@') ? 'twitter' : 'twitter';
      const handle = recipient.startsWith('@') ? recipient : `@${recipient}`;

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/social/find-wallet?handle=${encodeURIComponent(handle)}&platform=${platform}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.found) {
        return {
          flow: 'linked',
          recipientWallet: data.wallet,
        };
      } else {
        return {
          flow: 'unlinked',
          recipientWallet: handle,
        };
      }
    }
  } catch (error: any) {
    return {
      flow: null,
      error: error.message || 'Failed to check recipient',
    };
  }
}

/**
 * Build transaction for sending to linked account
 */
export async function buildLinkedTransaction(
  senderWallet: string,
  recipientWallet: string,
  amount: number
): Promise<string> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/tokens/build-transaction`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderWallet,
        recipientWallet,
        mint: API_CONFIG.usdcMint,
        amount,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to build transaction');
  }

  const { transaction } = await response.json();
  return transaction;
}

/**
 * Build transaction for sending to unlinked account
 */
export async function buildUnlinkedTransaction(
  senderWallet: string,
  socialHandle: string,
  amount: number
): Promise<string> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/tokens/build-unlinked-transaction`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderWallet,
        socialHandle,
        mint: API_CONFIG.usdcMint,
        amount,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to build transaction');
  }

  const { transaction } = await response.json();
  return transaction;
}

/**
 * Get pending claims for a social handle
 */
export async function getPendingClaims(handle: string): Promise<PendingClaim | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/api/tokens/pending-claims?handle=${encodeURIComponent(handle)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      handle: data.handle,
      amount: data.amount,
      paymentCount: data.paymentCount,
      claimed: data.claimed,
    };
  } catch (error) {
    console.error('Failed to fetch pending claims:', error);
    return null;
  }
}

/**
 * Build claim transaction
 */
export async function buildClaimTransaction(socialHandle: string): Promise<string> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/tokens/build-claim-transaction`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        socialHandle,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to build claim transaction');
  }

  const { transaction } = await response.json();
  return transaction;
}

/**
 * Convert lamports to USDC (6 decimals)
 */
export function lamportsToUsdc(lamports: number): number {
  return lamports / 1_000_000;
}

/**
 * Convert USDC to lamports (6 decimals)
 */
export function usdcToLamports(usdc: number): number {
  return Math.floor(usdc * 1_000_000);
}
