import React from 'react';
import { getRiskColor } from '../data/mockData';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', animated = false }) => {
  const color = getRiskColor(status);
  const sizes = { sm: { font: '10px', pad: '3px 8px' }, md: { font: '12px', pad: '4px 12px' }, lg: { font: '14px', pad: '6px 16px' } };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: sizes[size].pad,
      borderRadius: '20px',
      background: `${color}18`,
      color, border: `1px solid ${color}30`,
      fontSize: sizes[size].font,
      fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        animation: animated ? 'live-pulse 2s ease-in-out infinite' : 'none',
      }} />
      {status}
    </span>
  );
};

export default StatusBadge;
