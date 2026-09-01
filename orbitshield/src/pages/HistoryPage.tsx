import React from 'react';
import { History, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const historyData = [
  { id: 1, date: '2026-09-01', time: '18:30', model: 'LSTM-1', peak: 1.18, avg: 0.48, risk: 'MODERATE', eventDetected: true, accuracy: 96.8 },
  { id: 2, date: '2026-09-01', time: '12:00', model: 'LSTM-2', peak: 0.84, avg: 0.52, risk: 'LOW', eventDetected: true, accuracy: 94.2 },
  { id: 3, date: '2026-08-31', time: '21:15', model: 'LSTM-1', peak: 2.34, avg: 1.12, risk: 'HIGH', eventDetected: true, accuracy: 98.1 },
  { id: 4, date: '2026-08-31', time: '08:00', model: 'LSTM-2', peak: 0.18, avg: 0.09, risk: 'LOW', eventDetected: false, accuracy: 91.5 },
  { id: 5, date: '2026-08-30', time: '16:45', model: 'LSTM-1', peak: 0.62, avg: 0.31, risk: 'MODERATE', eventDetected: true, accuracy: 95.7 },
  { id: 6, date: '2026-08-30', time: '06:30', model: 'LSTM-2', peak: 1.76, avg: 0.94, risk: 'HIGH', eventDetected: true, accuracy: 97.3 },
];

const HistoryPage: React.FC = () => (
  <div style={{ padding: '24px', maxWidth: '1400px' }}>
    <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #818cf8, #06b6d4)' }} />
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>PREDICTION HISTORY</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Past radiation predictions and event detection records</p>
        </div>
      </div>
    </div>

    {/* Summary stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {[
        { label: 'Total Predictions', value: '48', icon: <History size={18} />, color: '#06b6d4' },
        { label: 'Events Detected', value: '31', icon: <CheckCircle2 size={18} />, color: '#10b981' },
        { label: 'False Negatives', value: '3', icon: <XCircle size={18} />, color: '#ef4444' },
        { label: 'Avg Accuracy', value: '95.6%', icon: <TrendingUp size={18} />, color: '#818cf8' },
      ].map((s, i) => (
        <div key={s.label} className="glass-card animate-fade-in-up" style={{ padding: '20px', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: s.color }}>
            {s.icon}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
        </div>
      ))}
    </div>

    {/* Table */}
    <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.3s', opacity: 0, overflowX: 'auto' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>Prediction Records</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Date & Time', 'Model Used', 'Event Detected', 'Peak Radiation', 'Avg Radiation', 'Risk Level', 'Accuracy'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historyData.map((row, i) => (
            <tr
              key={row.id}
              className="animate-fade-in-up"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', animationDelay: `${0.4 + i * 0.05}s`, opacity: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>{row.date}</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{row.time} UTC</div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 600 }}>{row.model}</span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                {row.eventDetected
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}><CheckCircle2 size={14} /><span style={{ fontSize: '13px' }}>Yes</span></div>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}><XCircle size={14} /><span style={{ fontSize: '13px' }}>No</span></div>
                }
              </td>
              <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                {row.peak.toFixed(2)} Gy
              </td>
              <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>
                {row.avg.toFixed(2)} Gy
              </td>
              <td style={{ padding: '14px 16px' }}><StatusBadge status={row.risk} size="sm" /></td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.accuracy}%`, background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>{row.accuracy}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default HistoryPage;
