import React from 'react';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  iconLetter?: string; // first letter for avatar
}

interface TokenListProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  emptyMessage?: string;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, onTokenClick, emptyMessage }) => {
  if (tokens.length === 0) {
    return (
      <div className="text-center text-muted text-sm py-6">
        {emptyMessage || 'No tokens'}
      </div>
    );
  }

  return (
    <div className="token-list">
      {tokens.map((token, index) => (
        <div
          key={index}
          className="token-item"
          onClick={() => onTokenClick?.(token)}
          role="button"
          tabIndex={0}
        >
          <div className="token-info">
            <div className="token-icon">
              {token.iconLetter || token.symbol.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="token-name">{token.name}</div>
              <div className="token-symbol">{token.symbol}</div>
            </div>
          </div>
          <div className="token-balance">
            <div className="token-amount">{token.balance}</div>
            <div className="token-value">{token.usdValue}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;