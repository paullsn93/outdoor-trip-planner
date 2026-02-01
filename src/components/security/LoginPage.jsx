import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Lock, Mountain } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
      setPassword('');
    } else {
      // Force reload to ensure all components (Maps/Layout) initialize correctly
      // This fixes the "black screen" issue on first login
      window.location.reload();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <Mountain size={48} className="logo-icon" />
          <h1>Outdoor Planner</h1>
          <p className="subtitle">請輸入行程密碼以繼續</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="輸入密碼..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="password-input"
              autoFocus
            />
          </div>

          {error && <div className="error-msg">密碼錯誤，請重新輸入</div>}

          <button type="submit" className="btn btn-primary login-btn">
            進入行程
          </button>
        </form>

        <div className="role-hint">
          <small>測試密碼: admin123 (管理) / team2026 (參加) / viewonly (訪客)</small>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: hsl(var(--color-bg-h), var(--color-bg-s), var(--color-bg-l));
          padding: var(--space-4);
        }
        .login-card {
          background: hsl(var(--color-surface-h), var(--color-surface-s), var(--color-surface-l));
          padding: var(--space-8) var(--space-6);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 400px;
          border: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
          box-shadow: var(--shadow-lg);
          text-align: center;
        }
        .logo-section {
          margin-bottom: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }
        .logo-icon {
          color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
        }
        .subtitle {
          color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
          font-size: 0.9rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .input-group {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
        }
        .password-input {
          width: 100%;
          padding: var(--space-3) var(--space-3) var(--space-3) 40px;
          border: 1px solid hsl(var(--color-border-h), var(--color-border-s), var(--color-border-l));
          border-radius: var(--radius-md);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .password-input:focus {
          border-color: hsl(var(--color-p-h), var(--color-p-s), var(--color-p-l));
          box-shadow: 0 0 0 2px hsla(var(--color-p-h), var(--color-p-s), var(--color-p-l), 0.1);
        }
        .login-btn {
          width: 100%;
          padding: var(--space-3);
          font-size: 1rem;
        }
        .error-msg {
          color: var(--color-danger);
          font-size: 0.85rem;
          text-align: left;
        }
        .role-hint {
          margin-top: var(--space-6);
          color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
