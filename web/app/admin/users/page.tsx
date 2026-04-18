"use client";

import { useEffect, useState } from 'react';

type Admin = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
};

const ROLES = ['SUPERADMIN', 'ADMIN', 'VIEWER'];

const roleBadgeStyle = (role: string): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.03em',
  background: role === 'SUPERADMIN' ? 'rgba(124,58,237,0.12)' : role === 'ADMIN' ? 'rgba(96,165,250,0.12)' : 'rgba(148,163,184,0.1)',
  color: role === 'SUPERADMIN' ? '#a78bfa' : role === 'ADMIN' ? '#60a5fa' : '#94a3b8',
  border: `1px solid ${role === 'SUPERADMIN' ? 'rgba(124,58,237,0.2)' : role === 'ADMIN' ? 'rgba(96,165,250,0.2)' : 'rgba(148,163,184,0.15)'}`,
});

const avatarGradient = (role: string) =>
  role === 'SUPERADMIN' ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : role === 'ADMIN' ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' : 'linear-gradient(135deg, #64748b, #94a3b8)';

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
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Admin Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{admins.length} registered administrator{admins.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{ padding: '10px 22px', background: showAdd ? 'var(--error-surface)' : 'linear-gradient(135deg, var(--accent), #6d28d9)', color: showAdd ? 'var(--error)' : 'white', border: showAdd ? '1px solid var(--error-border)' : 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', transition: 'var(--transition)', fontFamily: 'inherit', boxShadow: showAdd ? 'none' : '0 4px 12px rgba(124, 58, 237, 0.25)' }}
        >
          {showAdd ? '✕ Cancel' : '+ Add Admin'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--error)', marginBottom: '16px', padding: '12px 16px', background: 'var(--error-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--error-border)', fontSize: '0.9rem' }}>{error}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Username</label>
            <input className="input-field" required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="john_doe" />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Password</label>
            <input type="password" className="input-field" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••••" />
          </div>
          <div style={{ minWidth: '140px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</label>
            <select className="input-field" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" disabled={adding} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--accent), #6d28d9)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)', transition: 'var(--transition)' }}>
            {adding ? 'Adding...' : 'Create User'}
          </button>
          {addError && <div style={{ width: '100%', color: 'var(--error)', fontSize: '0.85rem' }}>{addError}</div>}
        </form>
      )}

      <div className="glass-panel" style={{ padding: '2px 0', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading...</p>
        ) : admins.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>No admins found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: avatarGradient(admin.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        {admin.username[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{admin.username}</span>
                    </div>
                  </td>
                  <td>
                    <select
                      value={admin.role}
                      onChange={e => handleRoleChange(admin.id, e.target.value)}
                      style={{ ...roleBadgeStyle(admin.role), cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
                    >
                      {ROLES.map(r => <option key={r} value={r} style={{ background: '#0f1425', color: '#e8eaf0' }}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(admin.id, admin.username)}
                      style={{ padding: '6px 14px', background: 'var(--error-surface)', color: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', transition: 'var(--transition-fast)' }}
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
