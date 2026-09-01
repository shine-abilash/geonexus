import React from 'react';
import { CalendarClock, Calendar, Brain, ArrowRight } from 'lucide-react';
import type { PageId } from '../components/Sidebar';

interface PredictionSelectionProps {
  onNavigate: (page: PageId) => void;
  activePage: PageId;
}

const PredictionSelection: React.FC<PredictionSelectionProps> = ({ onNavigate, activePage }) => {
  const cards = [
    {
      id: 'today' as PageId,
      title: "TODAY'S PREDICTION",
      icon: <CalendarClock size={32} />,
      color: '#818cf8',
      gradient: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(99,102,241,0.05))',
      border: 'rgba(129,140,248,0.3)',
      glowBorder: 'rgba(129,140,248,0.6)',
      model: 'LSTM MODEL 1',
      description: 'Predict radiation for the next 24 hours using recent radiation history.',
      input: 'Previous 6 timestamps',
      output: 'Next 24 hours',
      button: "VIEW TODAY'S PREDICTION",
    },
    {
      id: 'future' as PageId,
      title: 'FUTURE DAYS PREDICTION',
      icon: <Calendar size={32} />,
      color: '#22d3ee',
      gradient: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(6,182,212,0.05))',
      border: 'rgba(34,211,238,0.3)',
      glowBorder: 'rgba(34,211,238,0.6)',
      model: 'LSTM MODEL 2',
      description: 'Predict radiation trends for the upcoming days.',
      input: 'Previous radiation data',
      output: 'Next 2 days',
      button: 'VIEW FUTURE PREDICTION',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <div className="animate-fade-in-up" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: 4, height: 40, borderRadius: '2px', background: 'linear-gradient(180deg, #818cf8, #06b6d4)' }} />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#e2e8f0' }}>CHOOSE YOUR PREDICTION</h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Select a prediction model to forecast radiation levels
            </p>
          </div>
        </div>
      </div>

      {/* LSTM Explanation */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: '20px 24px', marginBottom: '28px', animationDelay: '0.1s', opacity: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={24} color="#818cf8" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>What is LSTM?</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              <strong style={{ color: '#94a3b8' }}>LSTM (Long Short-Term Memory)</strong> is an AI model that learns from past radiation patterns to predict future behavior. 
              It remembers how radiation changed over time and uses that information to make accurate forecasts — similar to how a weather forecast works, but for space radiation.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {cards.map((card, i) => {
          const isActive = activePage === card.id;
          return (
            <div
              key={card.id}
              className="animate-fade-in-up"
              style={{
                background: isActive ? card.gradient : 'var(--bg-card)',
                border: `2px solid ${isActive ? card.glowBorder : card.border}`,
                borderRadius: '20px',
                padding: '32px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 30px ${card.color}25` : 'none',
                animationDelay: `${0.1 + i * 0.15}s`,
                opacity: 0,
              }}
              onClick={() => onNavigate(card.id)}
            >
              {/* Icon */}
              <div style={{
                width: 64, height: 64, borderRadius: '16px',
                background: `${card.color}18`,
                border: `1px solid ${card.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color, marginBottom: '20px',
              }}>
                {card.icon}
              </div>

              {/* Title */}
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#e2e8f0', marginBottom: '12px', letterSpacing: '0.02em' }}>
                {card.title}
              </div>

              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px' }}>
                {card.description}
              </p>

              {/* Model info */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.25)', marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: card.color, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>
                  {card.model}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{card.input}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output</div>
                    <div style={{ fontSize: '13px', color: card.color, fontWeight: 500 }}>{card.output}</div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={e => { e.stopPropagation(); onNavigate(card.id); }}
                style={{
                  width: '100%', padding: '14px 20px',
                  background: `linear-gradient(135deg, ${card.color}30, ${card.color}15)`,
                  border: `1px solid ${card.color}50`,
                  borderRadius: '12px', color: card.color,
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.03em',
                }}
              >
                {card.button}
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionSelection;
