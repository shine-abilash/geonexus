import React from 'react';
import { formulaCards, radiationAnalysis } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';

const colorMap: Record<string, string> = {
  ion: 'var(--ion)',
  plasma: '#38bdf8',
  warn: 'var(--warn)',
};

const FormulaCard: React.FC<{
  card: typeof formulaCards[0];
  index: number;
}> = ({ card, index }) => {
  const c = colorMap[card.color] ?? 'var(--ion)';
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderColor: `${c}25`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${c}50`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${c}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${c}25`;
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* background radial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at top left, ${c}06, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Step number */}
      <div style={{
        position: 'absolute', top: '12px', right: '14px',
        fontSize: '2.5rem', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
        color: `${c}12`, lineHeight: 1,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: c, boxShadow: `0 0 8px ${c}`,
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Step {index + 1}
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {card.title}
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="formula-display" style={{ color: c, borderColor: `${c}25`, textShadow: `0 0 20px ${c}60`, marginBottom: '1rem' }}>
        {card.formula}
      </div>

      {/* Explanation */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
        {card.explanation}
      </p>

      {/* Computed value */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: `${c}08`,
        border: `1px solid ${c}20`,
        borderRadius: '8px', padding: '8px 12px',
      }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono',monospace" }}>
          {card.symbol}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: c, fontFamily: "'JetBrains Mono',monospace" }}>
            {card.value}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{card.unit}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Why Energy Matters visualization ────────────────────────────────────────
const EnergyLevel: React.FC<{
  tier: 'LOW' | 'MEDIUM' | 'HIGH';
  label: string;
  energy: string;
  range: string;
  risk: string;
  particles: number;
  barWidth: string;
}> = ({ tier, label, energy, range, risk, particles, barWidth }) => {
  const colors = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
  const c = colors[tier];
  return (
    <div className="glass-card" style={{ padding: '1.25rem', borderColor: `${c}25` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {label}
          </div>
          <div style={{ fontWeight: 700, color: c, fontSize: '1rem' }}>{energy}</div>
        </div>
        <StatusBadge status={risk as any} size="sm" />
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        Dose range: <span style={{ color: c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{range}</span>
      </div>
      {/* Particle visualization */}
      <div style={{ marginBottom: '0.75rem', minHeight: '32px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {Array.from({ length: particles }, (_, i) => (
          <div
            key={i}
            style={{
              width: `${6 + (tier === 'LOW' ? 0 : tier === 'MEDIUM' ? 2 : 4)}px`,
              height: `${6 + (tier === 'LOW' ? 0 : tier === 'MEDIUM' ? 2 : 4)}px`,
              borderRadius: '50%',
              background: c,
              opacity: 0.7 + (i / particles) * 0.3,
              boxShadow: `0 0 ${4 + (tier === 'HIGH' ? 4 : 0)}px ${c}`,
            }}
          />
        ))}
      </div>
      {/* Dose bar */}
      <div className="comp-bar-bg">
        <div className="comp-bar-fill" style={{ width: barWidth, background: c, boxShadow: `0 0 6px ${c}` }} />
      </div>
    </div>
  );
};

export const RadiationAnalysis: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Physics Engine</div>
        <h2 className="section-heading">Radiation Analysis</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Physics-based calculations convert AI predictions into meaningful radiation exposure — turning numbers into life-safety decisions.
        </p>
      </div>

      {/* Formula pipeline */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          Six-Step Calculation Chain
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {formulaCards.map((card, i) => (
            <FormulaCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Final estimate */}
      <div
        className="glass-card-bright"
        style={{
          padding: '1.75rem',
          borderColor: 'rgba(245,158,11,0.4)',
          background: 'rgba(245,158,11,0.06)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '0.6rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          FINAL EXPOSURE ESTIMATE
        </div>
        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: 'var(--warn)', lineHeight: 1, marginBottom: '0.25rem', textShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
          {radiationAnalysis.absorbedDose.toFixed(2)}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Gray (Gy) — Absorbed Dose</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <StatusBadge status={radiationAnalysis.riskLevel} size="lg" glow />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
            Equivalent to astronaut body exposure during 72h EVA in elevated particle flux region
          </div>
        </div>
      </div>

      {/* Why Energy Matters */}
      <div>
        <div className="section-eyebrow" style={{ marginBottom: '4px' }}>Educational Context</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Why Does Energy Matter?</div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Two radiation events may contain a similar number of particles, but higher-energy particles can produce a much greater radiation impact. The particle's energy determines how deeply it penetrates — and how much damage it causes.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <EnergyLevel tier="LOW" label="LOW ENERGY" energy="Low Radiation" range="0 – 0.1 Gy" risk="LOW" particles={5} barWidth="12%" />
          <EnergyLevel tier="MEDIUM" label="HIGH ENERGY" energy="High Radiation" range="0.1 – 1.0 Gy" risk="MODERATE" particles={8} barWidth="55%" />
          <EnergyLevel tier="HIGH" label="VERY HIGH ENERGY" energy="Very High Radiation" range="> 1.0 Gy" risk="HIGH" particles={12} barWidth="92%" />
        </div>
      </div>
    </div>
  );
};
