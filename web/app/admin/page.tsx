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

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Dashboard</h1>

      <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Index New URL</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Enter a website URL to scan and index its content to FocusEngine.
        </p>
        
        {message && <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}

        <form onSubmit={submitUrl} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Target URL</label>
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
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Crawl Depth</label>
            <input 
              type="number" 
              className="input-field" 
              min="0"
              max="5"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Adding to Queue...' : 'Start Indexing'}
          </button>
        </form>
      </div>
    </div>
  );
}
