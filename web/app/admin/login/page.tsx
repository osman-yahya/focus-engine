"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  const handleSetup = async () => {
    setError('');
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      alert('Superadmin created! You can now login.');
    } else {
      const data = await res.json();
      setError(data.error || 'Setup failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', position: 'relative' }}>
      <div className="mesh-bg" />
      <form onSubmit={handleLogin} className="glass-panel" style={{ width: '420px', padding: '44px', display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative', zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>F</span>
          </div>
          <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>FocusEngine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to the admin panel</p>
        </div>

        {error && <div style={{ padding: '12px 16px', background: 'var(--error-surface)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', border: '1px solid var(--error-border)', textAlign: 'center' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Username</label>
          <input 
            type="text" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
          <input 
            type="password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Sign In</button>
        <button type="button" onClick={handleSetup} style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-surface)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--panel-border)'; e.currentTarget.style.background = 'transparent'; }}>
          First Time Setup
        </button>
      </form>
    </div>
  );
}
