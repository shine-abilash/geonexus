import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Activity, Shield, BarChart3, RotateCcw, LayoutDashboard, 
  Settings as SettingsIcon, AlertOctagon, Radio, Compass, ShieldAlert, Play, Pause, SkipForward
} from "lucide-react";

// Import Components
import Dashboard from "./components/Dashboard";
import LiveMonitoring from "./components/LiveMonitoring";
import ForecastView from "./components/ForecastView";
import SpectrumView from "./components/SpectrumView";
import HistoricalReplay from "./components/HistoricalReplay";
import AstronautRisk from "./components/AstronautRisk";
import ModelPerformance from "./components/ModelPerformance";
import DataSources from "./components/DataSources";
import Settings from "./components/Settings";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // State variables shared across panels
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [astronautRisk, setAstronautRisk] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [replayStatus, setReplayStatus] = useState<any>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  
  // Timer references for polling
  const pollingInterval = useRef<any>(null);

  // Fetch all state
  const fetchData = async () => {
    try {
      // 1. Current Telemetry
      const resWeather = await axios.get(`${API_BASE}/space-weather/current`);
      setWeatherData(resWeather.data);
      setBackendOnline(true);
      
      // 2. Predictions & Alerts
      const resForecast = await axios.get(`${API_BASE}/sep/forecast`);
      setForecast(resForecast.data);
      
      // 3. Astronaut risk profile
      const resRisk = await axios.get(`${API_BASE}/astronaut/risk`);
      setAstronautRisk(resRisk.data);
      
      // 4. Alert history
      const resAlerts = await axios.get(`${API_BASE}/alerts`);
      setAlerts(resAlerts.data);
      
      // 5. Replay clock status
      const resReplay = await axios.get(`${API_BASE}/replay/status`);
      setReplayStatus(resReplay.data);
      
    } catch (err) {
      console.error("Error communicating with API backend:", err);
      setBackendOnline(false);
    }
  };

  // Start polling on mount
  useEffect(() => {
    fetchData();
    pollingInterval.current = setInterval(fetchData, 4000); // Poll every 4 seconds
    return () => clearInterval(pollingInterval.current);
  }, []);

  // Handlers for simulation playback
  const handlePlayPause = async () => {
    if (!replayStatus) return;
    try {
      const endpoint = replayStatus.is_active ? "stop" : "start";
      await axios.post(`${API_BASE}/replay/${endpoint}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStepForward = async () => {
    try {
      await axios.post(`${API_BASE}/replay/step`, { minutes: 10.0 });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledgeAlert = async (id: number) => {
    try {
      await axios.post(`${API_BASE}/alerts/acknowledge/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Determine current active alert level (GREEN, YELLOW, ORANGE, RED)
  const currentRiskLevel = astronautRisk?.risk_level || "GREEN";

  const getAlertBorderClass = () => {
    switch (currentRiskLevel) {
      case "RED": return "border-red-600 bg-red-950/20";
      case "ORANGE": return "border-orange-500 bg-orange-950/20";
      case "YELLOW": return "border-yellow-500 bg-yellow-950/20";
      default: return "border-emerald-500 bg-emerald-950/10";
    }
  };

  const getAlertTextClass = () => {
    switch (currentRiskLevel) {
      case "RED": return "text-red-500 glow-text-red";
      case "ORANGE": return "text-orange-500 glow-text-orange";
      case "YELLOW": return "text-yellow-400 glow-text-yellow";
      default: return "text-emerald-400 glow-text-green";
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none">
      
      {/* 1. TOP HEADER DISCLOSURE AND STATUS BAR */}
      <header className="border-b border-slate-800 bg-space-900/90 sticky top-0 z-50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-space-cyan animate-pulse" />
          <div>
            <h1 className="text-lg font-bold tracking-wider font-mono text-slate-100 uppercase">
              ASTROSHIELD AI
            </h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>SIMULATION TIME:</span>
              <span className="text-space-cyan font-bold">
                {weatherData?.timestamp ? new Date(weatherData.timestamp).toUTCString() : "CONNECTING..."}
              </span>
              <span className="px-1 text-slate-600">|</span>
              <span>MODE:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                weatherData?.data_mode === "LIVE" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-cyan-500/10 text-space-cyan border border-cyan-500/20"
              }`}>
                {weatherData?.data_mode || "DISCONNECTED"}
              </span>
            </p>
          </div>
        </div>
        
        {/* Playback Indicator controls inside top header */}
        {weatherData?.data_mode === "SIMULATION" && (
          <div className="flex items-center gap-2 bg-space-850 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 mr-2 text-[10px]">SIM CONTROLS:</span>
            <button 
              onClick={handlePlayPause}
              className="hover:text-space-cyan p-1 transition" 
              title={replayStatus?.is_active ? "Pause" : "Play"}
            >
              {replayStatus?.is_active ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
            </button>
            <button 
              onClick={handleStepForward}
              className="hover:text-space-cyan p-1 transition"
              title="Step 10 Min Forward"
            >
              <SkipForward size={14} />
            </button>
            <span className="text-slate-500 px-1">|</span>
            <span className="text-slate-300 font-bold">{replayStatus?.speed_multiplier}x speed</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className={`h-2.5 w-2.5 rounded-full ${backendOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-slate-400 font-mono">{backendOnline ? "TELEMETRY API ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* PERSISTENT SPACE SAFETY DISCLAIMER BANNER */}
      <div className="bg-red-950/40 border-b border-red-900/50 py-1.5 px-6 text-center text-xs text-red-300 font-mono tracking-wide">
        ⚠️ RESEARCH & DECISION-SUPPORT PROTOTYPE. NOT FLIGHT CERTIFIED. DO NOT USE FOR CRITICAL AUTONOMOUS ASTRONAUT RADIATION SAFETY DECISIONS.
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT SIDE NAVIGATION */}
        <aside className="w-64 border-r border-slate-800 bg-space-950/70 p-4 flex flex-col gap-6 select-none shrink-0">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-3">Mission Operations</div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "dashboard" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard Console</span>
              </button>
              <button 
                onClick={() => setActiveTab("live")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "live" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <Activity size={16} />
                <span>Telemetry Ingest</span>
              </button>
              <button 
                onClick={() => setActiveTab("forecast")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "forecast" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <BarChart3 size={16} />
                <span>SEP Forecast</span>
              </button>
              <button 
                onClick={() => setActiveTab("spectrum")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "spectrum" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <Radio size={16} />
                <span>Proton Spectrum</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-3">Astronaut Shielding</div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("risk")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "risk" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <Shield size={16} />
                <span>Dose Risk & Map</span>
              </button>
              <button 
                onClick={() => setActiveTab("replay")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "replay" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <RotateCcw size={16} />
                <span>Event Replay</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-3">System Metrics</div>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("performance")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "performance" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <Compass size={16} />
                <span>Model Benchmarks</span>
              </button>
              <button 
                onClick={() => setActiveTab("sources")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "sources" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <AlertOctagon size={16} />
                <span>Data Ingest Health</span>
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition ${activeTab === "settings" ? "bg-space-cyan/15 text-space-cyan font-bold border-l-2 border-space-cyan" : "text-slate-400 hover:bg-space-800/40 hover:text-slate-200"}`}
              >
                <SettingsIcon size={16} />
                <span>Warning Levels</span>
              </button>
            </nav>
          </div>

          {/* Quick status box at sidebar bottom */}
          <div className={`mt-auto p-3 rounded-lg border flex flex-col gap-1 text-xs font-mono transition ${getAlertBorderClass()}`}>
            <span className="text-[9px] text-slate-500 tracking-wider">ASTRONAUT RISK STATUS</span>
            <span className={`text-base font-bold uppercase tracking-wider ${getAlertTextClass()}`}>
              {currentRiskLevel}
            </span>
            <span className="text-[10px] text-slate-300 leading-tight">
              {astronautRisk?.recommended_zone === "Zone A" ? "Normal Operations" : `MOVE TO ${astronautRisk?.recommended_zone}`}
            </span>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-space-950/20">
          {activeTab === "dashboard" && (
            <Dashboard 
              weatherData={weatherData} 
              forecast={forecast} 
              astronautRisk={astronautRisk} 
              alerts={alerts}
              onAckAlert={handleAcknowledgeAlert}
            />
          )}
          {activeTab === "live" && (
            <LiveMonitoring weatherData={weatherData} />
          )}
          {activeTab === "forecast" && (
            <ForecastView forecast={forecast} weatherData={weatherData} />
          )}
          {activeTab === "spectrum" && (
            <SpectrumView weatherData={weatherData} />
          )}
          {activeTab === "replay" && (
            <HistoricalReplay replayStatus={replayStatus} onRefresh={fetchData} />
          )}
          {activeTab === "risk" && (
            <AstronautRisk astronautRisk={astronautRisk} onRefresh={fetchData} />
          )}
          {activeTab === "performance" && (
            <ModelPerformance />
          )}
          {activeTab === "sources" && (
            <DataSources />
          )}
          {activeTab === "settings" && (
            <Settings onRefresh={fetchData} />
          )}
        </main>
      </div>
    </div>
  );
}
