import React, { useRef, useEffect } from 'react';
import { Radio, Zap, Cpu, CheckCircle2, Brain, FlaskConical, MapPin, Shield, ArrowDown } from 'lucide-react';

interface PipelineStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  decision?: { yes: string; no: string };
}

const steps: PipelineStep[] = [
  { id: 'spectrometer', icon: <Radio size={22} />, title: 'Heavy-Ion Spectrometer', subtitle: 'Data Collection', description: 'Captures raw radiation particle data in real time from space', color: '#06b6d4' },
  { id: 'live', icon: <Zap size={22} />, title: 'Live Radiation Data', subtitle: 'Signal Processing', description: 'Raw signal is pre-processed and formatted for analysis', color: '#818cf8' },
  { id: 'sepnet', icon: <Cpu size={22} />, title: 'SEPNET Analysis', subtitle: 'Neural Classification', description: 'AI model classifies whether this is a real radiation event', color: '#22d3ee', decision: { yes: 'Real Event →', no: '← No Event' } },
  { id: 'choice', icon: <CheckCircle2 size={22} />, title: 'User Selects Model', subtitle: 'Prediction Setup', description: 'Choose between 24-hour or multi-day radiation forecast', color: '#f59e0b' },
  { id: 'lstm', icon: <Brain size={22} />, title: 'LSTM Model', subtitle: 'AI Prediction', description: 'Long Short-Term Memory network predicts future radiation levels', color: '#818cf8' },
  { id: 'physics', icon: <FlaskConical size={22} />, title: 'Physics Calculations', subtitle: '6 Sequential Formulas', description: 'Integral flux, fluence, spectral index, energy flux, stopping power, absorbed dose', color: '#f97316' },
  { id: 'dose', icon: <Shield size={22} />, title: 'Radiation Dose Estimate', subtitle: 'Medical Assessment', description: 'Final absorbed dose in Gray (Gy) — the key safety metric', color: '#10b981' },
  { id: 'compare', icon: <MapPin size={22} />, title: 'Location Comparison', subtitle: 'Safety Analysis', description: 'Predicted dose compared across all nearby mission locations', color: '#06b6d4' },
  { id: 'recommend', icon: <Shield size={22} />, title: 'Safe Location Selected', subtitle: '✓ Astronaut Safety', description: 'The safest location is recommended — mission can proceed safely', color: '#10b981' },
];

const SystemFlowPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particle flow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { y: number; speed: number; alpha: number; color: string }[] = [];
    const colors = ['#06b6d4', '#818cf8', '#10b981', '#f59e0b'];

    for (let i = 0; i < 20; i++) {
      particles.push({
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        alpha: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba');
        ctx.fill();
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #06b6d4, #10b981)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>COMPLETE SYSTEM FLOW</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              How ORBITSHIELD processes data — from raw spectrometer input to astronaut safety recommendation
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '0', alignItems: 'start' }}>
        {/* Left column */}
        <div>
          {steps.slice(0, Math.ceil(steps.length / 2)).map((step, i) => (
            <StepCard key={step.id} step={step} index={i} last={i === Math.ceil(steps.length / 2) - 1} />
          ))}
        </div>

        {/* Center pipe */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas ref={canvasRef} style={{ width: '2px', height: '100%', position: 'absolute' }} />
          <div style={{ width: 2, height: '100%', background: 'linear-gradient(180deg, #06b6d4, #818cf8, #10b981)', opacity: 0.2, borderRadius: '1px' }} />
        </div>

        {/* Right column */}
        <div style={{ paddingTop: '40px' }}>
          {steps.slice(Math.ceil(steps.length / 2)).map((step, i) => (
            <StepCard key={step.id} step={step} index={i + Math.ceil(steps.length / 2)} last={i === steps.length - Math.ceil(steps.length / 2) - 1} />
          ))}
        </div>
      </div>

      {/* Story Banner */}
      <div className="animate-fade-in-up" style={{
        marginTop: '32px', padding: '24px 28px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(16,185,129,0.06))',
        border: '1px solid rgba(6,182,212,0.15)',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '16px' }}>THE ORBITSHIELD STORY</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            'Radiation from Space', 'Spectrometer Detects It', 'SEPNET Verifies Event',
            'LSTM Predicts Future', 'Physics Calculates Dose', 'Locations Compared', 'Safest Place Found', 'Astronauts Safe',
          ].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span style={{ fontSize: '12px', color: '#64748b', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                {step}
              </span>
              {i < arr.length - 1 && <span style={{ color: '#334155' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepCard: React.FC<{ step: PipelineStep; index: number; last: boolean }> = ({ step, index, last }) => (
  <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}>
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '14px',
      padding: '16px 18px', borderRadius: '12px', marginBottom: '4px',
      background: 'var(--bg-card)', border: `1px solid ${step.color}20`,
      transition: 'all 0.3s ease',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${step.color}40`;
        (e.currentTarget as HTMLElement).style.background = `${step.color}06`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${step.color}20`;
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
      }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
        background: `${step.color}18`, border: `1px solid ${step.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color,
      }}>
        {step.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>{step.title}</div>
        <div style={{ fontSize: '11px', color: step.color, fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>{step.subtitle}</div>
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>{step.description}</div>
      </div>
    </div>
    {!last && (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
        <ArrowDown size={14} color="#334155" />
      </div>
    )}
  </div>
);

export default SystemFlowPage;
