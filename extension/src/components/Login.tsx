import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;         // вызывается при успешном входе
  onImport: () => void;        // переход на экран импорта / создания
}

const Login: React.FC<LoginProps> = ({ onLogin, onImport }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Простейшая проверка пароля (заглушка)
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

    // Здесь будет реальная проверка пароля (например, расшифровка сохранённого keystore)
    // Пока просто вызываем onLogin
    onLogin();
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
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Ваш пароль"
            className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!password.trim()}
          className={`w-full py-3 rounded-xl font-semibold transition-colors ${
            password.trim()
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-muted text-muted cursor-not-allowed'
          }`}
        >
          Разблокировать
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