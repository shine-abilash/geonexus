import React from 'react';

// ─── Animated neural-network SVG ────────────────────────────────────────────
export const NeuralNetwork: React.FC = () => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const layers = [
    [{ x: 40, y: 80 }, { x: 40, y: 140 }, { x: 40, y: 200 }],
    [{ x: 110, y: 60 }, { x: 110, y: 120 }, { x: 110, y: 180 }, { x: 110, y: 240 }],
    [{ x: 180, y: 80 }, { x: 180, y: 160 }, { x: 180, y: 210 }],
    [{ x: 240, y: 140 }],
  ];

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach(a => layers[l + 1].forEach(b => edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })));
  }

  return (
    <svg viewBox="0 0 280 300" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          stroke={`rgba(0,200,255,${0.1 + (i % 3) * 0.07})`}
          strokeWidth="1"
        />
      ))}
      {/* Animated signal dot */}
      {edges.filter((_, i) => i % 4 === tick % 4).map((e, i) => (
        <circle
          key={`sig-${i}`}
          cx={e.x1 + (e.x2 - e.x1) * ((tick * 0.2) % 1)}
          cy={e.y1 + (e.y2 - e.y1) * ((tick * 0.2) % 1)}
          r="3"
          fill="var(--ion)"
          style={{ filter: 'drop-shadow(0 0 4px var(--ion))' }}
        />
      ))}
      {layers.flat().map((n, i) => (
        <circle
          key={`n-${i}`}
          cx={n.x} cy={n.y}
          r={i === layers.flat().length - 1 ? 9 : 6}
          fill={i === layers.flat().length - 1 ? 'var(--safe)' : 'var(--ion)'}
          opacity={0.7 + (tick % 3 === i % 3 ? 0.3 : 0)}
          style={{ filter: `drop-shadow(0 0 ${i === layers.flat().length - 1 ? 8 : 4}px ${i === layers.flat().length - 1 ? 'var(--safe)' : 'var(--ion)'})`, transition: 'opacity 0.3s' }}
        />
      ))}
    </svg>
  );
};

// ─── System flow pipeline ──────────────────────────────────────────────────
interface PipelineStepProps {
  label: string;
  sublabel?: string;
  active?: boolean;
  isResult?: boolean;
}

export const PipelineStep: React.FC<PipelineStepProps> = ({ label, sublabel, active, isResult }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={`glass-card ${active ? 'glass-card-bright' : ''}`}
        style={{
          padding: '0.6rem 1rem',
          display: 'inline-block',
          minWidth: '160px',
          borderColor: isResult ? 'rgba(34,197,94,0.4)' : active ? 'var(--border-bright)' : undefined,
          background: isResult ? 'rgba(34,197,94,0.08)' : active ? 'rgba(0,200,255,0.1)' : undefined,
        }}
      >
        <div style={{
          fontSize: '0.7rem', fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: isResult ? 'var(--safe)' : active ? 'var(--ion)' : 'var(--text-secondary)',
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
};

// ─── Animated flow connector ────────────────────────────────────────────────
export const FlowArrow: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
    <div className="flow-line" />
    {label && (
      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: "'JetBrains Mono',monospace" }}>
        {label}
      </div>
    )}
  </div>
);
