import { encode as bs58Encode } from 'bs58';
import { randomBytes } from 'crypto';

export function createNonce(): string {
  return bs58Encode(randomBytes(32));
}

interface SignInMessageParams {
  domain: string;
  address: string;
  statement?: string;
  chainId?: string;
  uri?: string;
  nonce: string;
}

export function buildSignInMessage({
  domain,
  address,
  statement = 'Sign in with your Solana wallet',
  chainId = 'solana:mainnet',
  uri,
  nonce,
}: SignInMessageParams): string {
  const header = `${domain} wants you to sign in with your Solana account:`;
  const addressHeader = `${address}`;
  
  let message = [
    header,
    addressHeader,
    '',
    statement,
    '',
    `URI: ${uri || domain}`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`,
  ].join('\n');

  return message;
}