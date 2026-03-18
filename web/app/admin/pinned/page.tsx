"use client";

import { useEffect, useState } from 'react';

type PinItem = {
  url: string;
  label: string;
};

function getFavicon(url: string) {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch { return null; }
}

export default function PinnedSitesPage() {
  const [pins, setPins] = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [message, setMessage] = useState('');

  const loadPins = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      const raw: string = data.config?.pinnedWebsites || '';
      if (raw.trim()) {
        // Format: "label|url,label|url" or plain "url,url" for legacy
        const items: PinItem[] = raw.split(',').map((s: string) => {
          const trimmed = s.trim();
          const parts = trimmed.split('|');
          if (parts.length === 2) return { label: parts[0].trim(), url: parts[1].trim() };
          return { label: '', url: trimmed };
        }).filter((p: PinItem) => p.url);
        setPins(items);
      }
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadPins(); }, []);

  const savePins = async (updatedPins: PinItem[]) => {
    setSaving(true);
    const raw = updatedPins.map(p => `${p.label || new URL(p.url).hostname}|${p.url}`).join(',');
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinnedWebsites: raw }),
    });
    setSaving(false);
    setMessage('Saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  const addPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    let url = newUrl;
    if (!url.startsWith('http')) url = 'https://' + url;
    const label = newLabel || new URL(url).hostname.replace('www.', '');
    const updated = [...pins, { url, label }];
    setPins(updated);
    await savePins(updated);
    setNewUrl('');
    setNewLabel('');
  };

  const removePin = async (index: number) => {
    const updated = pins.filter((_, i) => i !== index);
    setPins(updated);
    await savePins(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Pinned Sites</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>These appear as quick-access tiles on the user search homepage.</p>
        </div>
        {saving && <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Saving…</span>}
        {message && <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>{message}</span>}
      </div>

      {/* Add new pin form */}
      <form onSubmit={addPin} className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 2, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>URL *</label>
          <input className="input-field" required value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://yourcompany.com" />
        </div>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Label (optional)</label>
          <input className="input-field" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Company Portal" />
        </div>
        <button type="submit" style={{ padding: '12px 22px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Add Site
        </button>
      </form>

      {/* Grid of pinned cards */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : pins.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No pinned sites yet. Add your first one above!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {pins.map((pin, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden' }}>
              <button onClick={() => removePin(i)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '24px', height: '24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove">✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getFavicon(pin.url) ? (
                    <img src={getFavicon(pin.url)!} width={20} height={20} alt="" style={{ borderRadius: '4px' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : <span>🌐</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{pin.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{pin.url.replace(/^https?:\/\//, '')}</div>
                </div>
              </div>
              <a href={pin.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>↗ Visit Site</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
