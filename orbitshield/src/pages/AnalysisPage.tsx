import React from 'react';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { radiationAnalysis } from '../data/mockData';

interface FormulaCardProps {
  step: number;
  name: string;
  symbol: string;
  formula: string;
  value: string;
  unit: string;
  explanation: string;
  color: string;
  delay?: number;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ step, name, symbol, formula, value, unit, explanation, color, delay = 0 }) => (
  <div
    className="glass-card animate-fade-in-up"
    style={{ padding: '24px', animationDelay: `${delay}s`, opacity: 0 }}
  >
    {/* Step badge */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '8px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 800, color,
      }}>
        {step}
      </div>
      <div style={{
        fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
        background: `${color}15`, color, border: `1px solid ${color}25`,
        fontWeight: 700, letterSpacing: '0.05em',
      }}>
        {symbol}
      </div>
    </div>

    {/* Name */}
    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '12px' }}>{name}</h3>

    {/* Formula */}
    <div style={{
      padding: '14px 18px', borderRadius: '10px', marginBottom: '16px',
      background: 'rgba(0,0,0,0.3)', border: `1px solid ${color}20`,
    }}>
      <div className="formula-display" style={{ color }}>{formula}</div>
    </div>

    {/* Value */}
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '6px',
      marginBottom: '12px', padding: '10px 14px',
      borderRadius: '8px', background: `${color}08`,
    }}>
      <span style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: '13px', color: '#64748b' }}>{unit}</span>
    </div>

    {/* Explanation */}
    <div style={{
      padding: '12px 14px', borderRadius: '8px',
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
        Plain English
      </div>
      <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{explanation}</p>
    </div>
  </div>
);

const analysisColors = ['#06b6d4', '#818cf8', '#22d3ee', '#f59e0b', '#10b981', '#f97316'];

const AnalysisPage: React.FC = () => {
  const a = radiationAnalysis;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #f59e0b, #06b6d4)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>RADIATION ANALYSIS</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Physics-based calculations convert AI predictions into meaningful radiation exposure metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Intro card */}
      <div className="animate-fade-in-up" style={{
        padding: '20px 24px', borderRadius: '14px', marginBottom: '28px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(6,182,212,0.06))',
        border: '1px solid rgba(245,158,11,0.2)',
        animationDelay: '0.1s', opacity: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FlaskConical size={24} color="#f59e0b" />
          <div style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>
            After the LSTM model predicts radiation levels, we apply <strong style={{ color: '#e2e8f0' }}>6 physics equations</strong> sequentially. 
            Each one transforms the raw prediction into a more specific and medically meaningful measurement — ultimately computing the actual radiation dose absorbed by an astronaut.
          </div>
        </div>
      </div>

      {/* Formula cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {a.calculations.map((calc, i) => (
          <FormulaCard
            key={calc.id}
            step={calc.id}
            name={calc.name}
            symbol={calc.symbol}
            formula={calc.formula}
            value={calc.value}
            unit={calc.unit}
            explanation={calc.explanation}
            color={analysisColors[i]}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* Final Exposure */}
      <div
        className="animate-fade-in-up"
        style={{
          padding: '32px 36px', borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.06))',
          border: '2px solid rgba(249,115,22,0.3)',
          animationDelay: '0.8s', opacity: 0,
          display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={28} color="#f97316" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Final Exposure Estimate
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Calculated from 6 sequential physics steps
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#f97316', lineHeight: 1, filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.4))' }}>
              {a.absorbedDose}
            </div>
            <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>{a.doseUnit} absorbed dose</div>
          </div>
          <StatusBadge status={a.finalRisk} size="lg" animated />
        </div>
      </div>

      {/* Energy Matters section */}
      <EnergyMattersSection />
    </div>
  );
};

const EnergyMattersSection: React.FC = () => {
  const levels = [
    {
      title: 'MINIMUM LEVEL', energy: 'Low Energy', radiation: 'Low Radiation',
      risk: 'Low Risk', range: '0 – 0.1 Gy', color: '#10b981',
      description: 'Particles have low energy. Radiation passes through easily. Minimal health impact.',
      barWidth: '20%', icon: '🟢',
    },
    {
      title: 'MAXIMUM LEVEL', energy: 'High Energy', radiation: 'High Radiation',
      risk: 'High Risk', range: '0.1 – 1.0 Gy', color: '#f59e0b',
      description: 'Particles have significant energy. Can penetrate materials. Moderate health concern.',
      barWidth: '60%', icon: '🟡',
    },
    {
      title: 'EXTREME LEVEL', energy: 'Very High Energy', radiation: 'Very High Radiation',
      risk: 'Very High Risk', range: '> 1.0 Gy', color: '#ef4444',
      description: 'Particles carry extreme energy. Deep penetration. Serious health and mission risk.',
      barWidth: '100%', icon: '🔴',
    },
  ];

  return (
    <div className="animate-fade-in-up" style={{ marginTop: '28px', animationDelay: '0.9s', opacity: 0 }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
          WHY DOES ENERGY MATTER?
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
          Two radiation events may contain a similar number of particles, but <strong style={{ color: '#94a3b8' }}>higher-energy particles can produce a much greater radiation impact</strong> — making energy level a critical safety factor.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {levels.map((l, i) => (
          <div
            key={i}
            className="glass-card"
            style={{ padding: '24px', borderColor: `${l.color}25` }}
          >
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{l.icon}</div>
            <div style={{ fontSize: '11px', color: l.color, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
              {l.title}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{l.energy}</div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>{l.radiation}</div>
            <div style={{ fontSize: '12px', color: l.color, fontWeight: 600, marginBottom: '16px' }}>{l.risk}</div>

            {/* Bar */}
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{
                height: '100%', width: l.barWidth,
                background: `linear-gradient(90deg, ${l.color}80, ${l.color})`,
                borderRadius: '4px', transition: 'width 1s ease',
              }} />
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
              borderRadius: '20px', background: `${l.color}12`, color: l.color,
              fontSize: '12px', fontWeight: 700, marginBottom: '12px',
            }}>
              Gray (Gy): {l.range}
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>{l.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPage;
