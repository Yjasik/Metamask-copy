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
import { privateKeyToAccount, mnemonicToAccount, type HDAccount, generateMnemonic as genMnemonic, english } from 'viem/accounts';
import { defaultChain } from './chains'; // getChainById не используется, убран

/**
 * Создаёт публичного клиента для чтения данных из блокчейна.
 * @param chain - сеть (по умолчанию Sepolia)
 * @returns PublicClient
 */
export function createViemPublicClient(chain: Chain = defaultChain): PublicClient {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

/**
 * Создаёт кошелькового клиента для подписи транзакций.
 * @param privateKey - приватный ключ (0x...). Если не передан, клиент будет без аккаунта.
 * @param chain - сеть (по умолчанию Sepolia)
 * @returns WalletClient
 */
export function createViemWalletClient(
  privateKey?: string,
  chain: Chain = defaultChain,
): WalletClient<Transport, Chain, Account | undefined> {
  const account = privateKey
    ? privateKeyToAccount(privateKey as `0x${string}`)
    : undefined;

  return createWalletClient({
    chain,
    transport: http(),
    account,
  });
}

/**
 * Восстанавливает аккаунт из мнемонической фразы (BIP-39).
 * @param mnemonic - мнемоника (12/24 слова)
 * @param path - путь деривации (по умолчанию Ethereum: "m/44'/60'/0'/0/0")
 * @returns HDAccount
 */
export function accountFromMnemonic(
  mnemonic: string,
  path: `m/44'/60'/${string}` = "m/44'/60'/0'/0/0",
): HDAccount {
  return mnemonicToAccount(mnemonic, { path });
}

/**
 * Генерирует случайную мнемонику и возвращает аккаунт.
 * @returns { mnemonic: string; account: HDAccount }
 */
export function generateMnemonic(): { mnemonic: string; account: HDAccount } {
  const mnemonic = genMnemonic(english);
  const account = accountFromMnemonic(mnemonic);
  return { mnemonic, account };
}