import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BuyScreen from './components/BuyScreen';
import SendScreen from './components/SendScreen';
import ImportWallet from './components/ImportWallet';
import Login from './components/Login';
import { useAuth } from './hooks/useAuth';

type Screen = 'dashboard' | 'send' | 'buy' | 'import';

function App() {
  const auth = useAuth();
  const [screen, setScreen] = useState<Screen>('dashboard');

  const goTo = (s: Screen) => setScreen(s);

  // Если не залогинены – показываем экран входа
  if (!auth.isLoggedIn) {
    return (
      <Login
        onLogin={async (password: string) => {
          await auth.login(password); // auth.login уже пробрасывает ошибку, если пароль неверный
        }}
        onImport={() => {
          // При импорте мы сначала должны создать/импортировать кошелёк,
          // потом авторизоваться. Пока оставляем переход на экран импорта.
          setScreen('import');
        }}
      />
    );
  }

  // Основной интерфейс после входа
  let content: React.ReactNode;
  switch (screen) {
    case 'send':
      content = <SendScreen onBack={() => goTo('dashboard')} />;
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
      // В Dashboard теперь можно передать данные из auth.wallet (address, balance и т.д.)
      content = (
        <Dashboard
          onNavigate={goTo}
          walletData={auth.wallet} // опционально, если Dashboard ожидает такие пропсы
        />
      );
  }

  return (
    <Layout
      title="Wallet"
      onBack={screen !== 'dashboard' ? () => goTo('dashboard') : undefined}
      networkName="Ethereum"
    >
      {content}
    </Layout>
  );
}

export default App;