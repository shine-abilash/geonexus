import React from 'react';
import { Radio } from 'lucide-react';
import { RadiationChart } from '../components/Charts';
import { StatCard } from '../components/StatCard';
import { liveRadiationData } from '../data/mockData';

export const LiveRadiation: React.FC = () => {
  const [liveData, setLiveData] = React.useState(liveRadiationData);

  React.useEffect(() => {
    const id = setInterval(() => {
      setLiveData(prev => {
        const last = prev[prev.length - 1];
        const newRad = +(last.radiation + (Math.random() - 0.48) * 0.04).toFixed(3);
        const now = new Date();
        return [
          ...prev.slice(1),
          {
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            radiation: Math.max(0.05, newRad),
            flux: +(newRad * 13500 + Math.random() * 800).toFixed(0),
          },
        ];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const current = liveData[liveData.length - 1];
  const riskForDose = (d: number) =>
    d < 0.3 ? { label: 'LOW', color: 'safe' as const } :
    d < 0.6 ? { label: 'MODERATE', color: 'warn' as const } :
    { label: 'HIGH', color: 'danger' as const };

  const risk = riskForDose(current.radiation);
  const avg = +(liveData.reduce((s, d) => s + d.radiation, 0) / liveData.length).toFixed(3);
  const max = +(Math.max(...liveData.map(d => d.radiation))).toFixed(3);
  const min = +(Math.min(...liveData.map(d => d.radiation))).toFixed(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Heavy-Ion Spectrometer</div>
        <h2 className="section-heading">Live Radiation Feed</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time radiation measurements updated every few seconds — data flows directly from the Heavy Ion Spectrometer.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        <StatCard label="Current" value={`${current.radiation.toFixed(3)} Gy`} status={risk.label} statusColor={risk.color} icon={<Radio size={15} />} glowing />
        <StatCard label="Session Min" value={`${min} Gy`} statusColor="safe" />
        <StatCard label="Session Avg" value={`${avg} Gy`} statusColor="ion" />
        <StatCard label="Session Max" value={`${max} Gy`} statusColor={max > 0.6 ? 'danger' : max > 0.3 ? 'warn' : 'safe'} />
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Real-Time Radiation Stream</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Last 30 readings at 5-minute intervals</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--safe)' }}>
            <span className="live-dot" /> STREAMING
          </div>
        </div>
        <RadiationChart data={liveData} />
      </div>

      {/* Spectrometer info */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>About the Heavy Ion Spectrometer</div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The Heavy Ion Spectrometer measures the flux and energy of heavy ions (charged particles heavier than helium) in space. These particles originate from solar energetic particle (SEP) events and galactic cosmic rays (GCR) and can be extremely hazardous to astronaut health.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Measurement Range', value: '0.05 – 5.0 Gy' },
            { label: 'Sample Rate', value: 'Every 5 minutes' },
            { label: 'Energy Range', value: '10 – 1000 MeV' },
            { label: 'Detection Mode', value: 'Heavy-ion (Z ≥ 2)' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'rgba(0,200,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
            }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '2px' }}>
                {f.label}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ion)', fontFamily: "'JetBrains Mono',monospace" }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
