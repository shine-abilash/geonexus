import React from 'react';
import { PipelineStep, FlowArrow } from '../components/Pipeline';
import { PredictionChart } from '../components/Charts';
import { futurePrediction, todayPrediction } from '../data/mockData';

const flowSteps = [
  { label: 'Heavy-Ion Spectrometer', sublabel: 'Hardware sensor', active: false },
  { label: 'Live Radiation Data', sublabel: 'Real-time feed', active: true },
  { label: 'SEPNET', sublabel: 'Event classifier', active: true },
  { label: 'Real Event?', sublabel: '→ YES (96.8% confidence)', active: false },
  { label: 'User Chooses Prediction', sublabel: 'Today or Future', active: false },
  { label: 'LSTM Model 1 / 2', sublabel: 'Radiation forecasting', active: true },
  { label: 'Radiation Prediction', sublabel: '24h or 48h forecast', active: false },
  { label: 'Physics Formulas', sublabel: '6-step calculation', active: true },
  { label: 'Radiation Exposure / Dose', sublabel: 'Absorbed dose (Gy)', active: false },
  { label: 'Compare Locations', sublabel: 'Multi-site analysis', active: true },
  { label: 'Safest Location', sublabel: 'Ranked by safety score', active: false },
  { label: 'Astronaut Safety ✓', sublabel: 'Mission-critical decision', active: false, isResult: true },
];

// History entries
const historyEntries = [
  { id: 1, date: '2026-08-30', model: 'LSTM-1', predictedPeak: 0.82, actualPeak: 0.79, accuracy: 96.4, risk: 'MODERATE' },
  { id: 2, date: '2026-08-29', model: 'LSTM-2', predictedPeak: 1.14, actualPeak: 1.18, accuracy: 96.6, risk: 'HIGH' },
  { id: 3, date: '2026-08-28', model: 'LSTM-1', predictedPeak: 0.41, actualPeak: 0.38, accuracy: 92.8, risk: 'LOW' },
  { id: 4, date: '2026-08-27', model: 'LSTM-2', predictedPeak: 0.67, actualPeak: 0.71, accuracy: 94.2, risk: 'MODERATE' },
  { id: 5, date: '2026-08-26', model: 'LSTM-1', predictedPeak: 0.23, actualPeak: 0.24, accuracy: 97.8, risk: 'LOW' },
];

export const PredictionHistory: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Archive</div>
        <h2 className="section-heading">Prediction History</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Past model predictions vs actual radiation measurements — validating forecast accuracy.
        </p>
      </div>

      {/* Accuracy stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Avg Accuracy', value: '95.6%', color: 'var(--safe)' },
          { label: 'Total Predictions', value: '124', color: 'var(--ion)' },
          { label: 'LSTM-1 Sessions', value: '68', color: 'var(--ion)' },
          { label: 'LSTM-2 Sessions', value: '56', color: '#38bdf8' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Recent Prediction Sessions</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Date', 'Model', 'Predicted Peak', 'Actual Peak', 'Accuracy', 'Risk'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyEntries.map((e, i) => {
              const rColor = e.risk === 'LOW' ? 'var(--safe)' : e.risk === 'HIGH' ? 'var(--danger)' : 'var(--warn)';
              return (
                <tr
                  key={e.id}
                  style={{
                    borderBottom: '1px solid rgba(0,200,255,0.05)',
                    background: i % 2 === 0 ? 'rgba(0,200,255,0.015)' : undefined,
                  }}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono',monospace" }}>{e.date}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ion)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{e.model}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono',monospace" }}>{e.predictedPeak.toFixed(2)} Gy</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono',monospace" }}>{e.actualPeak.toFixed(2)} Gy</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${e.accuracy}%`, background: 'var(--safe)', borderRadius: '2px' }} />
                      </div>
                      <span style={{ color: 'var(--safe)', fontFamily: "'JetBrains Mono',monospace" }}>{e.accuracy}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: rColor, fontSize: '0.7rem', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{e.risk}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 48h archive chart */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>48-Hour Prediction Archive</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Last LSTM Model 2 run results</div>
        <PredictionChart data={futurePrediction} height={220} />
      </div>
    </div>
  );
};

// ─── System Flow (complete pipeline page) ────────────────────────────────────
export const SystemFlow: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Architecture</div>
        <h2 className="section-heading">Complete System Flow</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Data travels from the spectrometer through AI models and physics engines to deliver astronaut safety decisions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Pipeline */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>Data Pipeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {flowSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <PipelineStep
                  label={step.label}
                  sublabel={step.sublabel}
                  active={step.active}
                  isResult={(step as any).isResult}
                />
                {i < flowSteps.length - 1 && <FlowArrow />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Story text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { n: 1, title: 'Radiation arrives from space', body: 'Solar energetic particle (SEP) events and galactic cosmic rays continuously bombard the spacecraft.' },
            { n: 2, title: 'Spectrometer detects it', body: 'The Heavy Ion Spectrometer captures particle flux, energy spectrum, and timing — generating raw radiation data.' },
            { n: 3, title: 'SEPNET classifies the event', body: 'Our neural network decides: is this a true radiation event, or just instrument noise? It runs with 96.8% confidence.' },
            { n: 4, title: 'LSTM predicts the future', body: 'Two LSTM models forecast radiation levels: Model 1 for today (24h), Model 2 for the coming days (48h).' },
            { n: 5, title: 'Physics converts predictions to dose', body: 'Six physics equations transform particle flux predictions into absorbed dose in Gray (Gy) — the real health metric.' },
            { n: 6, title: 'Locations are compared', body: 'The system evaluates 5 nearby locations, ranking them by predicted dose and safety score.' },
            { n: 7, title: 'Astronauts receive a recommendation', body: 'The safest location is highlighted with a clear recommendation and route — enabling informed, life-critical decisions.' },
          ].map(s => (
            <div
              key={s.n}
              className="glass-card"
              style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                background: 'rgba(0,200,255,0.1)',
                border: '1px solid var(--border-bright)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, color: 'var(--ion)',
                fontFamily: "'JetBrains Mono',monospace",
              }}>
                {s.n}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{s.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
