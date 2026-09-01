import React from 'react';
import { Shield, Cpu, Brain, FlaskConical, Radio, Wifi, Server, Info } from 'lucide-react';

const SystemInfoPage: React.FC = () => {
  const systems = [
    {
      title: 'Heavy-Ion Spectrometer',
      description: 'Measures the energy and flux of heavy ions (charged particles) arriving from space. Provides the raw radiation data that feeds the entire system.',
      specs: [{ label: 'Type', value: 'Heavy-ion detector' }, { label: 'Energy range', value: '1–500 MeV/nucleon' }, { label: 'Update rate', value: 'Every 5 minutes' }, { label: 'Status', value: 'Online' }],
      icon: <Radio size={24} />, color: '#06b6d4',
    },
    {
      title: 'SEPNET Model',
      description: 'A convolutional neural network (CNN) trained to distinguish real Solar Energetic Particle (SEP) events from background noise and detector artifacts.',
      specs: [{ label: 'Type', value: 'Classification CNN' }, { label: 'Accuracy', value: '97.2%' }, { label: 'Input', value: 'Flux time series' }, { label: 'Output', value: 'Event probability' }],
      icon: <Cpu size={24} />, color: '#22d3ee',
    },
    {
      title: 'LSTM Model 1',
      description: 'Predicts the next 24 hours of radiation flux using the most recent 6 time steps. Optimized for short-term, high-accuracy forecasting.',
      specs: [{ label: 'Architecture', value: 'Stacked LSTM' }, { label: 'Input window', value: '6 timestamps' }, { label: 'Forecast horizon', value: '24 hours' }, { label: 'MAE', value: '0.038 Gy' }],
      icon: <Brain size={24} />, color: '#818cf8',
    },
    {
      title: 'LSTM Model 2',
      description: 'Extends the forecast to 48 hours (2 days) using a longer historical context window. Captures slower radiation trend changes for longer missions.',
      specs: [{ label: 'Architecture', value: 'Bidirectional LSTM' }, { label: 'Input window', value: '24 timestamps' }, { label: 'Forecast horizon', value: '48 hours' }, { label: 'MAE', value: '0.062 Gy' }],
      icon: <Brain size={24} />, color: '#a78bfa',
    },
    {
      title: 'Physics Engine',
      description: 'Converts AI predictions into medically meaningful radiation exposure metrics using 6 well-established space physics equations.',
      specs: [{ label: 'Calculations', value: '6 sequential' }, { label: 'Output metric', value: 'Absorbed dose (Gy)' }, { label: 'Standard', value: 'ICRP-60 / NASA-STD-3001' }, { label: 'Precision', value: '±5%' }],
      icon: <FlaskConical size={24} />, color: '#f59e0b',
    },
    {
      title: 'Safety Recommendation Engine',
      description: 'Compares predicted radiation exposure at all candidate locations and ranks them by safety score to guide astronaut positioning decisions.',
      specs: [{ label: 'Locations analyzed', value: '5 candidates' }, { label: 'Metric', value: 'Safety score (0–100)' }, { label: 'Update rate', value: 'Per prediction cycle' }, { label: 'Output', value: 'Safe location recommendation' }],
      icon: <Shield size={24} />, color: '#10b981',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #06b6d4, #10b981)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>SYSTEM INFORMATION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Technical specifications and descriptions of all ORBITSHIELD system components
            </p>
          </div>
        </div>
      </div>

      {/* System status bar */}
      <div className="animate-fade-in-up glass-card-static" style={{ padding: '16px 24px', marginBottom: '24px', animationDelay: '0.1s', opacity: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wifi size={16} color="#10b981" />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>All systems operational</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={16} color="#06b6d4" />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Data pipeline active</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'live-pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* System cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {systems.map((sys, i) => (
          <div
            key={sys.title}
            className="glass-card animate-fade-in-up"
            style={{ padding: '24px', animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: `${sys.color}18`, border: `1px solid ${sys.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: sys.color,
              }}>
                {sys.icon}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>{sys.title}</h3>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px' }}>
              {sys.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {sys.specs.map(spec => (
                <div key={spec.label} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>{spec.label}</div>
                  <div style={{ fontSize: '13px', color: sys.color, fontWeight: 600 }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* About card */}
      <div className="animate-fade-in-up" style={{
        padding: '28px 32px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(16,185,129,0.04))',
        border: '1px solid rgba(6,182,212,0.15)',
        animationDelay: '0.8s', opacity: 0,
      }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <Info size={24} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>About ORBITSHIELD</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8, marginBottom: '12px' }}>
              ORBITSHIELD is a space radiation intelligence system combining Heavy-Ion Spectrometry, deep learning (SEPNET + LSTM), 
              and space physics to provide real-time radiation monitoring and astronaut safety recommendations.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['NASA-compatible', 'ICRP-60 standard', 'Real-time AI', 'Mission-critical'].map(tag => (
                <span key={tag} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoPage;
