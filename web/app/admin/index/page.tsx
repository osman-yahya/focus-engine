"use client";

import React, { useEffect, useState } from 'react';

type Document = {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  textContent: string;
};

export default function SearchIndexPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const toggleRow = (id: string) => setExpandedRow(expandedRow === id ? null : id);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/index');
      const data = await res.json();
      if (data.success) setDocuments(data.documents);
      else setError(data.error);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const filtered = documents.filter(d =>
    d.url.toLowerCase().includes(search.toLowerCase()) ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.keywords || '').toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filtered.length > 0 && filtered.every(d => selected.has(d.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach(d => next.delete(d.id));
    else filtered.forEach(d => next.add(d.id));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const deleteSelected = async () => {
    if (!confirm(`Remove ${selected.size} document(s) from the search index?`)) return;
    setDeleting(true);
    await fetch('/api/admin/index/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setSelected(new Set());
    await fetchDocuments();
    setDeleting(false);
  };

  const deleteOne = async (id: string) => {
    if (!confirm('Remove this document from the search index?')) return;
    await fetch('/api/admin/index', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchDocuments();
  };

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading index…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Indexed URLs</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{documents.length} document{documents.length !== 1 ? 's' : ''} in the search index</p>
        </div>
        <input
          className="input-field"
          style={{ width: '260px', padding: '10px 16px' }}
          placeholder="🔍 Filter documents…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'var(--error)', marginBottom: '16px', padding: '12px 16px', background: 'var(--error-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--error-border)', fontSize: '0.9rem' }}>{error}</div>}

      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px 18px', background: 'var(--error-surface)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--error)', fontWeight: 600, fontSize: '0.88rem' }}>{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          <button onClick={deleteSelected} disabled={deleting} style={{ padding: '6px 16px', background: 'rgba(248,113,113,0.15)', color: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: '0.82rem' }}>
            {deleting ? 'Removing…' : '🗑 Remove Selected'}
          </button>
          <button onClick={() => setSelected(new Set())} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem' }}>
            Clear
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2px 0', overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>{search ? 'No results match your search.' : 'No documents indexed yet.'}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '16px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--accent)' }} />
                </th>
                <th>URL</th>
                <th>Title</th>
                <th>Keywords</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <React.Fragment key={doc.id}>
                  <tr
                    style={{ cursor: 'pointer', background: selected.has(doc.id) ? 'var(--error-surface)' : expandedRow === doc.id ? 'var(--bg-hover)' : 'transparent' }}
                    onClick={() => toggleRow(doc.id)}
                  >
                    <td style={{ paddingLeft: '16px' }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleOne(doc.id)} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--accent)' }} />
                    </td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.url}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.85rem' }} onClick={e => e.stopPropagation()}>
                        {doc.url.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.88rem' }} title={doc.title}>{doc.title}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem', color: 'var(--text-muted)' }} title={doc.keywords}>{doc.keywords || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => deleteOne(doc.id)} style={{ padding: '5px 12px', background: 'var(--error-surface)', color: 'var(--error)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit' }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                  {expandedRow === doc.id && (
                    <tr style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td colSpan={5} style={{ padding: '20px 24px', background: 'rgba(124, 58, 237, 0.02)' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</span>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>{doc.description || 'None found.'}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content Preview</span>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '6px', border: '1px solid var(--border-subtle)' }}>
                            {doc.textContent ? doc.textContent.substring(0, 1000) + '…' : 'No content extracted.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
