import React, { useState } from 'react';
import {
  LayoutDashboard, Zap, CalendarClock, Calendar, FlaskConical,
  MapPin, History, Info, ChevronRight, Shield, Radio, X, Menu,
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'live'
  | 'today'
  | 'future'
  | 'analysis'
  | 'location'
  | 'history'
  | 'system'
  | 'flow';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Mission Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'live', label: 'Live Radiation', icon: <Zap size={18} />, badge: 'LIVE' },
  { id: 'today', label: "Today's Prediction", icon: <CalendarClock size={18} /> },
  { id: 'future', label: 'Future Prediction', icon: <Calendar size={18} /> },
  { id: 'analysis', label: 'Radiation Analysis', icon: <FlaskConical size={18} /> },
  { id: 'location', label: 'Safe Location', icon: <MapPin size={18} /> },
  { id: 'history', label: 'Prediction History', icon: <History size={18} /> },
  { id: 'system', label: 'System Information', icon: <Info size={18} /> },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: PageId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-[100] p-2 rounded-lg md:hidden"
        style={{ background: 'rgba(6,13,31,0.9)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #0e7490, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6,182,212,0.4)',
            }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
                ORBITSHIELD
              </div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.08em', marginLeft: '46px' }}>
            SPACE RADIATION INTELLIGENCE
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map((item, i) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', animationDelay: `${i * 0.05}s` }}
              onClick={() => handleNav(item.id)}
            >
              <span style={{ opacity: activePage === item.id ? 1 : 0.7 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                  borderRadius: '4px', background: 'rgba(16,185,129,0.15)',
                  color: '#10b981', border: '1px solid rgba(16,185,129,0.3)',
                  letterSpacing: '0.05em',
                }}>
                  {item.badge}
                </span>
              )}
              {activePage === item.id && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
            </button>
          ))}

          {/* System Flow Link */}
          <div style={{ height: '1px', background: 'rgba(6,182,212,0.1)', margin: '12px 4px' }} />
          <button
            className={`sidebar-nav-item ${activePage === 'flow' ? 'active' : ''}`}
            style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
            onClick={() => handleNav('flow')}
          >
            <Radio size={18} style={{ opacity: 0.7 }} />
            <span style={{ flex: 1 }}>System Flow</span>
          </button>
        </div>

        {/* Bottom Status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(6,182,212,0.1)' }}>
          <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' }}>
            System Status
          </div>
          <StatusRow icon="●" color="#10b981" label="System Online" />
          <StatusRow icon="●" color="#10b981" label="Data Stream Active" animated />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0e7490, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: 'white',
            }}>MC</div>
            <div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>Mission Control</div>
              <div style={{ fontSize: '10px', color: '#475569' }}>Administrator</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const StatusRow: React.FC<{ icon: string; color: string; label: string; animated?: boolean }> = ({ icon, color, label, animated }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
    <span style={{
      fontSize: '8px', color,
      animation: animated ? 'live-pulse 1.5s ease-in-out infinite' : 'none',
    }}>{icon}</span>
    <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
  </div>
);

export default Sidebar;
