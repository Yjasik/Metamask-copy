import React, { useState } from 'react';

interface ImportWalletProps {
  onBack: () => void;
}

type ImportTab = 'seed' | 'privateKey';

const ImportWallet: React.FC<ImportWalletProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<ImportTab>('seed');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    setError('');

    if (activeTab === 'seed') {
      const words = seedPhrase.trim().split(/\s+/);
      if (words.length !== 12) {
        setError('Секретная фраза должна состоять из 12 слов');
        return;
      }
      // Логика импорта seed-фразы (пока заглушка)
      alert('Импорт seed-фразы... Проверка и восстановление кошелька.');
      return;
    }

    if (activeTab === 'privateKey') {
      if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
        setError('Введите корректный приватный ключ (66 символов, начиная с 0x)');
        return;
      }
      // Логика импорта приватного ключа (заглушка)
      alert('Импорт приватного ключа...');
      return;
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Заголовок и кнопка назад */}
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Импорт кошелька</h2>
      </div>

      {/* Описание */}
      <p className="text-sm text-muted mb-4">
        Импортируйте существующий кошелёк с помощью секретной фразы из 12 слов или приватного ключа.
      </p>

      {/* Вкладки */}
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === 'seed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('seed'); setError(''); }}
        >
          Секретная фраза
        </button>
        <button
          className={`tab ${activeTab === 'privateKey' ? 'active' : ''}`}
          onClick={() => { setActiveTab('privateKey'); setError(''); }}
        >
          Приватный ключ
        </button>
      </div>

      {/* Поля ввода для seed-фразы */}
      {activeTab === 'seed' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted mb-2 block">
              Введите вашу секретную фразу (12 слов)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl text-md resize-none focus:outline-none focus:border-primary"
              rows={5}
              placeholder="Введите слова через пробел"
              value={seedPhrase}
              onChange={(e) => { setSeedPhrase(e.target.value); setError(''); }}
            />
            <p className="text-xs text-muted mt-1">
              Обычно это 12 (иногда 24) слова, разделённые пробелами.
            </p>
          </div>
          <div>
            <label className="text-sm text-muted mb-2 block">Новый пароль для шифрования</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Поля ввода для приватного ключа */}
      {activeTab === 'privateKey' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted mb-2 block">
              Приватный ключ
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl text-md font-mono focus:outline-none focus:border-primary"
              placeholder="0x..."
              value={privateKey}
              onChange={(e) => { setPrivateKey(e.target.value); setError(''); }}
            />
            <p className="text-xs text-muted mt-1">
              Введите приватный ключ в шестнадцатеричном формате (66 символов).
            </p>
          </div>
          <div>
            <label className="text-sm text-muted mb-2 block">Новый пароль для шифрования</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Ошибка */}
      {error && <p className="text-danger text-sm mt-2">{error}</p>}

      {/* Кнопка импорта */}
      <button
        onClick={handleImport}
        disabled={
          (activeTab === 'seed' && (!seedPhrase.trim() || !password.trim())) ||
          (activeTab === 'privateKey' && (!privateKey.trim() || !password.trim()))
        }
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition-colors ${
          (activeTab === 'seed' && seedPhrase.trim() && password.trim()) ||
          (activeTab === 'privateKey' && privateKey.trim() && password.trim())
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-muted text-muted cursor-not-allowed'
        }`}
      >
        Импортировать
      </button>
    </div>
  );
};

export default ImportWallet;