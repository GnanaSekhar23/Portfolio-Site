import { useState } from 'react';
import './admin.css';

export default function AdminLogin({ onLogin, verifying, error }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onLogin(value.trim());
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <span className="eyebrow">restricted</span>
        <h1 className="admin-login__title mono">Admin access</h1>
        <p className="admin-login__sub">Enter the admin token to manage projects, experience, and messages.</p>

        <label className="admin-field__label mono" htmlFor="admin-token">
          admin token
        </label>
        <input
          id="admin-token"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••••••"
          autoFocus
          disabled={verifying}
        />

        {error && <p className="admin-login__error mono">✕ {error}</p>}

        <button className="btn btn--primary" type="submit" disabled={verifying}>
          {verifying ? 'Verifying…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
