import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => Promise<void>;
  onImport: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onImport }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="flex flex-col flex-1 p-4 justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold mb-2">MetaMask Copy</h1>
        <p className="text-sm text-muted">
          Добро пожаловать обратно! Введите пароль для разблокировки кошелька.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="text-sm text-muted mb-2 block">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Ваш пароль"
            className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!password.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-semibold transition-colors ${
            password.trim() && !isLoading
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-muted text-muted cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Проверка...' : 'Разблокировать'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onImport}
          className="text-primary text-sm font-medium hover:underline"
        >
          Восстановить из секретной фразы или импортировать
        </button>
      </div>
    </div>
  );
};

export default Login;