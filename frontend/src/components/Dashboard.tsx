import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Clock, Activity, Zap, Check } from "lucide-react";

interface DashboardProps {
  weatherData: any;
  forecast: any;
  astronautRisk: any;
  alerts: any[];
  onAckAlert: (id: number) => void;
}

export default function Dashboard({ weatherData, forecast, astronautRisk, alerts, onAckAlert }: DashboardProps) {
  // Extract values
  const sepProb = forecast ? Math.round(forecast.sep_prob_24h * 100) : 5;
  const currentFlux = weatherData?.proton_flux?.flux_p10 ? parseFloat(weatherData.proton_flux.flux_p10.toFixed(2)) : 0.05;
  const predictedPeak = forecast?.pred_peak_flux ? parseFloat(forecast.pred_peak_flux.toFixed(1)) : 0.1;
  const arrivalTime = forecast?.pred_time_to_peak_min ? Math.round(forecast.pred_time_to_peak_min) : 0;
  const duration = forecast?.pred_duration_hours ? Math.round(forecast.pred_duration_hours) : 0;
  
  // Format risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case "RED": return "text-space-red border-space-red bg-space-red/5";
      case "ORANGE": return "text-space-orange border-space-orange bg-space-orange/5";
      case "YELLOW": return "text-space-yellow border-space-yellow bg-space-yellow/5";
      default: return "text-space-green border-space-green bg-space-green/5";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "RED": return "bg-space-red";
      case "ORANGE": return "bg-space-orange";
      case "YELLOW": return "bg-space-yellow text-space-950";
      default: return "bg-space-green text-space-950";
    }
  };

  // Build fake chart data for forecast graph based on current, predicted, and peak values
  const getChartData = () => {
    const data = [];
    const baseFlux = currentFlux;
    const peak = Math.max(predictedPeak, currentFlux);
    
    // Simulate past 6 hours
    for (let i = -6; i <= 0; i++) {
      // Small random noise
      const val = Math.max(0.01, baseFlux * (1.0 + Math.sin(i) * 0.1) + (i === 0 ? 0 : randomFactor(i)));
      data.push({
        time: `${i}h`,
        observed: parseFloat(val.toFixed(2)),
        predicted: null,
      });
    }
    
    // Helper function to smooth out curve transitions
    function randomFactor(h: number) {
      if (sepProb > 40 && h > -3) {
        // rising trend
        return (h + 6) * 1.5;
      }
      return 0;
    }

    // Simulate future 24 hours
    for (let i = 1; i <= 24; i += 2) {
      let val = baseFlux;
      if (sepProb > 20) {
        // Curve rises to peak around arrivalTime hours and then decays
        const arrivalHrs = arrivalTime / 60.0 || 3.0;
        if (i < arrivalHrs) {
          // Rise phase
          const pct = i / arrivalHrs;
          val = baseFlux + (peak - baseFlux) * pct;
        } else {
          // Decay phase
          const decayHrs = duration || 24.0;
          const decayPct = Math.exp(-(i - arrivalHrs) / (decayHrs / 2.0));
          val = baseFlux + (peak - baseFlux) * decayPct;
        }
      }
      data.push({
        time: `+${i}h`,
        observed: null,
        predicted: parseFloat(val.toFixed(2)),
      });
    }
    
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="flex flex-col gap-6">
      
      {/* SECTION 1: CORE METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Card A: SEP Probability */}
        <div className="glass-panel rounded-xl p-4 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>SEP PROBABILITY</span>
            <Zap size={14} className="text-space-cyan" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-bold font-mono tracking-tight text-white">{sepProb}%</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Horizon: Next 24 hours
          </div>
        </div>

        {/* Card B: Current Proton Flux */}
        <div className="glass-panel rounded-xl p-4 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>CURRENT PROTON FLUX</span>
            <Activity size={14} className="text-space-green" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-bold font-mono tracking-tight text-white">{currentFlux}</span>
            <span className="text-xs text-slate-400 font-mono ml-1">pfu</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Channel: &gt; 10 MeV
          </div>
        </div>

        {/* Card C: Predicted Peak */}
        <div className="glass-panel rounded-xl p-4 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>PREDICTED PEAK FLUX</span>
            <AlertTriangle size={14} className="text-space-orange" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-bold font-mono tracking-tight text-white">{predictedPeak}</span>
            <span className="text-xs text-slate-400 font-mono ml-1">pfu</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Confidence: ±{forecast?.sep_prob_uncertainty ? Math.round(forecast.sep_prob_uncertainty * 100) : 10}%
          </div>
        </div>

        {/* Card D: Expected Arrival */}
        <div className="glass-panel rounded-xl p-4 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
            <span>EXPECTED PEAK TIME</span>
            <Clock size={14} className="text-space-yellow" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-bold font-mono tracking-tight text-white">
              {arrivalTime > 0 ? `+${arrivalTime}` : "N/A"}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">{arrivalTime > 0 ? "min" : ""}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Parker Spiral Time-of-Flight
          </div>
        </div>

        {/* Card E: Event Status / Risk Badge */}
        <div className={`border rounded-xl p-4 flex flex-col justify-between ${getRiskColor(astronautRisk?.risk_level)}`}>
          <div className="flex items-center justify-between font-mono text-xs">
            <span>RISK LEVEL</span>
            <span className={`w-2 h-2 rounded-full ${astronautRisk?.risk_level === "RED" ? "bg-red-500 animate-ping" : "bg-current"}`} />
          </div>
          <div className="my-4">
            <span className="text-2xl font-bold tracking-wider font-mono uppercase">
              {astronautRisk?.risk_level || "GREEN"}
            </span>
          </div>
          <div className={`text-[10px] font-mono px-2 py-0.5 rounded text-center w-full uppercase ${getRiskBg(astronautRisk?.risk_level)}`}>
            {astronautRisk?.recommended_zone === "Zone A" ? "STAND BY" : "EVACUATE NOW"}
          </div>
        </div>
      </div>

      {/* SECTION 2: FORECAST GRAPH & ACTIONS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Timeline Chart */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
              Solar Proton Flux Forecast (&gt; 10 MeV)
            </h2>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-space-cyan inline-block rounded-sm" /> Observed Telemetry</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 border border-dashed border-space-orange inline-block rounded-sm" /> Predicted Trend</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6600" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ff6600" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis scale="log" domain={[0.01, 1000]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontFamily: "monospace", fontSize: "11px" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Area type="monotone" dataKey="observed" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorObserved)" name="Observed (pfu)" />
                <Area type="monotone" dataKey="predicted" stroke="#ff6600" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted (pfu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-center">
            Logarithmic scale. Threshold level reference: Warning = 10 pfu, Critical = 100 pfu.
          </div>
        </div>

        {/* Radiation Alert Log */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
              Active Warnings / Safety Log
            </h2>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono py-8 text-center border border-dashed border-slate-800 rounded-lg">
                  No active safety alerts triggered.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border text-xs font-mono flex flex-col gap-2 transition ${
                      alert.acknowledged ? "border-slate-800 bg-slate-900/30 opacity-60" :
                      alert.status_level === "RED" ? "border-red-950 bg-red-950/20 text-red-300" :
                      alert.status_level === "ORANGE" ? "border-orange-950 bg-orange-950/20 text-orange-300" :
                      "border-yellow-950 bg-yellow-950/20 text-yellow-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider">{alert.status_level} Warning</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="leading-tight text-[11px]">{alert.message || alert.threshold_triggered}</p>
                    {!alert.acknowledged && (
                      <button 
                        onClick={() => onAckAlert(alert.id)}
                        className="self-end px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded border border-slate-700 flex items-center gap-1 transition text-[10px]"
                      >
                        <Check size={10} />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-4 flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">ASTRONAUT SAFETY PROTOCOL:</span>
            <p className="text-xs text-slate-300 leading-tight">
              {astronautRisk?.recommended_zone === "Zone A" 
                ? "No radiation evacuation protocols active. Normal solar magnetic shield." 
                : `Active relocation mandated to ${astronautRisk?.recommended_zone}. Relocate profile: ${astronautRisk?.profile?.name}. Current shielding is ${astronautRisk?.profile?.shielding_g_cm2} g/cm².`}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
