import React, { useState } from 'react';

interface BuyScreenProps {
  onBack: () => void;
}

const BuyScreen: React.FC<BuyScreenProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');

  const handleBuy = () => {
    alert(`Purchase ${amount} USD`);
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ textAlign: 'center' }}>
          Buy Crypto
        </h2>

        {/* Provider selection */}
        <div className="mb-6">
          <label className="text-sm text-muted mb-2 block">Payment Method</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center bg-light p-3 rounded-xl border border-gray-200 hover:border-primary cursor-pointer transition-colors">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #037dd6, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                M
              </div>
              <div className="flex-1">
                <div className="font-medium">MoonPay</div>
                <div className="text-sm text-muted">Card, Apple Pay, Google Pay</div>
              </div>
            </div>
            <div className="flex items-center bg-light p-3 rounded-xl border border-gray-200 hover:border-primary cursor-pointer transition-colors">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #037dd6, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  marginRight: 12,
                }}
              >
                T
              </div>
              <div className="flex-1">
                <div className="font-medium">Transak</div>
                <div className="text-sm text-muted">Card, Bank Transfer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-8">
          <label htmlFor="amount" className="text-sm text-muted mb-2 block">Amount in USD</label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              style={{ paddingRight: 50 }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-muted">USD</span>
          </div>
          <p className="text-xs text-muted mt-1">Minimum: 30 USD</p>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={!amount || parseFloat(amount) <= 0}
          className="primary-btn"
          style={{ width: '100%' }}
        >
          Buy
        </button>

        <p className="text-xs text-muted text-center mt-4">
          You will be redirected to the provider's website to complete the purchase.
        </p>
      </div>
    </div>
  );
};

export default BuyScreen;