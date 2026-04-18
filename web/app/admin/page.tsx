"use client";

import { useState } from 'react';

export default function AdminDashboard() {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/crawler/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, depth: parseInt(depth) })
      });
      
      if (res.ok) {
        setMessage('Successfully added to crawling queue!');
        setUrl('');
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.startsWith('Success');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add new URLs to the crawling pipeline</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-surface)', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🌐</div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2px' }}>Index New URL</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Enter a website URL to scan and index its content.</p>
          </div>
        </div>
        
        {message && (
          <div style={{ padding: '12px 16px', background: isSuccess ? 'var(--success-surface)' : 'var(--error-surface)', color: isSuccess ? 'var(--success)' : 'var(--error)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem', border: `1px solid ${isSuccess ? 'var(--success-border)' : 'var(--error-border)'}` }}>
            {message}
          </div>
        )}

        <form onSubmit={submitUrl} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Target URL</label>
            <input 
              type="url" 
              className="input-field" 
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Crawl Depth</label>
            <input 
              type="number" 
              className="input-field" 
              min="0"
              max="5"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
              style={{ maxWidth: '120px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>How many levels of links to follow (0-5)</p>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
            {loading ? 'Adding to Queue...' : '⚡ Start Indexing'}
          </button>
        </form>
      </div>
    </div>
  );
}
