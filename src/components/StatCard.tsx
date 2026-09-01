import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  status?: string;
  statusColor?: 'safe' | 'warn' | 'danger' | 'ion';
  icon?: React.ReactNode;
  glowing?: boolean;
  description?: string;
}

const statusColorMap = {
  safe:   { color: 'var(--safe)',   glow: 'var(--safe-glow)',   bg: 'rgba(34,197,94,0.08)' },
  warn:   { color: 'var(--warn)',   glow: 'var(--warn-glow)',   bg: 'rgba(245,158,11,0.08)' },
  danger: { color: 'var(--danger)', glow: 'var(--danger-glow)', bg: 'rgba(239,68,68,0.08)' },
  ion:    { color: 'var(--ion)',    glow: 'var(--ion-glow)',    bg: 'rgba(0,200,255,0.08)' },
};

export const StatCard: React.FC<StatCardProps> = ({
  label, value, subValue, status, statusColor = 'ion', icon, glowing, description,
}) => {
  const sc = statusColorMap[statusColor];
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = glowing ? `0 0 30px ${sc.glow}` : '0 8px 32px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* background shimmer */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        background: `radial-gradient(ellipse at top right, ${sc.color}, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{
          fontSize: '0.65rem', fontFamily: "'JetBrains Mono',monospace",
          letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase',
        }}>
          {label}
        </div>
        {icon && (
          <div style={{
            width: '32px', height: '32px',
            background: sc.bg,
            border: `1px solid ${sc.color}30`,
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sc.color, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>

      <div className="stat-number" style={{ color: glowing ? sc.color : 'var(--ion)', marginBottom: '0.25rem' }}>
        {value}
      </div>

      {subValue && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: "'JetBrains Mono',monospace" }}>
          {subValue}
        </div>
      )}

      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          <span style={{
            display: 'inline-block',
            width: '6px', height: '6px', borderRadius: '50%',
            background: sc.color,
            boxShadow: `0 0 6px ${sc.color}`,
            animation: 'pulse-safe 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '0.72rem', color: sc.color, fontWeight: 600, letterSpacing: '0.06em' }}>
            {status}
          </span>
        </div>
      )}

      {description && (
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
          {description}
        </div>
      )}
    </div>
  );
};
