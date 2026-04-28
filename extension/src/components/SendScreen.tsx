import React, { useState } from 'react';

interface SendScreenProps {
  onBack: () => void;
}

const SendScreen: React.FC<SendScreenProps> = ({ onBack }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const mockBalance = 2.793; // ETH

  const handleSend = () => {
    setError('');
    if (!recipient.trim()) {
      setError('Введите адрес получателя');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    if (amt > mockBalance) {
      setError('Недостаточно средств');
      return;
    }
    // TODO: Логика отправки через viem
    alert(`Отправка ${amt} ETH на ${recipient}`);
    // После успешной отправки можно вернуться назад
    // onBack();
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Отправить</h2>
      </div>

      {/* Актив и баланс */}
      <div className="mb-6 bg-light p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              E
            </div>
            <span className="font-medium">ETH</span>
          </div>
          <span className="text-sm text-muted">{mockBalance} ETH</span>
        </div>
      </div>

      {/* Поле адреса */}
      <div className="mb-4">
        <label className="text-sm text-muted mb-2 block">Адрес получателя</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => { setRecipient(e.target.value); setError(''); }}
          className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary font-mono"
        />
      </div>

      {/* Поле суммы */}
      <div className="mb-6">
        <label className="text-sm text-muted mb-2 block">Сумма</label>
        <div className="relative">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(''); }}
            className="w-full p-3 pr-16 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-sm text-muted">ETH</span>
            <button
              className="text-primary text-xs font-medium hover:underline"
              onClick={() => setAmount(mockBalance.toString())}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <button
        onClick={handleSend}
        disabled={!recipient.trim() || !amount.trim()}
        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
          recipient.trim() && amount.trim()
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-muted text-muted cursor-not-allowed'
        }`}
      >
        Отправить
      </button>
    </div>
  );
};

export default SendScreen;