"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/app/globals.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/users', label: 'Admin Users', icon: '⊡' },
  { href: '/admin/queue', label: 'Crawler Queue', icon: '⊟' },
  { href: '/admin/index', label: 'Indexed URLs', icon: '⊠' },
  { href: '/admin/pinned', label: 'Pinned Sites', icon: '⊛' },
  { href: '/admin/settings', label: 'Settings', icon: '⊙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      <div className="mesh-bg" />

      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'linear-gradient(180deg, rgba(15, 20, 37, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--panel-border)', padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        
        {/* Brand */}
        <div style={{ padding: '0 8px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'white', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', flexShrink: 0 }}>F</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: 1.2 }}>FocusEngine</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Admin Panel</div>
            </div>
          </div>
        </div>
        
        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--accent-surface)' : 'transparent',
                border: isActive ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '1rem', opacity: isActive ? 1 : 0.5 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom link */}
        <div style={{ marginTop: 'auto', padding: '0 8px' }}>
          <Link href="/" target="_blank" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
            ↗ View Search Engine
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
