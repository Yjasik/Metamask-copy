import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => Promise<void>;
  onBackendLogin: (email: string, password: string) => Promise<void>;
  onBackendRegister: (email: string, password: string) => Promise<void>;
  onImport: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBackendLogin, onBackendRegister, onImport }) => {
  const [mode, setMode] = useState<'lock' | 'login' | 'register'>('lock');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin(password);
    } catch (err: any) {
      setError(err.message || 'Incorrect password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await onBackendLogin(email, password);
      } else {
        await onBackendRegister(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 justify-center login-container">
      <div className="card login-card">
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #037dd6, #8B5CF6)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: 'white',
              fontWeight: 700,
            }}
          >
            M
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>MetaMask Copy</h1>
          {mode === 'lock' && (
            <p style={{ color: '#6a737d', fontSize: 14, marginTop: 8 }}>
              Enter your password to unlock
            </p>
          )}
        </div>

        {/* Unlock mode (local password) */}
        {mode === 'lock' && (
          <form onSubmit={handleLockSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className="input-field"
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!password.trim() || isLoading}
              className="primary-btn"
            >
              {isLoading ? 'Checking...' : 'Unlock'}
            </button>

            <div className="login-separator">
              <span>or</span>
            </div>

            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => setMode('login')} className="link-btn">
                Sign in with email
              </button>
              <button type="button" onClick={() => setMode('register')} className="link-btn">
                Register
              </button>
              <button type="button" onClick={onImport} className="link-btn">
                Import wallet
              </button>
            </div>
          </form>
        )}

        {/* Backend login / register mode */}
        {(mode === 'login' || mode === 'register') && (
          <form onSubmit={handleBackendSubmit} className="flex flex-col gap-4">
            <h2 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>
              {mode === 'login' ? 'Sign In' : 'Register'}
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className="primary-btn"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register'}
            </button>
            <button type="button" onClick={() => setMode('lock')} className="link-btn" style={{ marginTop: 4 }}>
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;