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
          setError('Secret Recovery Phrase must be 12 or 24 words');
          setIsLoading(false);
          return;
        }
        await wallet.importFromMnemonic(seedPhrase.trim(), password);
      } else {
        if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
          setError('Enter a valid private key (66 characters, starting with 0x)');
          setIsLoading(false);
          return;
        }
        await wallet.importFromPrivateKey(privateKey.trim(), password);
      }
      onImportSuccess();
    } catch (e: any) {
      setError(e.message || 'Wallet import failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Header and back button */}
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Import Wallet</h2>
      </div>

      <p className="text-sm text-muted mb-4">
        Import an existing wallet using your Secret Recovery Phrase or private key.
      </p>

      {/* Import method tabs */}
      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === 'seed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('seed'); setError(''); }}
        >
          Secret Recovery Phrase
        </button>
        <button
          className={`tab ${activeTab === 'privateKey' ? 'active' : ''}`}
          onClick={() => { setActiveTab('privateKey'); setError(''); }}
        >
          Private Key
        </button>
      </div>

      {/* Seed phrase form */}
      {activeTab === 'seed' && (
        <div className="flex flex-col gap-4">
          <textarea
            className="input-field resize-none"
            rows={5}
            placeholder="Enter words separated by spaces"
            value={seedPhrase}
            onChange={(e) => { setSeedPhrase(e.target.value); setError(''); }}
          />
          <input
            type="password"
            className="input-field"
            placeholder="New encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {/* Private key form */}
      {activeTab === 'privateKey' && (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            className="input-field font-mono"
            placeholder="0x..."
            value={privateKey}
            onChange={(e) => { setPrivateKey(e.target.value); setError(''); }}
          />
          <input
            type="password"
            className="input-field"
            placeholder="New encryption password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
        className="primary-btn mt-6"
      >
        {isLoading ? 'Importing...' : 'Import'}
      </button>
    </div>
  );
};

export default ImportWallet;