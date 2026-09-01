import React from 'react';

type Risk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'SAFE';

interface StatusBadgeProps {
  status: Risk | string;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
  LOW:      { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', border: 'rgba(34,197,94,0.35)',   shadow: 'var(--safe-glow)' },
  SAFE:     { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', border: 'rgba(34,197,94,0.35)',   shadow: 'var(--safe-glow)' },
  MODERATE: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.35)',  shadow: 'var(--warn-glow)' },
  HIGH:     { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444', border: 'rgba(239,68,68,0.35)',   shadow: 'var(--danger-glow)' },
  CRITICAL: { bg: 'rgba(239,68,68,0.2)',   text: '#ff4455', border: 'rgba(239,68,68,0.5)',    shadow: '0 0 20px rgba(239,68,68,0.5)' },
};

const sizeMap = {
  sm: { fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' },
  md: { fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px' },
  lg: { fontSize: '0.875rem', padding: '5px 14px', borderRadius: '8px' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', glow = false }) => {
  const c = colorMap[status] ?? colorMap.MODERATE;
  const s = sizeMap[size];
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        boxShadow: glow ? `0 0 12px ${c.shadow}` : 'none',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        letterSpacing: '0.1em',
        display: 'inline-block',
        ...s,
      }}
    >
      {status}
    </span>
  );
};

interface RiskIndicatorProps {
  dose: number;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ dose }) => {
  const percent = Math.min((dose / 2.0) * 100, 100);
  const color = dose < 0.3 ? '#22c55e' : dose < 0.8 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
        <span>0 Gy</span>
        <span style={{ color }}>{ dose.toFixed(2) } Gy</span>
        <span>2.0 Gy</span>
      </div>
      <div className="comp-bar-bg">
        <div
          className="comp-bar-fill"
          style={{ width: `${percent}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
};
