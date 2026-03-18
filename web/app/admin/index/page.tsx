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
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Indexed URLs</h1>
        <input
          className="input-field"
          style={{ width: '260px', padding: '8px 14px' }}
          placeholder="Search index…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div style={{ color: '#f87171', marginBottom: '16px' }}>{error}</div>}

      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px' }}>
          <span style={{ color: '#f87171', fontWeight: 600 }}>{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          <button onClick={deleteSelected} disabled={deleting} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {deleting ? 'Removing…' : '🗑 Remove Selected'}
          </button>
          <button onClick={() => setSelected(new Set())} style={{ padding: '6px 12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '4px 0', overflowX: 'auto' }}>
        {filtered.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--text-muted)' }}>{search ? 'No results match your search.' : 'No documents indexed yet.'}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: 'pointer', width: '15px', height: '15px' }} />
                </th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>URL</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Title</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Keywords</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <React.Fragment key={doc.id}>
                  <tr
                    style={{ borderTop: '1px solid var(--border-color)', cursor: 'pointer', background: selected.has(doc.id) ? 'rgba(239,68,68,0.05)' : expandedRow === doc.id ? 'rgba(255,255,255,0.025)' : 'transparent', transition: 'background 0.15s' }}
                    onClick={() => toggleRow(doc.id)}
                  >
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleOne(doc.id)} style={{ cursor: 'pointer', width: '15px', height: '15px' }} />
                    </td>
                    <td style={{ padding: '12px 8px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.url}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.88rem' }} onClick={e => e.stopPropagation()}>
                        {doc.url.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td style={{ padding: '12px 8px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }} title={doc.title}>{doc.title}</td>
                    <td style={{ padding: '12px 8px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.82rem', color: 'var(--text-muted)' }} title={doc.keywords}>{doc.keywords || '—'}</td>
                    <td style={{ padding: '12px 8px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => deleteOne(doc.id)} style={{ padding: '5px 12px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                  {expandedRow === doc.id && (
                    <tr style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.12)' }}>
                      <td colSpan={5} style={{ padding: '20px 24px' }}>
                        <div style={{ marginBottom: '10px' }}><strong>Description:</strong> <span style={{ color: 'var(--text-muted)' }}>{doc.description || 'None found.'}</span></div>
                        <div style={{ marginBottom: '8px' }}><strong>Content Preview:</strong></div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, background: 'rgba(0,0,0,0.18)', padding: '14px', borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {doc.textContent ? doc.textContent.substring(0, 1000) + '…' : 'No content extracted.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{documents.length} total document{documents.length !== 1 ? 's' : ''} in index</div>
    </div>
  );
}
