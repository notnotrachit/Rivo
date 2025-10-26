import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("BCD29c55GrdmwUefJ8ndbp49TuH4h3khj62CrRaD1tx9");

// Helper to get PDA for social links
export function getSocialLinkPDA(userWallet: PublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("social_link"), userWallet.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

// Helper to get Config PDA
export function getConfigPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );
  return pda;
}

// Setup program connection
export function getProgram(wallet: any, rpcUrl: string = "https://api.devnet.solana.com") {
  const connection = new Connection(rpcUrl, "confirmed");
  
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: "confirmed" }
  );
  
  // Note: Replace YOUR_IDL with actual IDL import
  return new Program(YOUR_IDL, PROGRAM_ID, provider);
}

// Validate handle format
export function validateHandle(handle: string): boolean {
  return handle.length <= 30 && /^[a-zA-Z0-9_]+$/.test(handle);
}

// Get existing social links
export async function getSocialLinks(wallet: PublicKey) {
  const program = getProgram(wallet);
  const socialLinkPDA = getSocialLinkPDA(wallet);
  
  try {
    return await program.account.socialLink.fetch(socialLinkPDA);
  } catch (e) {
    return null;
  }
}

// Link social account
export async function linkSocialAccount(
  wallet: any,
  platform: 'twitter' | 'instagram' | 'linkedin',
  handle: string
) {
  if (!validateHandle(handle)) {
    throw new Error('Invalid handle format');
  }

  const program = getProgram(wallet);
  const socialLinkPDA = getSocialLinkPDA(wallet.publicKey);
  const configPDA = getConfigPDA();

  const baseAccounts = {
    socialLink: socialLinkPDA,
    user: wallet.publicKey,
    admin: wallet.publicKey, // TODO: Replace with actual admin wallet in production
    config: configPDA,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  const method = platform === 'twitter' 
    ? 'linkTwitter' 
    : platform === 'instagram' 
      ? 'linkInstagram' 
      : 'linkLinkedin';

  return program.methods[method](handle)
    .accounts(baseAccounts)
    .rpc();
}

// Error handling helper
export function handleError(error: any): string {
  if (error.message.includes('0x1')) {
    return 'Handle is too long (max 30 characters)';
  }
  if (error.message.includes('unauthorized')) {
    return 'Unauthorized: Only admin can perform this action';
  }
  return 'An error occurred while linking account';
}