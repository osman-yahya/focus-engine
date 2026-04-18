"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type Result = {
  id: string;
  title: string;
  url: string;
  description: string;
};

type PinnedSite = { label: string; url: string };

/* ═══════════════════════════════════════════════════════════════════════
   Animated Wireframe Globe — rotates, reacts to mouse + typing pulse
   ═══════════════════════════════════════════════════════════════════════ */
function Globe({ pulse }: { pulse: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouse);

    // Generate sphere points (latitude/longitude grid)
    const latLines = 18;
    const lonLines = 28;
    const points3D: [number, number, number][] = [];
    // Latitude rings
    for (let lat = 0; lat <= latLines; lat++) {
      const theta = (lat / latLines) * Math.PI;
      const ptsOnRing = lonLines;
      for (let lon = 0; lon < ptsOnRing; lon++) {
        const phi = (lon / ptsOnRing) * 2 * Math.PI;
        points3D.push([
          Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi),
        ]);
      }
    }

    // Generate grid edges — connect adjacent points on lat rings and between rings
    const edges: [number, number][] = [];
    for (let lat = 0; lat <= latLines; lat++) {
      for (let lon = 0; lon < lonLines; lon++) {
        const idx = lat * lonLines + lon;
        const nextLon = lat * lonLines + ((lon + 1) % lonLines);
        edges.push([idx, nextLon]); // horizontal ring
        if (lat < latLines) {
          const below = (lat + 1) * lonLines + lon;
          edges.push([idx, below]); // vertical meridian
        }
      }
    }

    let time = 0;

    const draw = () => {
      time += 0.004;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;

      // Mouse influence on rotation
      const mx = (mouse.current.x - 0.5) * 0.6;
      const my = (mouse.current.y - 0.5) * 0.4;

      const rotY = time + mx * 2;
      const rotX = 0.3 + my * 1.5;

      // Pulse effect — globe "breathes" when user types
      const pulseScale = 1 + pulse * 0.04;

      // Rotation matrices
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const project = (p: [number, number, number]): [number, number, number] => {
        // Rotate around Y
        let x = p[0] * cosY + p[2] * sinY;
        let z = -p[0] * sinY + p[2] * cosY;
        let y = p[1];
        // Rotate around X
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        return [
          cx + x * radius * pulseScale,
          cy + y2 * radius * pulseScale,
          z2,
        ];
      };

      // Project all points
      const projected = points3D.map(p => project(p));

      // Draw edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        // Only draw if at least one point faces us
        const avgZ = (pa[2] + pb[2]) / 2;
        const alpha = Math.max(0, Math.min(0.22, (avgZ + 1) * 0.14));
        if (alpha < 0.01) continue;

        ctx.strokeStyle = `rgba(70, 150, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }

      // Draw bright dots on vertices facing the viewer
      for (const p of projected) {
        const alpha = Math.max(0, (p[2] + 1) * 0.35);
        if (alpha < 0.05) continue;
        const r = 1 + p[2] * 0.6;

        // Glow
        const grad = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4);
        grad.addColorStop(0, `rgba(100, 180, 255, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(60, 140, 255, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle equator glow ring
      ctx.beginPath();
      ctx.ellipse(cx, cy + Math.sin(rotX) * radius * 0.05 * pulseScale, radius * pulseScale, radius * 0.15 * pulseScale * Math.abs(Math.cos(rotX)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(60, 140, 255, 0.06)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [pulse]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Search UI
   ═══════════════════════════════════════════════════════════════════════ */
export default function SearchEngineUI({ projectName, companyLogo, pinnedWebsites }: { projectName: string, companyLogo: string, pinnedWebsites: PinnedSite[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typePulse, setTypePulse] = useState(0);
  
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const pulseTimeout = useRef<NodeJS.Timeout | null>(null);

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
      // Trigger typing pulse for globe
      setTypePulse(p => Math.min(p + 1, 5));
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      pulseTimeout.current = setTimeout(() => setTypePulse(0), 800);

      searchTimeout.current = setTimeout(() => {
        setHasSearched(true);
        fetchResults(query);
      }, 300);
    } else {
      setIsSearching(false);
      setHasSearched(false);
      setResults([]);
      setTypePulse(0);
    }
  }, [query]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#050810', color: '#d0dae8', position: 'relative', overflow: 'hidden' }}>

      <Globe pulse={typePulse} />

      {/* ── Top Navigation Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        {/* Logo mark — small */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: isSearching ? 1 : 0.5, transition: 'opacity 0.4s' }}>
          {companyLogo ? (
            <img src={companyLogo} alt={projectName} style={{ height: '28px', objectFit: 'contain' }} />
          ) : (
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #0d1b3a, #142a50)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(70, 150, 255, 0.15)', boxShadow: '0 0 20px rgba(60, 140, 255, 0.1)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7cb8ff' }}>{projectName[0]}</span>
            </div>
          )}
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#5a7a9a', letterSpacing: '-0.3px' }}>{projectName}</span>
        </div>

        {/* Admin button */}
        <a href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', background: 'rgba(12, 20, 40, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(70, 150, 255, 0.1)', color: '#6a98c0', fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.25s', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.3)'; e.currentTarget.style.color = '#a0c8f0'; e.currentTarget.style.boxShadow = '0 0 20px rgba(60, 140, 255, 0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.1)'; e.currentTarget.style.color = '#6a98c0'; e.currentTarget.style.boxShadow = 'none'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Admin Panel
        </a>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', paddingTop: isSearching ? '2vh' : '18vh', position: 'relative', zIndex: 2 }}>

        {/* Brand Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '36px', transform: isSearching ? 'scale(0.55) translateY(-10px)' : 'scale(1)', opacity: isSearching ? 0.75 : 1, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transformOrigin: 'center top' }}>
          {!isSearching && companyLogo && (
            <img src={companyLogo} alt={projectName} style={{ height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 0 30px rgba(60, 140, 255, 0.3))', animation: 'iconFloat 5s ease-in-out infinite' }} />
          )}
          {!isSearching && !companyLogo && (
            <div style={{ width: '88px', height: '88px', background: 'linear-gradient(135deg, #0a1525, #132240)', borderRadius: '26px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 60px rgba(50, 120, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.04)', border: '1px solid rgba(70, 150, 255, 0.12)', animation: 'iconFloat 5s ease-in-out infinite' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 700, color: '#7cb8ff', textShadow: '0 0 30px rgba(80, 160, 255, 0.5)' }}>{projectName[0]}</span>
            </div>
          )}
          <h1 style={{ fontSize: isSearching ? '1.6rem' : '4.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ffffff, #7cb8ff, #4080cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2.5px', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', margin: 0, lineHeight: 1.05, filter: 'drop-shadow(0 2px 15px rgba(60, 140, 255, 0.1))' }}>
            {projectName}
          </h1>
          {!isSearching && (
            <p style={{ color: '#3a5575', fontSize: '1rem', margin: 0, animation: 'fadeIn 1.2s ease', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500 }}>
              Private · Self-Hosted · Secure
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ width: '100%', maxWidth: '680px', position: 'relative', paddingLeft: '20px', paddingRight: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '5px 22px', borderRadius: '16px', background: 'rgba(8, 14, 28, 0.9)', backdropFilter: 'blur(30px)', border: `1px solid ${isSearching ? 'rgba(70, 150, 255, 0.2)' : 'rgba(70, 150, 255, 0.06)'}`, boxShadow: isSearching ? '0 0 50px rgba(50, 120, 255, 0.08), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)' : '0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3a6a9a', flexShrink: 0, transition: 'color 0.3s', ...(isSearching ? { color: '#5a9ad0' } : {}) }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search your index..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 14px', fontSize: '1.05rem', color: '#d0dae8', outline: 'none', fontFamily: 'inherit', fontWeight: 500, letterSpacing: '-0.2px' }}
            />
            {loading && <div style={{ width: '20px', height: '20px', border: '2px solid #3a6a9a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes iconFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          input::placeholder { color: #2a4560 !important; }
        `}} />

        {/* Results */}
        {isSearching && (
          <div style={{ width: '100%', maxWidth: '680px', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '40px' }}>
            {results.length > 0 ? (() => {
              const groups = new Map<string, { root: Result | null; pages: Result[] }>();
              results.forEach(r => {
                let host = r.url;
                try { host = new URL(r.url).hostname; } catch { }
                if (!groups.has(host)) groups.set(host, { root: null, pages: [] });
                const g = groups.get(host)!;
                if (!g.root || r.url.length < g.root.url.length) {
                  if (g.root) g.pages.push(g.root);
                  g.root = r;
                } else {
                  g.pages.push(r);
                }
              });

              return Array.from(groups.entries()).map(([host, g], gi) => {
                const root = g.root!;
                const siteLinks = g.pages.slice(0, 6);
                let favicon = '';
                try { favicon = `https://www.google.com/s2/favicons?domain=${host}&sz=32`; } catch { }

                return (
                  <div key={gi} style={{ background: 'rgba(8, 14, 30, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(70, 150, 255, 0.06)', borderRadius: '14px', padding: '18px 22px', boxShadow: '0 2px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)', animation: `fadeUp 0.3s ease forwards ${gi * 0.05}s`, opacity: 0, transition: 'border-color 0.25s, box-shadow 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.18)'; e.currentTarget.style.boxShadow = '0 4px 30px rgba(50, 120, 255, 0.06), 0 2px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.06)'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)'; }}>
                    {/* Host */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {favicon && <img src={favicon} width={14} height={14} alt="" style={{ borderRadius: '3px', flexShrink: 0, opacity: 0.7 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      <span style={{ fontSize: '0.72rem', color: '#3a5570', fontWeight: 500, letterSpacing: '0.3px' }}>{host}</span>
                    </div>
                    {/* Title */}
                    <a href={root.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: '#7cb8ff', marginBottom: '5px', lineHeight: 1.4, transition: 'color 0.15s', letterSpacing: '-0.3px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#a8d4ff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#7cb8ff')}>{root.title || host}</h3>
                    </a>
                    {root.description && (
                      <p style={{ color: '#5a7a95', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: siteLinks.length > 0 ? '12px' : 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {root.description}
                      </p>
                    )}
                    {/* Sitelinks */}
                    {siteLinks.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2px 16px', paddingTop: '10px', borderTop: '1px solid rgba(70, 150, 255, 0.05)' }}>
                        {siteLinks.map((page) => {
                          let path = page.url;
                          try { const u = new URL(page.url); path = u.pathname + u.search; } catch { }
                          return (
                            <a key={page.id} href={page.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', padding: '7px 10px', borderRadius: '8px', transition: 'background 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(70, 150, 255, 0.05)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <div style={{ color: '#5a9ad0', fontWeight: 600, fontSize: '0.8rem', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.title || path}</div>
                              <div style={{ color: '#2a4560', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{path}</div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              });
            })() : hasSearched && !loading ? (
               <div style={{ textAlign: 'center', color: '#3a5575', marginTop: '60px', fontSize: '0.9rem' }}>
                 <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.3 }}>🌐</div>
                 No results found for &ldquo;{query}&rdquo;
               </div>
            ) : null}
          </div>
        )}

        {/* Pinned Websites */}
        {!isSearching && pinnedWebsites.length > 0 && (
          <div style={{ marginTop: '60px', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.8s ease', padding: '0 20px' }}>
            {pinnedWebsites.map((pin, i) => {
              let hostname = pin.url;
              try { hostname = new URL(pin.url).hostname.replace('www.', ''); } catch { hostname = pin.url; }
              const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
              return (
                <a key={i} href={pin.url} target="_blank" rel="noopener noreferrer" style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', color: '#8aa0b8', background: 'rgba(8, 14, 30, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(70, 150, 255, 0.06)', borderRadius: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.04)'; e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(50, 120, 255, 0.08)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = 'rgba(70, 150, 255, 0.06)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)'; }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(70, 150, 255, 0.05)', border: '1px solid rgba(70, 150, 255, 0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={favicon} width={18} height={18} alt="" style={{ borderRadius: '3px', opacity: 0.8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', textAlign: 'center', padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', color: '#4a6a88', fontWeight: 500 }}>{pin.label || hostname}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 28px', color: '#1a3050', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <span style={{ color: '#3a6a9a', opacity: 0.5 }}>⚡</span> &copy; {new Date().getFullYear()} {projectName}
      </div>
    </div>
  );
}
