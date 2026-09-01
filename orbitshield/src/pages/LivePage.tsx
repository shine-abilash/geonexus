import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Cpu, Radio, Zap, ArrowDown } from 'lucide-react';
import RadiationChart from '../components/RadiationChart';
import { sepnetDetection } from '../data/mockData';

const LivePage: React.FC = () => {
  const { eventDetected, confidence, signalStrength, noiseLevel, processingTime } = sepnetDetection;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width, H = canvas.height;
    const layers = [[W * 0.1, 3], [W * 0.35, 5], [W * 0.6, 4], [W * 0.85, 2]];
    const nodes: { x: number; y: number; r: number; pulse: number }[] = [];

    layers.forEach(([x, count]) => {
      for (let i = 0; i < count; i++) {
        const spacing = H / (count + 1);
        nodes.push({ x: Number(x), y: spacing * (i + 1), r: 6, pulse: Math.random() * Math.PI * 2 });
      }
    });

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Connections
      let ni = 0;
      for (let l = 0; l < layers.length - 1; l++) {
        const layerCount = layers[l][1];
        const nextLayerCount = layers[l + 1][1];
        const nextOffset = layers.slice(0, l + 1).reduce((a, b) => a + b[1], 0);

        for (let i = 0; i < layerCount; i++) {
          for (let j = 0; j < nextLayerCount; j++) {
            const n1 = nodes[ni + i];
            const n2 = nodes[nextOffset + j];
            const alpha = 0.1 + 0.15 * Math.sin(frame * 0.03 + i + j);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Data particle
            const t = ((frame * 0.02 + i * 0.3 + j * 0.1) % 1);
            if (t < 0.6) {
              const px = n1.x + (n2.x - n1.x) * (t / 0.6);
              const py = n1.y + (n2.y - n1.y) * (t / 0.6);
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = eventDetected ? 'rgba(16, 185, 129, 0.8)' : 'rgba(6, 182, 212, 0.8)';
              ctx.fill();
            }
          }
        }
        ni += layerCount;
      }

      // Nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(frame * 0.04 + n.pulse);
        const r = n.r + pulse * 2;
        const alpha = 0.6 + pulse * 0.4;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2);
        grad.addColorStop(0, eventDetected ? `rgba(16,185,129,${alpha})` : `rgba(6,182,212,${alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = eventDetected ? `rgba(16,185,129,${alpha})` : `rgba(6,182,212,${alpha})`;
        ctx.fill();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [eventDetected]);

  // Scan progress animation
  useEffect(() => {
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const pipelineSteps = [
    { icon: <Radio size={16} />, label: 'Heavy-Ion Spectrometer', sub: 'Raw signal input', color: '#06b6d4' },
    { icon: <Zap size={16} />, label: 'Live Data Stream', sub: 'Pre-processing', color: '#818cf8' },
    { icon: <Cpu size={16} />, label: 'SEPNET Model', sub: 'Neural classification', color: '#22d3ee' },
    { icon: <CheckCircle2 size={16} />, label: 'Event Decision', sub: eventDetected ? 'Event Detected' : 'No Event', color: eventDetected ? '#10b981' : '#ef4444' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #06b6d4, #3b82f6)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>RADIATION EVENT DETECTION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              SEPNET checks the incoming radiation signal and determines whether it is a real radiation event.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Pipeline */}
        <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.1s', opacity: 0 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>
            Signal Pipeline
          </h3>
          {pipelineSteps.map((step, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: `${step.color}0d`, border: `1px solid ${step.color}20`,
              }}>
                <div style={{ color: step.color, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{step.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{step.sub}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.color, animation: 'live-pulse 2s ease-in-out infinite' }} />
                </div>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <ArrowDown size={14} color="#334155" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Event Status Card */}
        <div
          className="glass-card-static animate-fade-in-up"
          style={{
            padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            border: eventDetected ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            animationDelay: '0.2s', opacity: 0,
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: eventDetected
              ? 'radial-gradient(circle at 50% 30%, rgba(16,185,129,0.06) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.06) 0%, transparent 60%)',
          }} />

          <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase' }}>
            Event Status
          </div>

          <div style={{ marginBottom: '16px' }}>
            {eventDetected
              ? <CheckCircle2 size={56} color="#10b981" style={{ margin: '0 auto', filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.6))' }} />
              : <XCircle size={56} color="#ef4444" style={{ margin: '0 auto', filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.6))' }} />
            }
          </div>

          <div style={{ fontSize: '36px', fontWeight: 800, color: eventDetected ? '#10b981' : '#ef4444', marginBottom: '8px', letterSpacing: '0.05em' }}>
            {eventDetected ? 'TRUE' : 'FALSE'}
          </div>
          <div style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '24px' }}>
            {eventDetected ? 'Radiation event detected' : 'No significant event detected'}
          </div>

          {/* Confidence bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Detection Confidence</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: eventDetected ? '#10b981' : '#06b6d4' }}>{confidence}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${confidence}%`,
                background: `linear-gradient(90deg, ${eventDetected ? '#10b981' : '#06b6d4'}, ${eventDetected ? '#34d399' : '#22d3ee'})`,
                borderRadius: '3px', transition: 'width 1s ease',
              }} />
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Signal Strength', value: `${signalStrength}%`, color: '#06b6d4' },
              { label: 'Noise Level', value: `${noiseLevel}%`, color: '#f59e0b' },
              { label: 'Processing Time', value: processingTime, color: '#818cf8' },
              { label: 'Model Accuracy', value: '97.2%', color: '#10b981' },
            ].map(s => (
              <div key={s.label} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Net Visualization */}
        <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.3s', opacity: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              SEPNET Neural Network
            </h3>
            <span style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
              background: 'rgba(6,182,212,0.1)', color: '#06b6d4', fontWeight: 700,
            }}>LIVE</span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Watching the neural network process incoming radiation signals in real time.
          </p>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '200px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: '#334155' }}>
            <span>INPUT</span><span>HIDDEN</span><span>HIDDEN</span><span>OUTPUT</span>
          </div>

          {/* Scan bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Analysis Progress</span>
              <span style={{ fontSize: '11px', color: '#06b6d4' }}>{scanProgress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${scanProgress}%`,
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                borderRadius: '2px', transition: 'width 0.1s linear',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Radiation Chart */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '24px', animationDelay: '0.4s', opacity: 0 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
          Live Radiation Feed
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
          Real-time signal being analyzed by SEPNET
        </p>
        <RadiationChart height={220} showZones />
      </div>
    </div>
  );
};

export default LivePage;
