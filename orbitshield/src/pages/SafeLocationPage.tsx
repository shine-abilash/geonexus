import React, { useState } from 'react';
import { MapPin, Shield, Star, ArrowRight, ArrowUpDown, TrendingUp } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { locations, getRiskColor } from '../data/mockData';

type SortKey = 'dose' | 'safetyScore' | 'distance';

const SafeLocationPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortKey>('safetyScore');
  const [selected, setSelected] = useState<string | null>(null);

  const recommended = locations.find(l => l.recommended)!;

  const sorted = [...locations].sort((a, b) => {
    if (sortBy === 'dose') return a.dose - b.dose;
    if (sortBy === 'safetyScore') return b.safetyScore - a.safetyScore;
    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
    return 0;
  });

  const maxDose = Math.max(...locations.map(l => l.dose));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #10b981, #06b6d4)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>SAFE LOCATION RECOMMENDATION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Compare predicted radiation exposure across nearby locations to find the safest mission area.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Banner */}
      <div
        className="animate-fade-in-up"
        style={{
          padding: '28px 32px', borderRadius: '20px', marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))',
          border: '2px solid rgba(16,185,129,0.35)',
          boxShadow: '0 0 40px rgba(16,185,129,0.08)',
          display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center',
          animationDelay: '0.1s', opacity: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '16px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Star size={32} color="#10b981" fill="#10b981" style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.6))' }} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ✓ Recommended Location
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0', marginBottom: '4px' }}>
              {recommended.name}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Lowest predicted radiation exposure</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
              {recommended.safetyScore}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Safety Score</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#e2e8f0' }}>{recommended.dose.toFixed(2)} Gy</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Radiation Dose</div>
          </div>
          <StatusBadge status={recommended.risk} size="lg" animated />
          <button className="btn-primary" style={{ gap: '8px' }}>
            <MapPin size={16} /> VIEW SAFE ROUTE <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Map + List Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>
        {/* Map */}
        <div
          className="glass-card-static animate-fade-in-up location-map-bg"
          style={{ padding: '0', overflow: 'hidden', position: 'relative', animationDelay: '0.2s', opacity: 0, minHeight: '420px' }}
        >
          {/* Map header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(6,182,212,0.1)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Mission Area Map</h3>
            <p style={{ fontSize: '11px', color: '#475569' }}>Simulated location overlay — tap a marker to inspect</p>
          </div>

          {/* Map area */}
          <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
            {/* Grid lines */}
            <div className="grid-overlay" style={{ position: 'absolute', inset: 0 }} />

            {/* Coordinate lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {/* Range circles from recommended */}
              {[80, 160, 240].map((r, i) => (
                <circle
                  key={i} cx={`${recommended.x}%`} cy={`${recommended.y}%`} r={r}
                  fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="1"
                />
              ))}
              {/* Connection lines from recommended to others */}
              {locations.filter(l => !l.recommended).map(l => (
                <line
                  key={l.id}
                  x1={`${recommended.x}%`} y1={`${recommended.y}%`}
                  x2={`${l.x}%`} y2={`${l.y}%`}
                  stroke={`${getRiskColor(l.risk)}30`} strokeWidth="1" strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Location markers */}
            {locations.map((loc) => {
              const color = getRiskColor(loc.risk);
              const isSelected = selected === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelected(isSelected ? null : loc.id)}
                  style={{
                    position: 'absolute',
                    left: `${loc.x}%`, top: `${loc.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 10 : 5,
                  }}
                >
                  {/* Pulse ring for recommended */}
                  {loc.recommended && (
                    <div style={{
                      position: 'absolute', inset: '-16px', borderRadius: '50%',
                      border: `2px solid ${color}40`,
                      animation: 'live-pulse 2.5s ease-in-out infinite',
                    }} />
                  )}

                  {/* Marker */}
                  <div style={{
                    width: loc.recommended ? 44 : 36, height: loc.recommended ? 44 : 36,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    background: `${color}20`,
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 ${loc.recommended ? 20 : 10}px ${color}50`,
                    transition: 'all 0.3s ease',
                    transform: `rotate(-45deg) scale(${isSelected ? 1.2 : 1})`,
                  }}>
                    <MapPin size={loc.recommended ? 18 : 14} color={color} style={{ transform: 'rotate(45deg)' }} />
                  </div>

                  {/* Label */}
                  <div style={{
                    position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(3,7,18,0.9)', border: `1px solid ${color}40`,
                    borderRadius: '6px', padding: '4px 8px', whiteSpace: 'nowrap',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color }}>{loc.shortName}</div>
                    <div style={{ fontSize: '10px', color: '#475569' }}>{loc.dose.toFixed(2)} Gy</div>
                  </div>

                  {/* Popup */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
                      background: 'rgba(6,13,31,0.97)', border: `1px solid ${color}50`,
                      borderRadius: '10px', padding: '14px 16px', whiteSpace: 'nowrap',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '180px',
                      zIndex: 20,
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>{loc.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                        Dose: <span style={{ color }}>{loc.dose.toFixed(2)} Gy</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                        Safety: <span style={{ color: '#10b981' }}>{loc.safetyScore}%</span>
                      </div>
                      <StatusBadge status={loc.risk} size="sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Location list */}
        <div className="glass-card-static animate-fade-in-up" style={{ padding: '20px', animationDelay: '0.25s', opacity: 0, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '16px' }}>Location Summary</h3>
          {locations.sort((a, b) => b.safetyScore - a.safetyScore).map((loc, i) => {
            const color = getRiskColor(loc.risk);
            return (
              <div
                key={loc.id}
                onClick={() => setSelected(loc.id === selected ? null : loc.id)}
                style={{
                  padding: '14px', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer',
                  background: loc.recommended ? `${color}0d` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${loc.recommended ? color + '30' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>
                    {loc.recommended && <span style={{ color: '#10b981', marginRight: '6px' }}>✓</span>}
                    {loc.shortName}
                  </div>
                  <StatusBadge status={loc.risk} size="sm" />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{loc.description}</div>
                {/* Safety bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${loc.safetyScore}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color, fontWeight: 700, width: '36px', textAlign: 'right' }}>{loc.safetyScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.4s', opacity: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>Location Comparison</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Radiation dose comparison across all candidate locations</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {([['dose', 'Lowest Radiation'], ['safetyScore', 'Highest Safety'], ['distance', 'By Distance']] as [SortKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${sortBy === key ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  background: sortBy === key ? 'rgba(6,182,212,0.12)' : 'transparent',
                  color: sortBy === key ? '#06b6d4' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Location', 'Radiation Dose', 'Energy Level', 'Risk', 'Safety Score', 'Visual'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#475569', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((loc, i) => {
                const color = getRiskColor(loc.risk);
                return (
                  <tr
                    key={loc.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: loc.recommended ? 'rgba(16,185,129,0.04)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = loc.recommended ? 'rgba(16,185,129,0.04)' : 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {loc.recommended && <Star size={12} color="#10b981" fill="#10b981" />}
                        <span style={{ fontSize: '14px', fontWeight: 600, color: loc.recommended ? '#10b981' : '#e2e8f0' }}>{loc.name}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{loc.distance}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color }}>{loc.dose.toFixed(2)} Gy</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>{loc.energyLevel}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={loc.risk} size="sm" /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{loc.safetyScore}%</span>
                    </td>
                    <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${(loc.dose / maxDose) * 100}%`,
                            background: `linear-gradient(90deg, ${color}80, ${color})`,
                            borderRadius: '3px',
                          }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#475569', width: '24px' }}>
                          {'█'.repeat(Math.round((loc.dose / maxDose) * 5))}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SafeLocationPage;
