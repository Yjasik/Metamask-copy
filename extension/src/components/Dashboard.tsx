import React, { useEffect } from 'react';
import TokenList from './TokenList';

interface DashboardProps {
  onNavigate: (screen: 'send' | 'buy' | 'import') => void;
  walletData?: {
    address: string | null;
    balance: string;
    fetchBalance: () => Promise<void>;
    chain: { name: string };
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, walletData }) => {
  // При монтировании или изменении адреса можно запросить баланс
  useEffect(() => {
    if (walletData?.address) {
      walletData.fetchBalance();
    }
  }, [walletData?.address]);

  const formattedAddress = walletData?.address
    ? `${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`
    : '';

  return (
    <div className="flex flex-col flex-1">
      {/* Баланс */}
      <div className="balance-display">
        <div className="balance-amount">
          {walletData?.balance || '0'} {walletData?.chain?.name || 'ETH'}
        </div>
        <div className="balance-fiat">
          {walletData?.address ? (
            <span className="text-sm text-muted">{formattedAddress}</span>
          ) : (
            '$0.00 USD'
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('buy')}>
          <div className="icon icon-buy" />
          <span className="label">Купить</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('send')}>
          <div className="icon icon-send" />
          <span className="label">Отправить</span>
        </button>
        <button className="action-btn" onClick={() => {}}>
          <div className="icon icon-swap" />
          <span className="label">Обменять</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('import')}>
          <div className="icon icon-receive" />
          <span className="label">Получить</span>
        </button>
      </div>

      {/* Вкладки */}
      <div className="tabs">
        <button className="tab active">Токены</button>
        <button className="tab">DeFi</button>
        <button className="tab">NFT</button>
        <button className="tab">Деятельность</button>
      </div>

      {/* Список токенов */}
      <TokenList
        tokens={[
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: walletData?.balance || '0',
            usdValue: '$0.00',
            iconLetter: 'E',
          },
        ]}
        onTokenClick={(token) => {
          console.log('Token clicked:', token.name);
        }}
      />
    </div>
  );
};

export default Dashboard;