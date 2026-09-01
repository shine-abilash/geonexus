import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, Shield, Clock, Wifi } from 'lucide-react';
import StatCard from '../components/StatCard';
import RadiationChart from '../components/RadiationChart';
import { currentStats } from '../data/mockData';
import type { PageId } from '../components/Sidebar';

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #06b6d4, #3b82f6)' }} />
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                SPACE RADIATION MONITORING
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                AI-powered radiation prediction and astronaut safety system
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', borderRadius: '24px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'live-pulse 1.5s ease-in-out infinite' }} />
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}>● LIVE</span>
          </div>
          <div style={{ fontSize: '12px', color: '#475569', textAlign: 'right' }}>
            {time.toUTCString().replace('GMT', 'UTC')}
          </div>
          <div style={{ fontSize: '11px', color: '#334155' }}>Data stream active</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          title="Current Radiation"
          value={currentStats.currentRadiation.toFixed(2)}
          unit={currentStats.unit}
          status="LOW"
          statusColor="#10b981"
          icon={<Activity size={18} />}
          glowColor="#06b6d4"
          delay={0}
        />
        <StatCard
          title="Particle Flux"
          value="2.84 × 10⁴"
          unit="p/cm²/s"
          subValue="Heavy-ion spectrometer reading"
          icon={<Zap size={18} />}
          glowColor="#818cf8"
          delay={0.1}
        />
        <StatCard
          title="Predicted 24h Peak"
          value={currentStats.predicted24hPeak.toFixed(2)}
          unit="Gy"
          status="MODERATE"
          statusColor="#f59e0b"
          icon={<TrendingUp size={18} />}
          glowColor="#f59e0b"
          delay={0.2}
        />
        <StatCard
          title="Safety Status"
          value="SAFE"
          subValue="All crew members protected"
          status="SAFE"
          statusColor="#10b981"
          icon={<Shield size={18} />}
          glowColor="#10b981"
          delay={0.3}
        />
      </div>

      {/* Live Chart */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', marginBottom: '28px', animationDelay: '0.3s', opacity: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
              LIVE HEAVY-ION RADIATION DATA
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Real-time data received from Heavy Ion Spectrometer
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'live-pulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>LIVE DATA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#475569' }}>
              <Clock size={12} /> Last updated: Just now
            </div>
          </div>
        </div>

        {/* Zone legend */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { color: '#10b981', label: 'Safe Zone (< 0.5 Gy)' },
            { color: '#f59e0b', label: 'Warning Zone (0.5 – 1.0 Gy)' },
            { color: '#ef4444', label: 'Danger Zone (> 1.0 Gy)' },
          ].map(z => (
            <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 20, height: 2, borderRadius: '1px', background: z.color, opacity: 0.8 }} />
              <span style={{ fontSize: '11px', color: '#64748b' }}>{z.label}</span>
            </div>
          ))}
        </div>

        <RadiationChart height={300} showZones />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px', animationDelay: '0.4s', opacity: 0 }}>
        {[
          { label: 'View Event Detection', sub: 'SEPNET Analysis', page: 'live' as PageId, color: '#06b6d4' },
          { label: "Today's Prediction", sub: 'LSTM Model 1', page: 'today' as PageId, color: '#818cf8' },
          { label: 'Future Prediction', sub: 'LSTM Model 2', page: 'future' as PageId, color: '#22d3ee' },
          { label: 'Safe Location', sub: 'Compare Locations', page: 'location' as PageId, color: '#10b981' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => onNavigate(a.page)}
            style={{
              padding: '16px 20px',
              background: `${a.color}0d`,
              border: `1px solid ${a.color}25`,
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              color: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${a.color}18`;
              (e.currentTarget as HTMLElement).style.borderColor = `${a.color}50`;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = `${a.color}0d`;
              (e.currentTarget as HTMLElement).style.borderColor = `${a.color}25`;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: a.color, marginBottom: '4px' }}>{a.label}</div>
            <div style={{ fontSize: '12px', color: '#475569' }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="animate-fade-in-up" style={{
        padding: '20px 28px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.06) 100%)',
        border: '1px solid rgba(6,182,212,0.15)',
        textAlign: 'center',
        animationDelay: '0.5s', opacity: 0,
      }}>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.03em' }}>
          <span style={{ color: '#06b6d4' }}>BETTER PREDICTION</span>
          <span style={{ color: '#475569', margin: '0 12px' }}>→</span>
          <span style={{ color: '#818cf8' }}>LOWER RADIATION RISK</span>
          <span style={{ color: '#475569', margin: '0 12px' }}>→</span>
          <span style={{ color: '#10b981' }}>SAFER MISSIONS</span>
          <span style={{ color: '#475569', margin: '0 12px' }}>→</span>
          <span style={{ color: '#f59e0b' }}>PROTECT ASTRONAUTS</span>
        </p>
      </div>
    </div>
  );
};

export default OverviewPage;
