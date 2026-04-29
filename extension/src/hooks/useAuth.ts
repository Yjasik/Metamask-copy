// extension/src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

declare const chrome: any;
const SESSION_KEY = 'session';

function getStorage() {
  return chrome.storage.local;
}

export function useAuth() {
  const wallet = useWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // При первом рендере проверяем, была ли сохранена сессия
  useEffect(() => {
    getStorage().get(SESSION_KEY, (result: { [SESSION_KEY]?: boolean }) => {
      if (result[SESSION_KEY]) {
        // Сессия есть, но кошелёк ещё заблокирован – пользователь должен ввести пароль
        // Оставляем isLoggedIn = false
      }
    });
  }, []);

  /**
   * Вход в кошелёк: разблокировка с помощью пароля
   */
  const login = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await wallet.unlockWallet(password); // бросает ошибку при неверном пароле
      await getStorage().set({ [SESSION_KEY]: true });
      setIsLoggedIn(true);
    } catch (e: any) {
      setError(e.message || 'Неверный пароль');
      throw e; // пробрасываем ошибку, чтобы Login мог её показать
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  /**
   * Выход: блокировка кошелька и удаление сессии
   */
  const logout = useCallback(async () => {
    wallet.lockWallet();
    await getStorage().remove(SESSION_KEY);
    setIsLoggedIn(false);
  }, [wallet]);

  return {
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    error,
    login,
    logout,
    wallet, // проксируем весь кошелёк (account, balance, fetchBalance, import...)
  };
}