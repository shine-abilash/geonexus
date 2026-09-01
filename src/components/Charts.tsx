import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Area, AreaChart, Legend,
} from 'recharts';
import type { RadiationPoint, PredictionPoint } from '../data/mockData';

// ─── Custom Tooltip ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-bright" style={{ padding: '10px 14px', fontSize: '0.78rem' }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: p.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
            {typeof p.value === 'number' ? p.value.toFixed(3) : p.value} Gy
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── RadiationChart (live data) ─────────────────────────────────────────────
interface RadiationChartProps {
  data: RadiationPoint[];
}

export const RadiationChart: React.FC<RadiationChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 10 }}>
        <defs>
          <linearGradient id="radGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c8ff" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#00c8ff" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.07)" />
        <XAxis
          dataKey="time"
          stroke="var(--text-muted)"
          tick={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fill: '#3f5f80' }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fill: '#3f5f80' }}
          tickFormatter={v => `${v}Gy`}
          domain={[0, 0.8]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Zones */}
        <ReferenceLine y={0.3} stroke="rgba(245,158,11,0.4)" strokeDasharray="6 3" label={{ value: 'WARN', fill: '#f59e0b', fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }} />
        <ReferenceLine y={0.6} stroke="rgba(239,68,68,0.4)" strokeDasharray="6 3" label={{ value: 'DANGER', fill: '#ef4444', fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }} />

        <Area
          type="monotone"
          dataKey="radiation"
          stroke="#00c8ff"
          strokeWidth={2}
          fill="url(#radGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#00c8ff', stroke: '#fff', strokeWidth: 2 }}
          name="Radiation"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ─── PredictionChart ────────────────────────────────────────────────────────
interface PredictionChartProps {
  data: PredictionPoint[];
  showConfidence?: boolean;
  height?: number;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({
  data, showConfidence = true, height = 280,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 10 }}>
        <defs>
          <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.06)" />
        <XAxis
          dataKey="hour"
          stroke="var(--text-muted)"
          tick={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", fill: '#3f5f80' }}
          interval={Math.floor(data.length / 8)}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fill: '#3f5f80' }}
          tickFormatter={v => `${v}Gy`}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-secondary)' }}
        />

        <ReferenceLine y={0.3} stroke="rgba(245,158,11,0.35)" strokeDasharray="5 4" label={{ value: 'WARN 0.3', fill: '#f59e0b', fontSize: 9 }} />
        <ReferenceLine y={0.8} stroke="rgba(239,68,68,0.35)" strokeDasharray="5 4" label={{ value: 'DANGER 0.8', fill: '#ef4444', fontSize: 9 }} />

        {showConfidence && (
          <>
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confGrad)"
              name="Upper bound"
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="rgba(56,189,248,0.05)"
              name="Lower bound"
              legendType="none"
            />
          </>
        )}
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="#38bdf8"
          strokeWidth={2.5}
          fill="url(#predGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
          name="Predicted"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
