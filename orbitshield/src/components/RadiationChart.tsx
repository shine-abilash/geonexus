import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { generateLiveRadiationData } from '../data/mockData';

interface RadiationChartProps {
  height?: number;
  showZones?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#06b6d4' }}>
          {Number(payload[0]?.value).toFixed(3)} Gy
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
          Flux: {(Number(payload[0]?.value) * 13500).toFixed(0)} p/cm²/s
        </div>
      </div>
    );
  }
  return null;
};

const RadiationChart: React.FC<RadiationChartProps> = ({ height = 300, showZones = true }) => {
  const [data, setData] = useState(generateLiveRadiationData());

  // Simulate live updating
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const now = new Date();
        const newVal = Math.max(0.05, Number(last.radiation) + (Math.random() - 0.48) * 0.05);
        const newPoint = {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          radiation: parseFloat(newVal.toFixed(3)),
          flux: (newVal * 13500).toFixed(0),
        };
        return [...prev.slice(-23), newPoint];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="radGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
          tickFormatter={(v) => `${v.toFixed(1)}`}
          domain={[0, 1.5]}
        />
        <Tooltip content={<CustomTooltip />} />

        {/* Zone reference lines */}
        {showZones && (
          <>
            <ReferenceLine
              y={0.5}
              stroke="#f59e0b"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{ value: 'WARNING 0.5 Gy', fill: '#f59e0b', fontSize: 10, position: 'right' }}
            />
            <ReferenceLine
              y={1.0}
              stroke="#ef4444"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{ value: 'DANGER 1.0 Gy', fill: '#ef4444', fontSize: 10, position: 'right' }}
            />
          </>
        )}

        <Area
          type="monotone"
          dataKey="radiation"
          stroke="#06b6d4"
          strokeWidth={2.5}
          fill="url(#radGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#06b6d4', stroke: '#e2e8f0', strokeWidth: 2 }}
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RadiationChart;
