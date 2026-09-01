import React from 'react';
import { Activity, Radio, TrendingUp, Shield, Brain, MapPin, Clock, BarChart2, Info, History } from 'lucide-react';

export type PageId =
  | 'overview'
  | 'live-radiation'
  | 'today-prediction'
  | 'future-prediction'
  | 'radiation-analysis'
  | 'safe-location'
  | 'history'
  | 'system-info';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview',           label: 'Mission Overview',    icon: <Activity size={17} /> },
  { id: 'live-radiation',     label: 'Live Radiation',      icon: <Radio size={17} /> },
  { id: 'today-prediction',   label: "Today's Prediction",  icon: <Clock size={17} /> },
  { id: 'future-prediction',  label: 'Future Prediction',   icon: <TrendingUp size={17} /> },
  { id: 'radiation-analysis', label: 'Radiation Analysis',  icon: <BarChart2 size={17} /> },
  { id: 'safe-location',      label: 'Safe Location',       icon: <MapPin size={17} /> },
  { id: 'history',            label: 'Prediction History',  icon: <History size={17} /> },
  { id: 'system-info',        label: 'System Information',  icon: <Info size={17} /> },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onClose }) => {
  const handleNav = (id: PageId) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className="sidebar"
        style={{
          width: '240px',
          minWidth: '240px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.25rem 1.25rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #00c8ff, #0066ff)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px var(--ion-glow)',
              flexShrink: 0,
            }}>
              <Shield size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--ion)', lineHeight: 1 }}>
                ORBITSHIELD
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '4px', paddingLeft: '40px' }}>
            Space Radiation Intelligence
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* System status */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            System Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {['System Online', 'Data Stream Connected'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--safe)' }}>
                <span className="live-dot" style={{ width: '6px', height: '6px' }} />
                {s}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'rgba(0,200,255,0.1)',
              border: '1px solid var(--border-bright)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: 'var(--ion)',
            }}>
              <Brain size={13} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mission Control</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Operator</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
