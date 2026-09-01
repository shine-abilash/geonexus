import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuToggle, menuOpen }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      background: 'rgba(3,6,15,0.6)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Left: hamburger + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuToggle}
          style={{
            display: 'none',
            background: 'rgba(0,200,255,0.1)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--ion)',
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div>
          <h1 style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: live + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '8px',
          padding: '5px 12px',
        }}>
          <span className="live-dot" />
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--safe)', letterSpacing: '0.08em' }}>LIVE</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Data stream active</div>
          </div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'right',
          display: 'none',
        }} className="header-time">
          <div style={{ color: 'var(--ion)' }}>
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .mobile-menu-btn { display: flex !important; } }
        @media (min-width: 769px) { .header-time { display: block !important; } }
      `}</style>
    </header>
  );
};
