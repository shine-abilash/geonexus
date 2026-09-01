import React, { useState } from 'react';
import { Sidebar, type PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { Starfield } from './components/Starfield';
import { MissionOverview } from './pages/MissionOverview';
import { LiveRadiation } from './pages/LiveRadiation';
import { TodayPrediction } from './pages/TodayPrediction';
import { FuturePrediction } from './pages/FuturePrediction';
import { RadiationAnalysis } from './pages/RadiationAnalysis';
import { SafeLocation } from './pages/SafeLocation';
import { PredictionHistory, SystemFlow } from './pages/SystemPages';

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  'overview':           { title: 'Space Radiation Monitoring', subtitle: 'AI-powered radiation prediction and astronaut safety system' },
  'live-radiation':     { title: 'Live Radiation Feed',        subtitle: 'Real-time heavy-ion spectrometer data stream' },
  'today-prediction':   { title: "Today's Radiation Prediction", subtitle: 'LSTM Model 1 — Next 24 Hours' },
  'future-prediction':  { title: 'Future Radiation Prediction', subtitle: 'LSTM Model 2 — Next 48 Hours' },
  'radiation-analysis': { title: 'Radiation Analysis',          subtitle: 'Physics-based exposure and dose calculations' },
  'safe-location':      { title: 'Safe Location Recommendation', subtitle: 'Radiation-ranked location comparison for astronaut safety' },
  'history':            { title: 'Prediction History',           subtitle: 'Archive of past model predictions and accuracy metrics' },
  'system-info':        { title: 'System Information',           subtitle: 'Complete data pipeline and mission flow' },
};

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = pageMeta[activePage];

  const renderPage = () => {
    switch (activePage) {
      case 'overview':           return <MissionOverview onNavigate={setActivePage} />;
      case 'live-radiation':     return <LiveRadiation />;
      case 'today-prediction':   return <TodayPrediction />;
      case 'future-prediction':  return <FuturePrediction />;
      case 'radiation-analysis': return <RadiationAnalysis />;
      case 'safe-location':      return <SafeLocation />;
      case 'history':            return <PredictionHistory />;
      case 'system-info':        return <SystemFlow />;
      default:                   return <MissionOverview onNavigate={setActivePage} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--void)',
      position: 'relative',
    }}>
      <Starfield />

      {/* Sidebar */}
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          zIndex: 40,
        }}
        className="desktop-sidebar"
      >
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuToggle={() => setMenuOpen(o => !o)}
          menuOpen={menuOpen}
        />
        <main style={{
          flex: 1,
          padding: 'clamp(1rem, 3vw, 1.75rem)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {renderPage()}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            position: fixed !important;
            left: 0; top: 0; height: 100vh;
            transform: ${menuOpen ? 'translateX(0)' : 'translateX(-100%)'};
            transition: transform 0.3s ease;
            z-index: 50;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
