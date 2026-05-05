import React, { useEffect, useMemo } from 'react';
import TokenList from './TokenList';
import { useTokens } from '../hooks/useTokens';
import ActivityTab from './ActivityTab';

interface DashboardProps {
  onNavigate: (screen: 'send' | 'buy' | 'import' | 'addToken') => void;
  walletData?: {
    address: string | null;
    balance: string;
    fetchBalance: () => Promise<void>;
    chain: { name: string; id: number };
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, walletData, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState<'tokens' | 'activity'>('tokens');
  const { tokens: storedTokens } = useTokens();

  const formatBalance = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.000';
    return num.toFixed(3);
  };

  const displayTokens = useMemo(() => {
    const result: {
      symbol: string;
      name: string;
      balance: string;
      usdValue: string;
      iconLetter: string;
      contractAddress?: string;
    }[] = [];

    result.push({
      symbol: 'ETH',
      name: 'Ethereum',
      balance: walletData?.balance || '0',
      usdValue: '$0.00',
      iconLetter: 'E',
    });

    for (const t of storedTokens) {
      result.push({
        symbol: t.symbol,
        name: t.name,
        balance: t.balance || '0',
        usdValue: t.usdValue || '$0.00',
        iconLetter: t.symbol.charAt(0).toUpperCase(),
        contractAddress: t.contractAddress,
      });
    }

    return result;
  }, [walletData?.balance, storedTokens]);

  useEffect(() => {
    if (walletData?.address) {
      walletData.fetchBalance();
    }
  }, [walletData?.address, walletData?.chain?.id]);

  const formattedAddress = walletData?.address
    ? `${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`
    : '';

  return (
    <div className="flex flex-col flex-1">
      {/* Balance and logout button */}
      <div className="balance-display relative">
        <div className="balance-amount">
          {formatBalance(walletData?.balance || '0')} {walletData?.chain?.name || 'ETH'}
        </div>
        <div className="balance-fiat">
          {walletData?.address ? (
            <span className="text-sm text-muted">{formattedAddress}</span>
          ) : (
            '$0.00 USD'
          )}
        </div>
        <button
          onClick={onLogout}
          className="absolute top-2 right-2 text-xs text-muted hover:text-danger transition-colors"
          title="Logout"
        >
          Logout
        </button>
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('buy')}>
          <div className="icon icon-buy" />
          <span className="label">Buy</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('send')}>
          <div className="icon icon-send" />
          <span className="label">Send</span>
        </button>
        <button className="action-btn" onClick={() => {}}>
          <div className="icon icon-swap" />
          <span className="label">Swap</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('import')}>
          <div className="icon icon-receive" />
          <span className="label">Receive</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`tab ${activeTab === 'tokens' ? 'active' : ''}`}
        >
          Tokens
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
        >
          Activity
        </button>
        <button
          onClick={() => onNavigate('addToken')}
          className="tab ml-auto"
        >
          Add Token
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'tokens' && (
        <TokenList
          tokens={displayTokens}
          onTokenClick={(token) => {
            console.log('Token clicked:', token.name);
          }}
        />
      )}
      {activeTab === 'activity' && (
        <ActivityTab 
          address={walletData?.address || null}
          chainId={walletData?.chain?.id || 1}
        />
      )}
    </div>
  );
};

export default Dashboard;