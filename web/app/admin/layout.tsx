import Link from 'next/link';
import '@/app/globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '250px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '20px' }}>FocusEngine<br/><span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Admin Panel</span></h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Dashboard
          </Link>
          <Link href="/admin/users" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Admin Users
          </Link>
          <Link href="/admin/queue" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Crawler Queue
          </Link>
          <Link href="/admin/index" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Indexed URLs
          </Link>
          <Link href="/admin/pinned" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Pinned Sites
          </Link>
          <Link href="/admin/settings" style={{ color: 'var(--text-main)', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
            Global Settings
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <Link href="/" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>↗ View Search Engine</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
