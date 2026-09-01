import React, { useState } from 'react';
import StarBackground from './components/StarBackground';
import Sidebar, { type PageId } from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import LivePage from './pages/LivePage';
import PredictionSelection from './pages/PredictionSelection';
import TodayPredictionPage from './pages/TodayPredictionPage';
import FuturePredictionPage from './pages/FuturePredictionPage';
import AnalysisPage from './pages/AnalysisPage';
import SafeLocationPage from './pages/SafeLocationPage';
import SystemFlowPage from './pages/SystemFlowPage';
import HistoryPage from './pages/HistoryPage';
import SystemInfoPage from './pages/SystemInfoPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('overview');

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <OverviewPage onNavigate={handleNavigate} />;
      case 'live': return <LivePage />;
      case 'today': return <TodayPredictionPage />;
      case 'future': return <FuturePredictionPage />;
      case 'analysis': return <AnalysisPage />;
      case 'location': return <SafeLocationPage />;
      case 'flow': return <SystemFlowPage />;
      case 'history': return <HistoryPage />;
      case 'system': return <SystemInfoPage />;
      default: return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', position: 'relative' }}>
      {/* Animated star background */}
      <StarBackground />

      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <div key={activePage} className="animate-fade-in" style={{ opacity: 0 }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
