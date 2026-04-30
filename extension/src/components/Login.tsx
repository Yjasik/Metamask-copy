import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => Promise<void>;
  onBackendLogin: (email: string, password: string) => Promise<void>;
  onBackendRegister: (email: string, password: string) => Promise<void>;
  onImport: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBackendLogin, onBackendRegister, onImport }) => {
  const [mode, setMode] = useState<'lock' | 'login' | 'register'>('lock');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin(password);
    } catch (err: any) {
      setError(err.message || 'Неверный пароль');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await onBackendLogin(email, password);
      } else {
        await onBackendRegister(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 justify-center">
      {mode === 'lock' && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold mb-2">MetaMask Copy</h1>
            <p className="text-sm text-muted">Введите пароль для разблокировки.</p>
          </div>
          <form onSubmit={handleLockSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-muted mb-2 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Пароль"
                className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
              />
            </div>
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!password.trim() || isLoading}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                password.trim() && !isLoading ? 'bg-primary text-white' : 'bg-muted text-muted cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Проверка...' : 'Разблокировать'}
            </button>
          </form>
          <div className="mt-6 text-center flex flex-col gap-2">
            <button onClick={() => setMode('login')} className="text-primary text-sm font-medium hover:underline">
              Войти через почту
            </button>
            <button onClick={() => setMode('register')} className="text-primary text-sm font-medium hover:underline">
              Зарегистрироваться
            </button>
            <button onClick={onImport} className="text-primary text-sm font-medium hover:underline">
              Импортировать кошелёк
            </button>
          </div>
        </>
      )}

      {(mode === 'login' || mode === 'register') && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold mb-2">
              {mode === 'login' ? 'Вход' : 'Регистрация'}
            </h1>
          </div>
          <form onSubmit={handleBackendSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-muted mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted mb-2 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
              />
            </div>
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                email && password && !isLoading ? 'bg-primary text-white' : 'bg-muted text-muted cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Обработка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setMode('lock')} className="text-primary text-sm font-medium hover:underline">
              ← Назад
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;