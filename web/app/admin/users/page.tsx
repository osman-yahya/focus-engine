"use client";

import { useEffect, useState } from 'react';

type Admin = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
};

const ROLES = ['SUPERADMIN', 'ADMIN', 'VIEWER'];

const roleBadgeStyle = (role: string) => ({
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: '0.78rem',
  fontWeight: 600,
  background: role === 'SUPERADMIN' ? 'rgba(168,85,247,0.18)' : role === 'ADMIN' ? 'rgba(34,211,238,0.15)' : 'rgba(148,163,184,0.15)',
  color: role === 'SUPERADMIN' ? '#c084fc' : role === 'ADMIN' ? '#22d3ee' : '#94a3b8',
  border: `1px solid ${role === 'SUPERADMIN' ? 'rgba(168,85,247,0.3)' : role === 'ADMIN' ? 'rgba(34,211,238,0.25)' : 'rgba(148,163,184,0.2)'}`,
});

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'ADMIN' });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
      else setError(data.error);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true); setAddError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (data.success) {
      setNewUser({ username: '', password: '', role: 'ADMIN' });
      setShowAdd(false);
      fetchAdmins();
    } else {
      setAddError(data.error);
    }
    setAdding(false);
  };

  const handleRoleChange = async (id: string, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    fetchAdmins();
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete admin "${username}"? This cannot be undone.`)) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!data.success) alert(data.error);
    else fetchAdmins();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Admin Users</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{ padding: '10px 22px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          {showAdd ? '✕ Cancel' : '+ Add Admin'}
        </button>
      </div>

      {error && <div style={{ color: '#f87171', marginBottom: '16px' }}>{error}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Username</label>
            <input className="input-field" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="john_doe" />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" className="input-field" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••••" />
          </div>
          <div style={{ minWidth: '140px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role</label>
            <select className="input-field" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ cursor: 'pointer' }}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" disabled={adding} style={{ padding: '12px 24px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {adding ? 'Adding...' : 'Create User'}
          </button>
          {addError && <div style={{ width: '100%', color: '#f87171', fontSize: '0.9rem' }}>{addError}</div>}
        </form>
      )}

      <div className="glass-panel" style={{ padding: '4px 0', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading...</p>
        ) : admins.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>No admins found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Username</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Role</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Created</th>
                <th style={{ padding: '14px 20px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} style={{ borderTop: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 20px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#000', flexShrink: 0 }}>
                        {admin.username[0].toUpperCase()}
                      </div>
                      {admin.username}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={admin.role}
                      onChange={e => handleRoleChange(admin.id, e.target.value)}
                      style={{ ...roleBadgeStyle(admin.role), background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '0.8rem' }}
                    >
                      {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a1a1a', color: '#fff' }}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
