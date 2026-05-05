import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BuyScreen from './components/BuyScreen';
import SendScreen from './components/SendScreen';
import ImportWallet from './components/ImportWallet';
import Login from './components/Login';
import { useAuth } from './hooks/useAuth';
import AddToken from './components/AddToken';
import { supportedChains } from './lib/chains'; 

type Screen = 'dashboard' | 'send' | 'buy' | 'import' | 'addToken';

function App() {
  const auth = useAuth();
  const [screen, setScreen] = useState<Screen>('dashboard');

  const goTo = (s: Screen) => setScreen(s);

  if (!auth.isLoggedIn) {
    return (
      <Login
        onLogin={async (password: string) => {
          await auth.login(password);
        }}
        onBackendLogin={async (email, password) => {
          await auth.loginWithBackend(email, password);
        }}
        onBackendRegister={async (email, password) => {
          await auth.register(email, password);
        }}
        onImport={() => {
          setScreen('import');
        }}
      />
    );
  }
  let content: React.ReactNode;
  switch (screen) {
    case 'addToken':
      content = <AddToken onBack={() => goTo('dashboard')} />;
      break;
    case 'send':
      content = <SendScreen onBack={() => goTo('dashboard')} wallet={auth.wallet} />;
      break;
    case 'buy':
      content = <BuyScreen onBack={() => goTo('dashboard')} />;
      break;
    case 'import':
      content = (
        <ImportWallet
          onBack={() => goTo('dashboard')}
          wallet={auth.wallet}
          onImportSuccess={() => {
            auth.setIsLoggedIn(true);
            goTo('dashboard');
          }}
        />
      );
      break;
    default:
      content = (
        <Dashboard
          onNavigate={goTo}
          walletData={auth.wallet} 
          onLogout={auth.logout}
        />
      );
  }

  return (
    <Layout
      title="Wallet"
      onBack={screen !== 'dashboard' ? () => goTo('dashboard') : undefined}
      currentChain={auth.wallet.chain}
      supportedChains={supportedChains}
      onSwitchChain={(chainId) => auth.wallet.switchChain(chainId)}
    >
      {content}
    </Layout>
  );
}

export default App;