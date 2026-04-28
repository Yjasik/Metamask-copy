import React from 'react';
import TokenList from './TokenList';

interface DashboardProps {
  onNavigate: (screen: 'send' | 'buy' | 'import') => void;
}

// Пример данных токенов (заглушка)
const MOCK_TOKENS = [
  {
    symbol: 'ETH',
    name: 'SepoliaETH',
    balance: '2,793',
    usdValue: '$5,248.42',
    iconLetter: 'S',
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    balance: '987,970',
    usdValue: '$987.97',
    iconLetter: 'U',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col flex-1">
      {/* Баланс */}
      <div className="balance-display">
        <div className="balance-amount">2,793 SepoliaETH</div>
        <div className="balance-fiat">$5,248.42 USD</div>
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

      {/* Список токенов через компонент */}
      <TokenList
        tokens={MOCK_TOKENS}
        onTokenClick={(token) => {
          // Например, переход на страницу деталей токена (пока нет)
          console.log('Token clicked:', token.name);
        }}
      />
    </div>
  );
};

export default Dashboard;