import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
  type PublicClient,
  type WalletClient,
  type Transport,
  type Account,
} from 'viem';
import {
  privateKeyToAccount,
  mnemonicToAccount,
  type HDAccount,
  generateMnemonic as genMnemonic,
  english,
} from 'viem/accounts';
import { defaultChain } from './chains';

function getRpcUrl(chain: Chain): string | undefined {
  if (chain.id === 11155111) {
    return import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
  }
  return undefined;
}

export function createViemPublicClient(chain: Chain = defaultChain): PublicClient {
  const rpcUrl = getRpcUrl(chain);
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

export function createViemWalletClient(
  privateKey?: string,
  chain: Chain = defaultChain,
): WalletClient<Transport, Chain, Account | undefined> {
  const account = privateKey
    ? privateKeyToAccount(privateKey as `0x${string}`)
    : undefined;

  const rpcUrl = getRpcUrl(chain);
  return createWalletClient({
    chain,
    transport: http(rpcUrl),
    account,
  });
}

export function accountFromMnemonic(
  mnemonic: string,
  path: `m/44'/60'/${string}` = "m/44'/60'/0'/0/0",
): HDAccount {
  return mnemonicToAccount(mnemonic, { path });
}

export function generateMnemonic(): { mnemonic: string; account: HDAccount } {
  const mnemonic = genMnemonic(english);
  const account = accountFromMnemonic(mnemonic);
  return { mnemonic, account };
}