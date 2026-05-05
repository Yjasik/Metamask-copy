import React from 'react';
import type { Chain } from 'viem';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  currentChain: Chain;
  supportedChains: Chain[];
  onSwitchChain: (chainId: number) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Wallet',
  onBack,
  currentChain,
  supportedChains,
  onSwitchChain,
}) => {
  return (
    <div className="app">
      <header className="app-header">
        {onBack ? (
          <button onClick={onBack} className="link-btn" style={{ fontSize: 16 }}>
            ← Back
          </button>
        ) : (
          <div className="app-logo">{title}</div>
        )}

        {/* Network selector in updated style */}
        <select
          className="network-selector"
          value={currentChain.id}
          onChange={(e) => onSwitchChain(Number(e.target.value))}
        >
          {supportedChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </header>

      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
};

export default Layout;