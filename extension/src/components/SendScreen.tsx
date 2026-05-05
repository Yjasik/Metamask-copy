import React, { useState } from 'react';

interface SendScreenProps {
  onBack: () => void;
  wallet: {
    balance: string;
    address: string | null;
    chain: { name: string };
    sendTransaction: (to: string, amount: string) => Promise<any>;
  };
}

const SendScreen: React.FC<SendScreenProps> = ({ onBack, wallet }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setError('');
    setSuccess('');
    if (!recipient.trim()) {
      setError('Enter recipient address');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (amt > parseFloat(wallet.balance)) {
      setError('Insufficient funds');
      return;
    }
    setIsLoading(true);
    try {
      const txHash = await wallet.sendTransaction(recipient.trim(), amount);
      setSuccess(`Transaction sent: ${txHash}`);
      setRecipient('');
      setAmount('');
    } catch (e: any) {
      setError(e.message || 'Send failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Back button */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ textAlign: 'center' }}>
          Send
        </h2>

        {/* Balance display */}
        <div className="bg-light p-4 rounded-xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #037dd6, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              E
            </div>
            <span className="font-semibold">{wallet.chain.name} ETH</span>
          </div>
          <span className="text-sm text-muted">{wallet.balance} ETH</span>
        </div>

        <div className="mb-4">
          <label className="text-sm text-muted mb-2 block">Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => { setRecipient(e.target.value); setError(''); setSuccess(''); }}
            className="input-field"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-muted mb-2 block">Amount</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); setSuccess(''); }}
              className="input-field"
              style={{ paddingRight: 70 }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-sm text-muted">ETH</span>
              <button
                className="text-primary text-xs font-medium hover:underline"
                onClick={() => setAmount(wallet.balance)}
              >
                MAX
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        {success && <p className="text-success text-sm mb-4">{success}</p>}

        <button
          onClick={handleSend}
          disabled={!recipient.trim() || !amount.trim() || isLoading}
          className="primary-btn"
          style={{ width: '100%' }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default SendScreen;