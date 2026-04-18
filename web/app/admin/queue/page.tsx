"use client";

import { useEffect, useState } from 'react';

type Job = {
  id: string;
  url: string;
  depth: number;
  status: string;
  errorLog: string | null;
  createdAt: string;
};

const statusStyle = (status: string): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.03em',
  background: status === 'QUEUED' ? 'rgba(148,163,184,0.1)' : status === 'PROCESSING' ? 'rgba(96,165,250,0.12)' : status === 'ERROR' ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
  color: status === 'QUEUED' ? '#94a3b8' : status === 'PROCESSING' ? '#60a5fa' : status === 'ERROR' ? '#f87171' : '#34d399',
  border: `1px solid ${status === 'QUEUED' ? 'rgba(148,163,184,0.15)' : status === 'PROCESSING' ? 'rgba(96,165,250,0.2)' : status === 'ERROR' ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`,
});

export default function QueuePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/crawler/queue');
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);
  const allSelected = filteredJobs.length > 0 && filteredJobs.every(j => selected.has(j.id));

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selected);
      filteredJobs.forEach(j => next.delete(j.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filteredJobs.forEach(j => next.add(j.id));
      setSelected(next);
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selected.size} job(s)?`)) return;
    setDeleting(true);
    await fetch('/api/admin/crawler/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setSelected(new Set());
    await fetchQueue();
    setDeleting(false);
  };

  const deleteOne = async (id: string) => {
    await fetch(`/api/admin/crawler/queue?id=${id}`, { method: 'DELETE' });
    fetchQueue();
  };

  const STATUSES = ['ALL', 'QUEUED', 'PROCESSING', 'ACCOMPLISHED', 'ERROR'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Crawler Queue</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monitor and manage crawl jobs in real-time</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: filter === s ? 'linear-gradient(135deg, var(--accent), #6d28d9)' : 'rgba(124, 58, 237, 0.06)',
              color: filter === s ? 'white' : 'var(--text-muted)',
              boxShadow: filter === s ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px 18px', background: 'var(--error-surface)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--error)', fontWeight: 600, fontSize: '0.88rem' }}>{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          <button onClick={deleteSelected} disabled={deleting} style={{ padding: '6px 16px', background: 'rgba(248,113,113,0.15)', color: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '0.82rem' }}>
            {deleting ? 'Deleting...' : '🗑 Delete Selected'}
          </button>
          <button onClick={() => setSelected(new Set())} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem' }}>
            Clear
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2px 0', overflowX: 'auto' }}>
        {loading && jobs.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading queue...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>No jobs match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '20px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
                </th>
                <th>URL</th>
                <th>Depth</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} style={{ background: selected.has(job.id) ? 'var(--error-surface)' : 'transparent', cursor: 'pointer' }}
                  onClick={() => toggleOne(job.id)}>
                  <td style={{ paddingLeft: '20px' }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(job.id)} onChange={() => toggleOne(job.id)} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent)' }} />
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.url}>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.88rem' }}>{job.url}</a>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{job.depth}</td>
                  <td>
                    <div>
                      <span style={statusStyle(job.status)}>{job.status}</span>
                      {job.errorLog && <div style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '6px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.errorLog}</div>}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(job.createdAt).toLocaleString()}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => deleteOne(job.id)} style={{ padding: '5px 12px', background: 'var(--error-surface)', color: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
        Auto-refreshes every 5s · {jobs.length} total jobs
      </div>
    </div>
  );
}
