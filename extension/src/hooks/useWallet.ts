import { useState, useCallback, useEffect } from 'react';
import { type Chain, type PrivateKeyAccount, formatEther, parseEther } from 'viem';
import {
  createViemPublicClient,
  createViemWalletClient,
  generateMnemonic,
  accountFromMnemonic,
} from '../lib/viemClient';
import { defaultChain, getChainById } from '../lib/chains';

declare const chrome: any;

const STORAGE_KEY = 'encryptedWallet';

interface StoredData {
  encryptedKey: string;
  iv: string;
  salt: string;
}

function getStorage() {
  return chrome.storage.local;
}

function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptPrivateKey(
  privateKey: string,
  password: string
): Promise<StoredData> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);

  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    enc.encode(privateKey)
  );

  return {
    encryptedKey: uint8ArrayToHex(new Uint8Array(encrypted)),
    iv: uint8ArrayToHex(iv),
    salt: uint8ArrayToHex(salt),
  };
}

async function decryptPrivateKey(
  encryptedKey: string,
  iv: string,
  salt: string,
  password: string
): Promise<string> {
  const key = await deriveKey(password, hexToBuffer(salt) as Uint8Array);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: hexToBuffer(iv) as BufferSource },
    key,
    hexToBuffer(encryptedKey) as BufferSource
  );
  return new TextDecoder().decode(decrypted);
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function useWallet() {
  const [account, setAccount] = useState<any>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chain, setChain] = useState<Chain>(defaultChain);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAddress(account ? account.address : null);
  }, [account]);

  useEffect(() => {
    getStorage().get(STORAGE_KEY, (result: { [STORAGE_KEY]?: StoredData }) => {
      if (result[STORAGE_KEY]) {
      }
    });
  }, []);

  const createWallet = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { mnemonic: newMnemonic, account: newAccount } = generateMnemonic();
      let privateKey: string;
      
      if ('privateKey' in newAccount && typeof newAccount.privateKey === 'string') {
        privateKey = newAccount.privateKey;
      } else {
        const { mnemonicToAccount } = await import('viem/accounts');
        const fullAccount = mnemonicToAccount(newMnemonic);
        const hdKey = fullAccount.getHdKey();
        if (!hdKey.privateKey) throw new Error('Failed to get private key');
        privateKey = `0x${uint8ArrayToHex(hdKey.privateKey)}`;
      }

      const encryptedData = await encryptPrivateKey(privateKey, password);
      await getStorage().set({ [STORAGE_KEY]: encryptedData });

      setMnemonic(newMnemonic);
      setAccount(newAccount);
    } catch (e: any) {
      setError(e.message || 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importFromMnemonic = useCallback(
    async (mnemonic: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const acc = accountFromMnemonic(mnemonic);
        let privateKey: string;
        
        if ('privateKey' in acc && typeof acc.privateKey === 'string') {
          privateKey = acc.privateKey;
        } else {
          const { mnemonicToAccount } = await import('viem/accounts');
          const fullAccount = mnemonicToAccount(mnemonic);
          const hdKey = fullAccount.getHdKey();
          if (!hdKey.privateKey) throw new Error('No private key');
          privateKey = `0x${uint8ArrayToHex(hdKey.privateKey)}`;
        }

        const encryptedData = await encryptPrivateKey(privateKey, password);
        await getStorage().set({ [STORAGE_KEY]: encryptedData });

        setMnemonic(mnemonic);
        setAccount(acc);
      } catch (e: any) {
        setError(e.message || 'Failed to import mnemonic');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const importFromPrivateKey = useCallback(
    async (privateKey: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const { privateKeyToAccount } = await import('viem/accounts');
        const acc = privateKeyToAccount(privateKey as `0x${string}`);
        const encryptedData = await encryptPrivateKey(privateKey, password);
        await getStorage().set({ [STORAGE_KEY]: encryptedData });

        setAccount(acc);
        setMnemonic(null);
      } catch (e: any) {
        setError(e.message || 'Failed to import private key');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const unlockWallet = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getStorage().get(STORAGE_KEY);
      const data = result[STORAGE_KEY] as StoredData | undefined;
      if (!data) throw new Error('No saved wallet');

      const privateKey = await decryptPrivateKey(
        data.encryptedKey,
        data.iv,
        data.salt,
        password
      );

      const { privateKeyToAccount } = await import('viem/accounts');
      const acc = privateKeyToAccount(privateKey as `0x${string}`);
      setAccount(acc);
    } catch (e: any) {
      setError('Incorrect password or corrupted data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    setError(null);
    try {
      const client = createViemPublicClient(chain);
      const bal = await client.getBalance({ address: account.address });
      setBalance(formatEther(bal));
    } catch (e: any) {
      setError('Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [account, chain]);

  const switchChain = useCallback((chainId: number) => {
    const newChain = getChainById(chainId);
    if (newChain) {
      setChain(newChain);
      setError(null);
    } else {
      setError('Network not found');
    }
  }, []);

  const sendTransaction = useCallback(async (to: string, amountEth: string) => {
    if (!account) throw new Error('Wallet is locked');
    setIsLoading(true);
    setError(null);
    try {
      const walletClient = createViemWalletClient(account.privateKey, chain);
      const txHash = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        value: parseEther(amountEth),
        account,
      });
      return txHash;
    } catch (e: any) {
      setError(e.message || 'Send failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [account, chain]);

  const lockWallet = useCallback(() => {
    setAccount(null);
    setMnemonic(null);
    setAddress(null);
    setBalance('0');
  }, []);

  return {
    account,
    mnemonic,
    address,
    balance,
    chain,
    isLoading,
    error,
    sendTransaction,
    createWallet,
    importFromMnemonic,
    importFromPrivateKey,
    unlockWallet,
    fetchBalance,
    switchChain,
    lockWallet,
    setError,
  };
}