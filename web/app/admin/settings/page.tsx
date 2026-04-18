"use client";

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    projectName: 'FocusEngine',
    companyLogo: '',
    pinnedWebsites: '',
    crawlerSelection: 'meilisearch',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.config && Object.keys(data.config).length > 0) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      });
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Error saving settings.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.includes('success');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Global Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure your FocusEngine instance</p>
      </div>

      <form className="glass-panel" onSubmit={saveSettings} style={{ padding: '32px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {message && (
          <div style={{ padding: '12px 16px', background: isSuccess ? 'var(--success-surface)' : 'var(--error-surface)', color: isSuccess ? 'var(--success)' : 'var(--error)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', border: `1px solid ${isSuccess ? 'var(--success-border)' : 'var(--error-border)'}` }}>
            {isSuccess ? '✓ ' : ''}{message}
          </div>
        )}

        {/* Branding Section */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Branding</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Project Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={config.projectName}
                onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                placeholder="FocusEngine"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Company Logo URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input 
                type="url" 
                className="input-field" 
                value={config.companyLogo}
                onChange={(e) => setConfig({ ...config, companyLogo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Content</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Pinned Websites <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span></label>
              <textarea 
                className="input-field"
                rows={4}
                value={config.pinnedWebsites}
                onChange={(e) => setConfig({ ...config, pinnedWebsites: e.target.value })}
                placeholder="https://company.com, https://blog.example.com"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Engine Section */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Engine</div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Active Crawler</label>
            <select
              className="input-field"
              value={config.crawlerSelection}
              onChange={(e) => setConfig({ ...config, crawlerSelection: e.target.value })}
            >
              <option value="meilisearch">FocusEngine Default Crawler (Meilisearch)</option>
              <option value="postgres">FocusEngine New Crawler (PostgreSQL)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '4px' }}>
          {loading ? 'Saving...' : '⚡ Save Settings'}
        </button>
      </form>
    </div>
  );
}
