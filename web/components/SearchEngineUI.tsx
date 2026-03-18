"use client";

import { useState, useEffect, useRef } from 'react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '600', '800'] });

type Result = {
  id: string;
  title: string;
  url: string;
  description: string;
};

type PinnedSite = { label: string; url: string };

export default function SearchEngineUI({ projectName, companyLogo, pinnedWebsites }: { projectName: string, companyLogo: string, pinnedWebsites: PinnedSite[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.hits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (query) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        setHasSearched(true);
        fetchResults(query);
      }, 300);
    } else {
      setIsSearching(false);
      setHasSearched(false);
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-theme-light" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', paddingTop: isSearching ? '8vh' : '30vh' }}>
      <div className="moving-dots-bg"></div>
      
      {/* Brand Logo / Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px', transform: isSearching ? 'scale(0.7)' : 'scale(1)', transition: 'all 0.5s ease', position: 'relative', zIndex: 1 }}>
        {companyLogo ? (
          <img src={companyLogo} alt={projectName} style={{ height: '80px', objectFit: 'contain' }} />
        ) : (
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{projectName[0]}</span>
          </div>
        )}
        <h1 className={outfit.className} style={{ fontSize: isSearching ? '2.5rem' : '4.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-1.5px', transition: 'all 0.5s ease', textShadow: '0 2px 10px rgba(0,0,0,0.05)', margin: 0 }}>
          {projectName}
        </h1>
      </div>

      {/* Search Bar Container */}
      <div style={{ width: '100%', maxWidth: '750px', position: 'relative', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '8px 24px', borderRadius: '40px', boxShadow: isSearching ? '0 10px 40px rgba(0,0,0,0.4)' : '0 20px 50px rgba(0,0,0,0.6)', transition: 'all 0.3s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search the index..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px', fontSize: '1.25rem', color: 'var(--text-main)', outline: 'none' }}
          />
          {loading && <div style={{ width: '24px', height: '24px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {/* Results / Autocomplete */}
      {isSearching && (
        <div style={{ width: '100%', maxWidth: '750px', marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '20px', paddingRight: '20px', position: 'relative', zIndex: 1 }}>
          {results.length > 0 ? (() => {
            // Group results by hostname
            const groups = new Map<string, { root: Result | null; pages: Result[] }>();
            results.forEach(r => {
              let host = r.url;
              try { host = new URL(r.url).hostname; } catch { }
              if (!groups.has(host)) groups.set(host, { root: null, pages: [] });
              const g = groups.get(host)!;
              // Shortest URL per domain = the root page
              if (!g.root || r.url.length < g.root.url.length) {
                if (g.root) g.pages.push(g.root);
                g.root = r;
              } else {
                g.pages.push(r);
              }
            });

            return Array.from(groups.entries()).map(([host, g], gi) => {
              const root = g.root!;
              const siteLinks = g.pages.slice(0, 6); // max 6 sitelinks
              let favicon = '';
              try { favicon = `https://www.google.com/s2/favicons?domain=${host}&sz=32`; } catch { }

              return (
                <div key={gi} style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '18px', padding: '22px 26px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', animation: `fadeUp 0.4s ease forwards ${gi * 0.07}s`, opacity: 0 }}>
                  {/* Root domain header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {favicon && <img src={favicon} width={18} height={18} alt="" style={{ borderRadius: '4px', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{host}</span>
                  </div>
                  <a href={root.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h3 className={outfit.className} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a0dab', marginBottom: '4px', lineHeight: 1.3 }}>{root.title || host}</h3>
                  </a>
                  {root.description && (
                    <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: siteLinks.length > 0 ? '16px' : 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {root.description}
                    </p>
                  )}

                  {/* Sitelinks grid */}
                  {siteLinks.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px 24px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      {siteLinks.map((page) => {
                        let path = page.url;
                        try { const u = new URL(page.url); path = u.pathname + u.search; } catch { }
                        return (
                          <a key={page.id} href={page.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: '10px', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <div style={{ color: '#1a0dab', fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.title || path}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{path}</div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            });
          })() : hasSearched && !loading ? (
             <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No results found for "{query}"</div>
          ) : null}
        </div>
      )}

      {/* Pinned Websites - Only show when NOT searching */}
      {!isSearching && pinnedWebsites.length > 0 && (
        <div style={{ marginTop: '80px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', opacity: 1, animation: 'fadeUp 1s ease', position: 'relative', zIndex: 1 }}>
          {pinnedWebsites.map((pin, i) => {
            let hostname = pin.url;
            try { hostname = new URL(pin.url).hostname.replace('www.', ''); } catch { hostname = pin.url; }
            const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
            return (
              <a key={i} href={pin.url} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{ width: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={favicon} width={22} height={22} alt="" style={{ borderRadius: '4px' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <span style={{ fontSize: '0.78rem', textAlign: 'center', padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', color: '#374151', fontWeight: 500 }}>{pin.label || hostname}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} {projectName}. Powered by AntiGravity.
      </div>
    </div>
  );
}
