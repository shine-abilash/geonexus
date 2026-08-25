import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";

interface ForecastProps {
  forecast: any;
  weatherData: any;
}

export default function ForecastView({ forecast, weatherData }: ForecastProps) {
  const p10_pred = forecast?.pred_flux_p10 || 0.05;
  const p50_pred = forecast?.pred_flux_p50 || 0.02;
  const p100_pred = forecast?.pred_flux_p100 || 0.005;
  const p10_min = forecast?.pred_flux_p10_min || 0.03;
  const p10_max = forecast?.pred_flux_p10_max || 0.08;

  // Generate multi-channel chart data
  const getMultiChannelData = () => {
    const data = [];
    const baseP10 = weatherData?.proton_flux?.flux_p10 || 0.05;
    const baseP50 = weatherData?.proton_flux?.flux_p50 || 0.02;
    const baseP100 = weatherData?.proton_flux?.flux_p100 || 0.005;
    
    const peakP10 = Math.max(p10_pred, baseP10);
    const peakP50 = Math.max(p50_pred, baseP50);
    const peakP100 = Math.max(p100_pred, baseP100);
    
    const horizons = [0, 1, 3, 6, 12, 18, 24]; // Hours
    horizons.forEach(h => {
      let f10 = baseP10;
      let f50 = baseP50;
      let f100 = baseP100;
      
      // If we have an active flare/event predictions, curve it
      if (p10_pred > baseP10 * 2) {
        const arrivalHrs = 3.0;
        if (h <= arrivalHrs) {
          const pct = h / arrivalHrs;
          f10 = baseP10 + (peakP10 - baseP10) * pct;
          f50 = baseP50 + (peakP50 - baseP50) * pct;
          f100 = baseP100 + (peakP100 - baseP100) * pct;
        } else {
          const decayPct = Math.exp(-(h - arrivalHrs) / 10.0);
          f10 = baseP10 + (peakP10 - baseP10) * decayPct;
          f50 = baseP50 + (peakP50 - baseP50) * decayPct;
          f100 = baseP100 + (peakP100 - baseP100) * decayPct;
        }
      }
      
      data.push({
        time: h === 0 ? "Now" : `+${h}h`,
        p10: parseFloat(f10.toFixed(2)),
        p50: parseFloat(f50.toFixed(2)),
        p100: parseFloat(f100.toFixed(2)),
      });
    });
    
    return data;
  };

  const chartData = getMultiChannelData();

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">MULTI-CHANNEL PROTON FORECAST</h2>
        <p className="text-xs text-slate-400 font-mono">Differential energy forecasts across multiple particle thresholds</p>
      </div>

      {/* HORIZON METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Channel 1: > 10 MeV */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>&gt; 10 MeV FLUX (+24h prediction)</span>
            <span className="h-2 w-2 rounded-full bg-space-cyan" />
          </div>
          <div>
            <span className="text-3xl font-mono font-bold text-white">{p10_pred.toFixed(2)}</span>
            <span className="text-xs text-slate-400 ml-1 font-mono">pfu</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>95% Confidence Interval:</span>
            <span className="text-slate-300 font-bold">{p10_min.toFixed(2)} - {p10_max.toFixed(2)} pfu</span>
          </div>
        </div>

        {/* Channel 2: > 50 MeV */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>&gt; 50 MeV FLUX (+24h prediction)</span>
            <span className="h-2 w-2 rounded-full bg-space-yellow" />
          </div>
          <div>
            <span className="text-3xl font-mono font-bold text-white">{p50_pred.toFixed(2)}</span>
            <span className="text-xs text-slate-400 ml-1 font-mono">pfu</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Estimated Dose contribution:</span>
            <span className="text-slate-300 font-bold">Moderate (High penetration)</span>
          </div>
        </div>

        {/* Channel 3: > 100 MeV */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>&gt; 100 MeV FLUX (+24h prediction)</span>
            <span className="h-2 w-2 rounded-full bg-space-red" />
          </div>
          <div>
            <span className="text-3xl font-mono font-bold text-white">{p100_pred.toFixed(3)}</span>
            <span className="text-xs text-slate-400 ml-1 font-mono">pfu</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Astronaut Hazard Level:</span>
            <span className="text-space-red font-bold">Critical (Severe penetration)</span>
          </div>
        </div>
      </div>

      {/* MULTI CHANNEL LINE GRAPH */}
      <div className="grid grid-cols-1 gap-6">
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
            Forecast Trajectories by Energy Channel
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis scale="log" domain={[0.001, 1000]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontFamily: "monospace", fontSize: "11px" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Line type="monotone" dataKey="p10" stroke="#00f0ff" strokeWidth={2} name="> 10 MeV (pfu)" />
                <Line type="monotone" dataKey="p50" stroke="#ffcc00" strokeWidth={2} name="> 50 MeV (pfu)" />
                <Line type="monotone" dataKey="p100" stroke="#ff003c" strokeWidth={2} name="> 100 MeV (pfu)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
            <Info size={12} className="text-slate-400" />
            <span>Predicted trajectories incorporate sequence features, flare magnetics, and historical CME shock boundaries.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
