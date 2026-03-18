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

const statusStyle = (status: string) => ({
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: '0.78rem',
  fontWeight: 600,
  background: status === 'QUEUED' ? 'rgba(148,163,184,0.15)' : status === 'PROCESSING' ? 'rgba(59,130,246,0.15)' : status === 'ERROR' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
  color: status === 'QUEUED' ? '#94a3b8' : status === 'PROCESSING' ? '#60a5fa' : status === 'ERROR' ? '#f87171' : '#4ade80',
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Crawler Queue</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              background: filter === s ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
              color: filter === s ? '#000' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px' }}>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          <button onClick={deleteSelected} disabled={deleting} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {deleting ? 'Deleting...' : '🗑 Delete Selected'}
          </button>
          <button onClick={() => setSelected(new Set())} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '4px 0', overflowX: 'auto' }}>
        {loading && jobs.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading queue...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>No jobs match the filter.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '12px 20px', width: '40px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                </th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>URL</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Depth</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Date</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} style={{ borderTop: '1px solid var(--border-color)', background: selected.has(job.id) ? 'rgba(239,68,68,0.05)' : 'transparent', transition: 'background 0.15s', cursor: 'pointer' }}
                  onClick={() => toggleOne(job.id)}>
                  <td style={{ padding: '12px 20px' }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(job.id)} onChange={() => toggleOne(job.id)} style={{ cursor: 'pointer', width: '16px', height: '16px' }} />
                  </td>
                  <td style={{ padding: '12px 8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={job.url}>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{job.url}</a>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{job.depth}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div>
                      <span style={statusStyle(job.status)}>{job.status}</span>
                      {job.errorLog && <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '4px' }}>{job.errorLog}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(job.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 8px' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => deleteOne(job.id)} style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Auto-refreshes every 5 seconds · {jobs.length} total jobs</div>
    </div>
  );
}
