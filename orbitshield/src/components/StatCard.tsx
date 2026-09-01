import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  status?: string;
  statusColor?: string;
  icon?: React.ReactNode;
  glowColor?: string;
  delay?: number;
  unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, subValue, status, statusColor = '#10b981',
  icon, glowColor = '#06b6d4', delay = 0, unit,
}) => {
  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
          {title}
        </div>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: `${glowColor}18`,
            border: `1px solid ${glowColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: glowColor,
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '32px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{unit}</span>
        )}
      </div>

      {subValue && (
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>{subValue}</div>
      )}

      {status && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '20px',
          background: `${statusColor}18`, color: statusColor,
          border: `1px solid ${statusColor}30`,
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, animation: 'live-pulse 2s ease-in-out infinite' }} />
          {status}
        </div>
      )}
    </div>
  );
};

export default StatCard;
