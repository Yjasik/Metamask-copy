import React, { useState } from 'react';

interface ImportWalletProps {
  onBack: () => void;
  wallet: {
    importFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
    importFromPrivateKey: (privateKey: string, password: string) => Promise<void>;
  };
  onImportSuccess: () => void;
}

type ImportTab = 'seed' | 'privateKey';

const ImportWallet: React.FC<ImportWalletProps> = ({ onBack, wallet, onImportSuccess }) => {
  const [activeTab, setActiveTab] = useState<ImportTab>('seed');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setError('');
    setIsLoading(true);
    try {
      if (activeTab === 'seed') {
        const words = seedPhrase.trim().split(/\s+/);
        if (words.length !== 12 && words.length !== 24) {
          setError('Секретная фраза должна состоять из 12 или 24 слов');
          setIsLoading(false);
          return;
        }
        await wallet.importFromMnemonic(seedPhrase.trim(), password);
      } else {
        if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
          setError('Введите корректный приватный ключ (66 символов, начиная с 0x)');
          setIsLoading(false);
          return;
        }
        await wallet.importFromPrivateKey(privateKey.trim(), password);
      }
      onImportSuccess();
    } catch (e: any) {
      setError(e.message || 'Ошибка импорта кошелька');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Импорт кошелька</h2>
      </div>

      <p className="text-sm text-muted mb-4">
        Импортируйте существующий кошелёк с помощью секретной фразы или приватного ключа.
      </p>

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

      {activeTab === 'seed' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted mb-2 block">
              Введите вашу секретную фразу
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl text-md resize-none focus:outline-none focus:border-primary"
              rows={5}
              placeholder="Введите слова через пробел"
              value={seedPhrase}
              onChange={(e) => { setSeedPhrase(e.target.value); setError(''); }}
            />
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

      {activeTab === 'privateKey' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted mb-2 block">Приватный ключ</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl text-md font-mono focus:outline-none focus:border-primary"
              placeholder="0x..."
              value={privateKey}
              onChange={(e) => { setPrivateKey(e.target.value); setError(''); }}
            />
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

      {error && <p className="text-danger text-sm mt-2">{error}</p>}

      <button
        onClick={handleImport}
        disabled={
          isLoading ||
          (activeTab === 'seed' && (!seedPhrase.trim() || !password.trim())) ||
          (activeTab === 'privateKey' && (!privateKey.trim() || !password.trim()))
        }
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition-colors ${
          !isLoading &&
          ((activeTab === 'seed' && seedPhrase.trim() && password.trim()) ||
            (activeTab === 'privateKey' && privateKey.trim() && password.trim()))
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-muted text-muted cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Импорт...' : 'Импортировать'}
      </button>
    </div>
  );
};

export default ImportWallet;