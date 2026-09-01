import React from 'react';
import { MapPin, Navigation, ArrowUpDown } from 'lucide-react';
import { locations, recommendedLocation, type Location } from '../data/mockData';
import { StatusBadge, RiskIndicator } from '../components/StatusBadge';

type SortKey = 'dose' | 'safetyScore' | 'distance';

const riskBg = (risk: Location['risk']) => ({
  LOW: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', text: '#22c55e', marker: 'safe-loc' },
  MODERATE: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', marker: 'warn-loc' },
  HIGH: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', marker: 'danger-loc' },
  CRITICAL: { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.5)', text: '#ff4455', marker: 'danger-loc' },
})[risk];

// Lightweight SVG map
const LocationMap: React.FC<{ locations: Location[]; selectedId: string; onSelect: (id: string) => void }> = ({
  locations, selectedId, onSelect,
}) => {
  // Map lat/lng to SVG coords (simple linear transform)
  const latRange = [27.0, 30.5];
  const lngRange = [-82.0, -79.5];
  const toSvg = (lat: number, lng: number) => ({
    x: ((lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 320 + 30,
    y: ((latRange[1] - lat) / (latRange[1] - latRange[0])) * 180 + 20,
  });

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(3,6,15,0.7)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <svg
        viewBox="0 0 380 220"
        style={{ width: '100%', display: 'block' }}
      >
        {/* Grid lines */}
        {[0,1,2,3].map(i => (
          <React.Fragment key={i}>
            <line x1={30 + i * 80} y1={10} x2={30 + i * 80} y2={210} stroke="rgba(0,200,255,0.06)" strokeWidth="1" />
            <line x1={20} y1={20 + i * 45} x2={360} y2={20 + i * 45} stroke="rgba(0,200,255,0.06)" strokeWidth="1" />
          </React.Fragment>
        ))}
        {/* Radial rings from Alpha */}
        {[40, 80, 120, 160].map(r => {
          const c = toSvg(locations[0].lat, locations[0].lng);
          return <circle key={r} cx={c.x} cy={c.y} r={r} stroke="rgba(0,200,255,0.06)" strokeWidth="1" fill="none" />;
        })}

        {/* Connection lines from base */}
        {locations.slice(1).map(loc => {
          const base = toSvg(locations[0].lat, locations[0].lng);
          const p = toSvg(loc.lat, loc.lng);
          return (
            <line
              key={loc.id}
              x1={base.x} y1={base.y} x2={p.x} y2={p.y}
              stroke="rgba(0,200,255,0.12)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          );
        })}

        {/* Location markers */}
        {locations.map(loc => {
          const p = toSvg(loc.lat, loc.lng);
          const isSelected = loc.id === selectedId;
          const rb = riskBg(loc.risk);
          const rColor = rb.text;
          return (
            <g key={loc.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(loc.id)}>
              {isSelected && (
                <circle cx={p.x} cy={p.y} r={22} fill={rColor} opacity={0.08} />
              )}
              <circle
                cx={p.x} cy={p.y} r={isSelected ? 14 : 10}
                fill={rColor + '20'}
                stroke={rColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter={isSelected ? `drop-shadow(0 0 8px ${rColor})` : undefined}
              />
              <text
                x={p.x} y={p.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fill={rColor}
                fontSize={isSelected ? "9" : "8"}
                fontFamily="'JetBrains Mono',monospace"
                fontWeight="700"
              >
                {loc.shortName}
              </text>
              {isSelected && (
                <text
                  x={p.x} y={p.y + 24}
                  textAnchor="middle"
                  fill={rColor}
                  fontSize="7"
                  fontFamily="'JetBrains Mono',monospace"
                >
                  {loc.name.split(' ')[1]}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <text x="10" y="215" fill="rgba(63,95,128,0.8)" fontSize="6" fontFamily="'JetBrains Mono',monospace">
          Mission area — orbital radius view
        </text>
      </svg>
    </div>
  );
};

export const SafeLocation: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState(recommendedLocation.id);
  const [sortKey, setSortKey] = React.useState<SortKey>('safetyScore');
  const selected = locations.find(l => l.id === selectedId) ?? locations[0];

  const sorted = [...locations].sort((a, b) => {
    if (sortKey === 'dose') return a.dose - b.dose;
    if (sortKey === 'safetyScore') return b.safetyScore - a.safetyScore;
    return a.distance - b.distance;
  });

  const maxDose = Math.max(...locations.map(l => l.dose));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Mission Safety</div>
        <h2 className="section-heading">Safe Location Recommendation</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Compare predicted radiation exposure across nearby locations — choose the safest path.
        </p>
      </div>

      {/* Recommended location banner */}
      <div
        className="glass-card-bright glow-safe"
        style={{
          padding: '1.25rem 1.5rem',
          borderColor: 'rgba(34,197,94,0.4)',
          background: 'rgba(34,197,94,0.06)',
          display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '2rem' }}>🛡️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em' }}>RECOMMENDED LOCATION</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--safe)', letterSpacing: '0.04em' }}>{recommendedLocation.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lowest predicted radiation exposure</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>SAFETY SCORE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--safe)', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
            {recommendedLocation.safetyScore}%
          </div>
        </div>
        <button
          style={{
            background: 'var(--safe)', color: '#000',
            fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em',
            padding: '9px 18px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 0 16px var(--safe-glow)',
          }}
        >
          <Navigation size={14} />
          VIEW SAFE ROUTE
        </button>
      </div>

      {/* Map + detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(220px, 1fr)', gap: '1rem' }}>
        <LocationMap locations={locations} selectedId={selectedId} onSelect={setSelectedId} />

        {/* Selected location detail */}
        <div className="glass-card" style={{ padding: '1.25rem', borderColor: riskBg(selected.risk).border }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>
            SELECTED LOCATION
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: riskBg(selected.risk).text }}>
            {selected.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            {selected.description}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Dose', value: `${selected.dose.toFixed(2)} Gy`, color: riskBg(selected.risk).text },
              { label: 'Energy Level', value: selected.energyLevel, color: 'var(--ion)' },
              { label: 'Distance from base', value: selected.distance === 0 ? 'Base location' : `${selected.distance} km`, color: 'var(--text-secondary)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ color: r.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Risk</div>
              <StatusBadge status={selected.risk} size="md" glow />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Safety Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${selected.safetyScore}%`, background: riskBg(selected.risk).text, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: riskBg(selected.risk).text, fontFamily: "'JetBrains Mono',monospace" }}>
                  {selected.safetyScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Location Comparison</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <ArrowUpDown size={12} />
            <span>Sort by:</span>
            <div className="tab-bar">
              {([['safetyScore', 'Safety'], ['dose', 'Dose'], ['distance', 'Distance']] as [SortKey, string][]).map(([k, label]) => (
                <button key={k} className={`tab-btn ${sortKey === k ? 'active' : ''}`} onClick={() => setSortKey(k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {sorted.map((loc, i) => {
            const rb = riskBg(loc.risk);
            const isSelected = loc.id === selectedId;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                style={{
                  background: isSelected ? `${rb.text}10` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? rb.border : 'var(--border)'}`,
                  borderRadius: '10px', padding: '0.75rem 1rem',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  {/* Rank */}
                  <div style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-muted)', width: '16px' }}>#{i + 1}</div>
                  {/* Name */}
                  <div style={{ minWidth: '130px', flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: rb.text }}>{loc.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{loc.distance === 0 ? 'Current base' : `${loc.distance} km`} · {loc.energyLevel} energy</div>
                  </div>
                  {/* Dose bar */}
                  <div style={{ flex: 2, minWidth: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      <span>Radiation dose</span>
                      <span style={{ color: rb.text, fontFamily: "'JetBrains Mono',monospace" }}>{loc.dose.toFixed(2)} Gy</span>
                    </div>
                    <div className="comp-bar-bg">
                      <div
                        className="comp-bar-fill"
                        style={{ width: `${(loc.dose / maxDose) * 100}%`, background: rb.text, boxShadow: `0 0 4px ${rb.text}` }}
                      />
                    </div>
                  </div>
                  {/* Safety score */}
                  <div style={{ textAlign: 'right', minWidth: '60px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: rb.text, fontFamily: "'JetBrains Mono',monospace" }}>{loc.safetyScore}%</div>
                    <StatusBadge status={loc.risk} size="sm" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
