import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, MessageSquare } from 'lucide-react';
import PredictionChart from '../components/PredictionChart';
import StatusBadge from '../components/StatusBadge';
import { todayPrediction } from '../data/mockData';
import { getRiskColor } from '../data/mockData';

const TodayPredictionPage: React.FC = () => {
  const p = todayPrediction;
  const riskColor = getRiskColor(p.riskLevel);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #818cf8, #06b6d4)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>TODAY'S RADIATION PREDICTION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              LSTM Model 1 — Next 24 Hours
            </p>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="animate-fade-in-up" style={{
        padding: '20px 24px', borderRadius: '14px', marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(99,102,241,0.05))',
        border: '1px solid rgba(129,140,248,0.25)',
        display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center',
        animationDelay: '0.1s', opacity: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={28} color="#818cf8" />
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#818cf8' }}>{p.modelName}</div>
          </div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Input</div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Previous {p.inputTimestamps} timestamps</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Output</div>
          <div style={{ fontSize: '14px', color: '#818cf8' }}>Next {p.outputHours} hours</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status={p.riskLevel} size="md" animated />
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', marginBottom: '24px', animationDelay: '0.2s', opacity: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
              24-Hour Radiation Forecast
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Shaded area shows confidence interval — the range where radiation is expected to fall
            </p>
          </div>
        </div>
        <PredictionChart data={p.hourly} height={300} />
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Lowest Expected', value: `${p.lowest.toFixed(2)} Gy`, icon: <TrendingDown size={18} />, color: '#10b981' },
          { label: 'Average', value: `${p.average.toFixed(2)} Gy`, icon: <TrendingUp size={18} />, color: '#06b6d4' },
          { label: 'Peak', value: `${p.peak.toFixed(2)} Gy`, icon: <AlertTriangle size={18} />, color: '#f59e0b' },
          { label: 'Risk Level', value: p.riskLevel, icon: <AlertTriangle size={18} />, color: riskColor, isRisk: true },
        ].map((s, i) => (
          <div
            key={s.label}
            className="glass-card animate-fade-in-up"
            style={{ padding: '20px', animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: s.color }}>
              {s.icon}
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                {s.label}
              </span>
            </div>
            {s.isRisk
              ? <StatusBadge status={s.value} size="lg" animated />
              : <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
            }
          </div>
        ))}
      </div>

      {/* AI Interpretation */}
      <div
        className="animate-fade-in-up"
        style={{
          padding: '24px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(129,140,248,0.08) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(129,140,248,0.2)',
          animationDelay: '0.7s', opacity: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
            background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8',
          }}>
            <MessageSquare size={18} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#818cf8', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
              AI Interpretation
            </div>
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: 1.8 }}>
              {p.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPredictionPage;
