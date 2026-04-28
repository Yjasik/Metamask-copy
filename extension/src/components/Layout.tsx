import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  networkName?: string; // чтобы позже можно было менять сеть
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Wallet',
  onBack,
  networkName = 'Ethereum',
}) => {
  return (
    <div className="app">
      {/* Шапка */}
      <header className="app-header">
        {onBack ? (
          <button onClick={onBack} className="text-primary text-sm font-medium mr-4">
            ← Назад
          </button>
        ) : (
          <div className="app-logo">{title}</div>
        )}
        <div className="network-selector">
          <span>{networkName}</span>
        </div>
      </header>

      {/* Содержимое страницы */}
      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
};

export default Layout;