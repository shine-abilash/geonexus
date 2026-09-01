import React from 'react';
import { Brain } from 'lucide-react';
import { PredictionChart } from '../components/Charts';
import { StatusBadge } from '../components/StatusBadge';
import { futurePrediction, futureDay1Stats, futureDay2Stats } from '../data/mockData';

export const FuturePrediction: React.FC = () => {
  const [activeDay, setActiveDay] = React.useState<1 | 2>(1);
  const dayData = activeDay === 1 ? futurePrediction.slice(0, 24) : futurePrediction.slice(24);
  const dayStats = activeDay === 1 ? futureDay1Stats : futureDay2Stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>LSTM Model 2</div>
        <h2 className="section-heading">Future Radiation Prediction</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          LSTM Model 2 — Next 2 Days (48 hours)
        </p>
      </div>

      {/* Model info */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <Brain size={18} color="var(--ion)" />
          <div style={{ fontWeight: 700 }}>LSTM Model 2</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem' }}>
          {[
            { label: 'Input', value: 'Previous radiation data' },
            { label: 'Output', value: 'Next 2 days (48h)' },
            { label: 'Architecture', value: 'Multi-step LSTM' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'rgba(0,200,255,0.06)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px',
            }}>
              <span style={{ color: 'var(--text-muted)' }}>{f.label}: </span>
              <span style={{ color: 'var(--ion)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Viewing:</span>
        <div className="tab-bar">
          <button className={`tab-btn ${activeDay === 1 ? 'active' : ''}`} onClick={() => setActiveDay(1)}>
            DAY 1
          </button>
          <button className={`tab-btn ${activeDay === 2 ? 'active' : ''}`} onClick={() => setActiveDay(2)}>
            DAY 2
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
          Day {activeDay} — 24-Hour Radiation Forecast
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {activeDay === 1 ? 'First 24 hours of the forecast window' : 'Hours 25–48 of the forecast window'}
        </div>
        <PredictionChart data={dayData} showConfidence />
      </div>

      {/* Daily summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[{ stats: futureDay1Stats, day: 1 }, { stats: futureDay2Stats, day: 2 }].map(({ stats, day }) => {
          const riskColor = stats.risk === 'LOW' ? '#22c55e' : stats.risk === 'HIGH' ? '#ef4444' : '#f59e0b';
          return (
            <div
              key={day}
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderColor: day === activeDay ? 'var(--border-bright)' : undefined,
                background: day === activeDay ? 'rgba(0,200,255,0.04)' : undefined,
              }}
            >
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>
                DAY {day} SUMMARY
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Peak radiation</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: riskColor }}>
                    {stats.peak} <span style={{ fontSize: '0.75rem' }}>Gy</span>
                  </div>
                </div>
                <StatusBadge status={stats.risk} size="md" glow />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Average: <span style={{ color: 'var(--ion)', fontFamily: "'JetBrains Mono',monospace" }}>{stats.average} Gy</span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((stats.peak / 2) * 100, 100)}%`, background: riskColor, borderRadius: '2px', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
