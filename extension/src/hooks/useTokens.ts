import { useState, useEffect, useCallback } from 'react';

export interface Token {
  symbol: string;
  name: string;
  contractAddress: string;
  decimals: number;
  balance?: string;
  usdValue?: string;
  iconUrl?: string;
}

declare const chrome: any;
const STORAGE_KEY = 'tokens';

function getStorage() {
  return chrome.storage.local;
}

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await new Promise<{ [STORAGE_KEY]?: Token[] }>((resolve) => {
        getStorage().get(STORAGE_KEY, (data: { [STORAGE_KEY]?: Token[] }) => {
          resolve(data);
        });
      });
      if (result[STORAGE_KEY]) {
        setTokens(result[STORAGE_KEY]);
      }
    } catch (e: any) {
      setError('Failed to load tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTokens = useCallback(async (newTokens: Token[]) => {
    try {
      await getStorage().set({ [STORAGE_KEY]: newTokens });
      setTokens(newTokens);
    } catch (e: any) {
      setError('Failed to save tokens');
    }
  }, []);

  const addToken = useCallback(async (token: Token) => {
    setError(null);
    try {
      const currentTokens = await new Promise<Token[]>((resolve) => {
        getStorage().get(STORAGE_KEY, (data: { [STORAGE_KEY]?: Token[] }) => {
          resolve(data[STORAGE_KEY] || []);
        });
      });

      const exists = currentTokens.some(
        (t) => t.contractAddress.toLowerCase() === token.contractAddress.toLowerCase()
      );
      if (exists) {
        setError('Token already added');
        return;
      }

      const updatedTokens = [...currentTokens, token];
      await saveTokens(updatedTokens);
    } catch (e: any) {
      setError('Failed to add token');
    }
  }, [saveTokens]);

  const removeToken = useCallback(async (contractAddress: string) => {
    setError(null);
    try {
      const currentTokens = await new Promise<Token[]>((resolve) => {
        getStorage().get(STORAGE_KEY, (data: { [STORAGE_KEY]?: Token[] }) => {
          resolve(data[STORAGE_KEY] || []);
        });
      });
      const updatedTokens = currentTokens.filter(
        (t) => t.contractAddress.toLowerCase() !== contractAddress.toLowerCase()
      );
      await saveTokens(updatedTokens);
    } catch (e: any) {
      setError('Failed to remove token');
    }
  }, [saveTokens]);

  const updateTokenValues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentTokens = await new Promise<Token[]>((resolve) => {
        getStorage().get(STORAGE_KEY, (data: { [STORAGE_KEY]?: Token[] }) => {
          resolve(data[STORAGE_KEY] || []);
        });
      });
      setTokens(currentTokens);
    } catch (e: any) {
      setError('Failed to update token data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tokens,
    isLoading,
    error,
    addToken,
    removeToken,
    updateTokenValues,
    loadTokens,
  };
}