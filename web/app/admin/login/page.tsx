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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ width: '400px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>FocusEngine Admin</h1>
        {error && <div style={{ color: '#ef4444', textAlign: 'center' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Username</label>
          <input 
            type="text" 
            className="input-field" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Login</button>
        <button type="button" onClick={handleSetup} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>First Time Setup</button>
      </form>
    </div>
  );
}
