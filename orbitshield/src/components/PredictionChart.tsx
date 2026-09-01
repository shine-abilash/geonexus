import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';

interface PredictionChartProps {
  data: Array<{ hour: string; predicted: number; lower?: number; upper?: number }>;
  height?: number;
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const predicted = payload.find((p: any) => p.dataKey === 'predicted');
    return (
      <div className="custom-tooltip">
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{label}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#818cf8' }}>
          {Number(predicted?.value).toFixed(3)} Gy
        </div>
        {payload.find((p: any) => p.dataKey === 'upper') && (
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Range: {Number(payload.find((p: any) => p.dataKey === 'lower')?.value).toFixed(3)}–
            {Number(payload.find((p: any) => p.dataKey === 'upper')?.value).toFixed(3)} Gy
          </div>
        )}
      </div>
    );
  }
  return null;
};

const PredictionChart: React.FC<PredictionChartProps> = ({ data, height = 280, title }) => {
  return (
    <div>
      {title && (
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', textAlign: 'center' }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="hour"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
            interval={Math.floor(data.length / 6)}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
            tickFormatter={(v) => `${v.toFixed(1)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0.5} stroke="#f59e0b" strokeDasharray="5 4" strokeWidth={1}
            label={{ value: 'WARNING', fill: '#f59e0b', fontSize: 9, position: 'right' }} />
          <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="5 4" strokeWidth={1}
            label={{ value: 'DANGER', fill: '#ef4444', fontSize: 9, position: 'right' }} />

          {data[0]?.upper !== undefined && (
            <Area
              type="monotone" dataKey="upper"
              stroke="none" fill="url(#confGrad)"
              legendType="none"
            />
          )}
          {data[0]?.lower !== undefined && (
            <Area
              type="monotone" dataKey="lower"
              stroke="none" fill="url(#confGrad)"
              legendType="none"
            />
          )}
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#818cf8"
            strokeWidth={2.5}
            fill="url(#predGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#818cf8', stroke: '#e2e8f0', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
