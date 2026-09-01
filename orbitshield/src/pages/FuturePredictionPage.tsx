import React, { useState } from 'react';
import { Brain, ChevronRight } from 'lucide-react';
import PredictionChart from '../components/PredictionChart';
import StatusBadge from '../components/StatusBadge';
import { futurePrediction, getRiskColor } from '../data/mockData';

const FuturePredictionPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const p = futurePrediction;
  const day = p.days[selectedDay];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #22d3ee, #06b6d4)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>FUTURE RADIATION PREDICTION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>LSTM Model 2 — Next 2 Days</p>
          </div>
        </div>
      </div>

      {/* Model card */}
      <div className="animate-fade-in-up" style={{
        padding: '20px 24px', borderRadius: '14px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(6,182,212,0.05))',
        border: '1px solid rgba(34,211,238,0.25)',
        display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center',
        animationDelay: '0.1s', opacity: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={28} color="#22d3ee" />
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#22d3ee' }}>{p.modelName}</div>
          </div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Output</div>
          <div style={{ fontSize: '14px', color: '#22d3ee' }}>Next {p.outputDays} days (48 hours)</div>
        </div>
      </div>

      {/* Day selector */}
      <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', marginBottom: '24px', animationDelay: '0.2s', opacity: 0 }}>
        {p.days.map((d, i) => {
          const riskColor = getRiskColor(d.risk);
          const isActive = selectedDay === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                flex: 1, padding: '20px', borderRadius: '14px', cursor: 'pointer', border: 'none',
                background: isActive
                  ? `linear-gradient(135deg, rgba(34,211,238,0.15), rgba(6,182,212,0.08))`
                  : 'var(--bg-card)',
                border: `2px solid ${isActive ? '#22d3ee' : 'rgba(6,182,212,0.15)'}`,
                transition: 'all 0.3s ease',
                textAlign: 'left',
                boxShadow: isActive ? '0 0 24px rgba(34,211,238,0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: isActive ? '#22d3ee' : '#e2e8f0', marginBottom: '4px' }}>
                    {d.peak.toFixed(2)} Gy
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Peak radiation</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <StatusBadge status={d.risk} size="sm" animated={isActive} />
                  {isActive && <ChevronRight size={16} color="#22d3ee" />}
                </div>
              </div>

              {/* Mini bar */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(d.peak / 2) * 100}%`,
                    background: `linear-gradient(90deg, ${riskColor}80, ${riskColor})`,
                    borderRadius: '2px',
                  }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', marginBottom: '24px', animationDelay: '0.3s', opacity: 0 }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
            {day.label} — Hourly Radiation Forecast
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            24-hour radiation level projection for {day.label.toLowerCase()}
          </p>
        </div>
        <PredictionChart data={day.hourly} height={280} />
      </div>

      {/* Day details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Peak Radiation', value: `${day.peak.toFixed(2)} Gy`, color: getRiskColor(day.risk) },
          { label: 'Average', value: `${day.average.toFixed(2)} Gy`, color: '#06b6d4' },
          { label: 'Minimum', value: `${day.lowest.toFixed(2)} Gy`, color: '#10b981' },
          { label: 'Risk Level', value: day.risk, color: getRiskColor(day.risk), isRisk: true },
        ].map((s, i) => (
          <div
            key={s.label}
            className="glass-card animate-fade-in-up"
            style={{ padding: '20px', animationDelay: `${0.4 + i * 0.1}s`, opacity: 0 }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>
              {s.label}
            </div>
            {s.isRisk
              ? <StatusBadge status={s.value} size="md" animated />
              : <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuturePredictionPage;
