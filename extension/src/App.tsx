import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BuyScreen from './components/BuyScreen';
import SendScreen from './components/SendScreen';
import ImportWallet from './components/ImportWallet';
import Login from './components/Login';

type Screen = 'dashboard' | 'send' | 'buy' | 'import';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>('dashboard');

  const goTo = (s: Screen) => setScreen(s);

  // Если не залогинен – показываем Login
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onImport={() => {
          setIsLoggedIn(true);
          setScreen('import');
        }}
      />
    );
  }

  // Основной интерфейс
  let content: React.ReactNode;

  switch (screen) {
    case 'send':
      content = <SendScreen onBack={() => goTo('dashboard')} />;
      break;
    case 'buy':
      content = <BuyScreen onBack={() => goTo('dashboard')} />;
      break;
    case 'import':
      content = <ImportWallet onBack={() => goTo('dashboard')} />;
      break;
    default:
      content = <Dashboard onNavigate={goTo} />;
  }

  // На главном экране кнопка "Назад" не нужна, на остальных — нужна
  const showBack = screen !== 'dashboard';

  return (
    <Layout
      title="Wallet"
      onBack={showBack ? () => goTo('dashboard') : undefined}
      networkName="Ethereum"
    >
      {content}
    </Layout>
  );
}

export default App;