import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';
import { registerUser, loginUser } from '../lib/apiClient';

declare const chrome: any;

const SESSION_KEY = 'session';
const AUTH_TOKEN_KEY = 'authToken';
const USER_ID_KEY = 'userId';

function getStorage() {
  return chrome.storage.local;
}

export function useAuth() {
  const wallet = useWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getStorage().get([SESSION_KEY, USER_ID_KEY], (result: any) => {
      if (result[SESSION_KEY]) {
        setIsLoggedIn(true);
      }
      if (result[USER_ID_KEY]) {
        setUserId(result[USER_ID_KEY]);
      }
    });
  }, []);

  const login = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await wallet.unlockWallet(password);
      await getStorage().set({ [SESSION_KEY]: true });
      setIsLoggedIn(true);
    } catch (e: any) {
      setError(e.message || 'Incorrect password');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken } = await registerUser(email, password);
      await getStorage().set({
        [AUTH_TOKEN_KEY]: accessToken,
        [USER_ID_KEY]: email,
      });
      setUserId(email);
      setIsLoggedIn(true);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithBackend = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken } = await loginUser(email, password);
      await getStorage().set({
        [AUTH_TOKEN_KEY]: accessToken,
        [USER_ID_KEY]: email,
      });
      setUserId(email);
      setIsLoggedIn(true);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    wallet.lockWallet();
    await getStorage().remove([SESSION_KEY, AUTH_TOKEN_KEY, USER_ID_KEY]);
    setIsLoggedIn(false);
    setUserId(null);
  }, [wallet]);

  return {
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    error,
    login,
    register,
    loginWithBackend,
    logout,
    wallet,
    userId,
  };
}