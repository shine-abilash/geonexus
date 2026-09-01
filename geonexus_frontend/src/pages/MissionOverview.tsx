import React from 'react';
import { Activity, Zap, TrendingUp, Shield, Radio } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { RadiationChart } from '../components/Charts';
import { StatusBadge } from '../components/StatusBadge';
import { NeuralNetwork, PipelineStep, FlowArrow } from '../components/Pipeline';
import {
  liveRadiationData, currentRadiation, currentFlux,
  todayStats, sepnetResult,
} from '../data/mockData';
import type { PageId } from '../components/Sidebar';

interface Props {
  onNavigate: (page: PageId) => void;
}

export const MissionOverview: React.FC<Props> = ({ onNavigate }) => {
  const [liveData, setLiveData] = React.useState(liveRadiationData);
  const [lastUpdated, setLastUpdated] = React.useState('Just now');

  // Simulate live updates every 5 seconds
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
      setLastUpdated('Just now');
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const current = liveData[liveData.length - 1];
  const riskForDose = (d: number) => d < 0.3 ? 'LOW' : d < 0.6 ? 'MODERATE' : 'HIGH';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top header strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Mission Control Dashboard</div>
          <h2 className="section-heading">Space Radiation Monitoring</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            AI-powered radiation prediction and astronaut safety system
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard
          label="Current Radiation"
          value={`${current.radiation.toFixed(3)} Gy`}
          status={riskForDose(current.radiation)}
          statusColor={current.radiation < 0.3 ? 'safe' : current.radiation < 0.6 ? 'warn' : 'danger'}
          icon={<Activity size={15} />}
          glowing
          description="Gray units — absorbed ionizing radiation dose"
        />
        <StatCard
          label="Particle Flux"
          value={`${(current.flux / 1000).toFixed(2)} ×10³`}
          subValue="particles/cm²/s"
          icon={<Zap size={15} />}
          statusColor="ion"
          description="Heavy-ion particle flux from spectrometer"
        />
        <StatCard
          label="Predicted 24H Peak"
          value={`${todayStats.peak} Gy`}
          status="MODERATE"
          statusColor="warn"
          icon={<TrendingUp size={15} />}
          description="LSTM Model 1 peak forecast for next 24 hours"
        />
        <StatCard
          label="Safety Status"
          value="SAFE"
          status="System Nominal"
          statusColor="safe"
          icon={<Shield size={15} />}
          glowing
          description="All parameters within acceptable limits"
        />
      </div>

      {/* Live radiation chart */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom: '2px' }}>Heavy-Ion Spectrometer</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em' }}>Live Heavy-Ion Radiation Data</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Real-time data received from Heavy Ion Spectrometer</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--safe)' }}>LIVE DATA</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Last updated: {lastUpdated}</div>
            </div>
          </div>
        </div>
        <RadiationChart data={liveData} />
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--safe)', label: 'Normal Zone', range: '< 0.3 Gy' },
            { color: 'var(--warn)', label: 'Warning Zone', range: '0.3 – 0.6 Gy' },
            { color: 'var(--danger)', label: 'Danger Zone', range: '> 0.6 Gy' },
          ].map(z => (
            <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: '16px', height: '2px', background: z.color, display: 'inline-block' }} />
              <span style={{ color: z.color, fontWeight: 600 }}>{z.label}</span>
              <span>{z.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEPNET detection */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>AI Event Detection</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Radiation Event Detection</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          SEPNET checks the incoming radiation signal and determines whether it is a real radiation event.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            {/* Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>
              {[
                'Heavy-Ion Spectrometer',
                'Live Data',
                'SEPNET',
                'Event Detected ✓',
              ].map((step, i) => (
                <React.Fragment key={step}>
                  <div style={{
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontWeight: 600,
                    background: i === 3 ? 'rgba(34,197,94,0.1)' : i === 2 ? 'rgba(0,200,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${i === 3 ? 'rgba(34,197,94,0.35)' : i === 2 ? 'var(--border-bright)' : 'var(--border)'}`,
                    color: i === 3 ? 'var(--safe)' : i === 2 ? 'var(--ion)' : 'var(--text-secondary)',
                    letterSpacing: '0.06em',
                  }}>
                    {step}
                  </div>
                  {i < 3 && <div className="flow-line" style={{ marginLeft: '50px', height: '20px', minHeight: '20px' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Result card */}
          <div style={{ textAlign: 'center', minWidth: '180px' }}>
            <div className="glass-card-bright glow-safe" style={{ padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: "'JetBrains Mono',monospace" }}>
                EVENT STATUS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--safe)', marginBottom: '4px', fontFamily: "'JetBrains Mono',monospace" }}>
                TRUE
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--safe)', marginBottom: '1rem' }}>Radiation event detected</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Detection Confidence</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ion)', fontFamily: "'JetBrains Mono',monospace" }}>
                  {sepnetResult.confidence}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction selector */}
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '6px' }}>LSTM Models</div>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>Choose Your Prediction</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {/* Today */}
          <button
            onClick={() => onNavigate('today-prediction')}
            className="glass-card"
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              background: 'none',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--ion-glow)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '';
              (e.currentTarget as HTMLElement).style.background = '';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🕐</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ion)', fontSize: '0.875rem', letterSpacing: '0.05em' }}>TODAY'S PREDICTION</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LSTM Model 1</div>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Predict radiation for the next 24 hours using recent radiation history.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.68rem' }}>
              <div style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>INPUT: </span>6 timestamps
              </div>
              <div style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>OUTPUT: </span>24 hours
              </div>
            </div>
            <div style={{
              background: 'var(--ion)', color: '#000', fontWeight: 700, fontSize: '0.72rem',
              padding: '7px 14px', borderRadius: '7px', display: 'inline-block',
              letterSpacing: '0.05em',
            }}>
              VIEW TODAY'S PREDICTION →
            </div>
          </button>

          {/* Future */}
          <button
            onClick={() => onNavigate('future-prediction')}
            className="glass-card"
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              background: 'none',
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56,189,248,0.35)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(56,189,248,0.2)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(56,189,248,0.04)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '';
              (e.currentTarget as HTMLElement).style.background = '';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>📅</div>
              <div>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.875rem', letterSpacing: '0.05em' }}>FUTURE PREDICTION</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LSTM Model 2</div>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Predict radiation trends for the upcoming days ahead.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.68rem' }}>
              <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>INPUT: </span>History
              </div>
              <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>OUTPUT: </span>2 days
              </div>
            </div>
            <div style={{
              background: '#38bdf8', color: '#000', fontWeight: 700, fontSize: '0.72rem',
              padding: '7px 14px', borderRadius: '7px', display: 'inline-block',
              letterSpacing: '0.05em',
            }}>
              VIEW FUTURE PREDICTION →
            </div>
          </button>
        </div>
      </div>

      {/* Mission tagline */}
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(0,200,255,0.04), rgba(56,189,248,0.04))',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
        color: 'var(--text-secondary)',
        letterSpacing: '0.08em',
      }}>
        <span style={{ color: 'var(--safe)' }}>BETTER PREDICTION</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
        <span style={{ color: 'var(--ion)' }}>LOWER RADIATION RISK</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
        <span style={{ color: '#38bdf8' }}>SAFER MISSIONS</span>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
        <span style={{ color: 'var(--warn)' }}>PROTECT ASTRONAUTS</span>
      </div>
    </div>
  );
};
