"use client";

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    projectName: 'FocusEngine',
    companyLogo: '',
    pinnedWebsites: '',
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

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>Global Settings</h1>

      <form className="glass-panel" onSubmit={saveSettings} style={{ padding: '30px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {message && <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', borderRadius: '8px' }}>{message}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Project Name</label>
          <input 
            type="text" 
            className="input-field" 
            value={config.projectName}
            onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
            placeholder="FocusEngine"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Company Logo URL (Optional)</label>
          <input 
            type="url" 
            className="input-field" 
            value={config.companyLogo}
            onChange={(e) => setConfig({ ...config, companyLogo: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Pinned Websites (Comma separated URLs)</label>
          <textarea 
            className="input-field"
            rows={4}
            value={config.pinnedWebsites}
            onChange={(e) => setConfig({ ...config, pinnedWebsites: e.target.value })}
            placeholder="https://company.com, https://blog.example.com"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
