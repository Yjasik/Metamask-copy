import React, { useState } from 'react';

interface BuyScreenProps {
  onBack: () => void;
}

const BuyScreen: React.FC<BuyScreenProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');

  const handleBuy = () => {
    // Здесь будет логика покупки (пока заглушка)
    alert(`Покупка ${amount} USD`);
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Заголовок и навигация */}
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Купить криптовалюту</h2>
      </div>

      {/* Выбор провайдера */}
      <div className="mb-6">
        <label className="text-sm text-muted mb-2 block">Способ покупки</label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center bg-light p-3 rounded-xl border border-gray-200 hover:border-primary cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-bold text-primary">M</span>
            </div>
            <div className="flex-1">
              <div className="font-medium">MoonPay</div>
              <div className="text-sm text-muted">Карта, Apple Pay, Google Pay</div>
            </div>
          </div>
          <div className="flex items-center bg-light p-3 rounded-xl border border-gray-200 hover:border-primary cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="font-bold text-primary">T</span>
            </div>
            <div className="flex-1">
              <div className="font-medium">Transak</div>
              <div className="text-sm text-muted">Карта, банковский перевод</div>
            </div>
          </div>
        </div>
      </div>

      {/* Сумма */}
      <div className="mb-8">
        <label htmlFor="amount" className="text-sm text-muted mb-2 block">Сумма в USD</label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 pr-12 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary"
          />
          <span className="absolute right-4 top-3.5 text-md text-muted">USD</span>
        </div>
        <p className="text-xs text-muted mt-1">Минимум: 30 USD</p>
      </div>

      {/* Кнопка Купить */}
      <button
        onClick={handleBuy}
        disabled={!amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
          amount && parseFloat(amount) > 0
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-muted text-muted cursor-not-allowed'
        }`}
      >
        Купить
      </button>

      <p className="text-xs text-muted text-center mt-4">
        Вы будете перенаправлены на сайт провайдера для завершения покупки.
      </p>
    </div>
  );
};

export default BuyScreen;