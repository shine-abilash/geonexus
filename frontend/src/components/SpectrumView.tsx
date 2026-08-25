import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Radio, ShieldCheck } from "lucide-react";

interface SpectrumProps {
  weatherData: any;
}

export default function SpectrumView({ weatherData }: SpectrumProps) {
  // Proton Channels from DB
  const flux_p1 = weatherData?.proton_flux?.flux_p1 || 0.25;
  const flux_p5 = weatherData?.proton_flux?.flux_p5 || 0.10;
  const flux_p10 = weatherData?.proton_flux?.flux_p10 || 0.05;
  const flux_p30 = weatherData?.proton_flux?.flux_p30 || 0.015;
  const flux_p50 = weatherData?.proton_flux?.flux_p50 || 0.005;
  const flux_p100 = weatherData?.proton_flux?.flux_p100 || 0.001;

  // Scientific Constants
  const M_P_C2_MEV = 938.272; // Rest mass energy of proton
  const SPEED_OF_LIGHT_KMS = 299792.458;

  // Calculate Relativistic Speed v given Energy E (MeV)
  const calculateSpeed = (energyMeV: number) => {
    const gamma = 1.0 + (energyMeV / M_P_C2_MEV);
    const beta = Math.sqrt(1.0 - (1.0 / (gamma * gamma)));
    const velocityKms = beta * SPEED_OF_LIGHT_KMS;
    return {
      beta: parseFloat(beta.toFixed(4)),
      velocityKms: Math.round(velocityKms),
      percentC: parseFloat((beta * 100).toFixed(1))
    };
  };

  // Build spectrum table and plot data
  const channels = [
    { name: ">1 MeV", energy: 1, flux: flux_p1 },
    { name: ">5 MeV", energy: 5, flux: flux_p5 },
    { name: ">10 MeV", energy: 10, flux: flux_p10 },
    { name: ">30 MeV", energy: 30, flux: flux_p30 },
    { name: ">50 MeV", energy: 50, flux: flux_p50 },
    { name: ">100 MeV", energy: 100, flux: flux_p100 }
  ];

  const chartData = channels.map(ch => {
    const speedInfo = calculateSpeed(ch.energy);
    return {
      energy: ch.energy,
      label: `${ch.energy} MeV`,
      flux: parseFloat(ch.flux.toFixed(4)),
      velocity: speedInfo.velocityKms,
      percentC: speedInfo.percentC
    };
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">PROTON ENERGY SPECTRUM</h2>
        <p className="text-xs text-slate-400 font-mono">Relativistic energy-velocity distributions and differential particle fluxes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Relativistic Physics Calculations Table */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 lg:col-span-1">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 mb-4 flex items-center gap-2">
            <Radio size={16} className="text-space-cyan animate-pulse" />
            <span>Relativistic Physics Log</span>
          </h3>
          
          <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-300">
            <p className="leading-tight text-slate-400 border-b border-slate-800 pb-3">
              Proton velocities calculated using relativistic mechanics:
              <br />
              <code className="text-space-cyan block mt-1 bg-space-950 p-1.5 rounded text-[10px] text-center border border-slate-800">
                v = c * sqrt(1 - 1/(1 + E/m_p*c²2)²)
              </code>
              where rest mass energy <code className="text-slate-200">m_p*c² ≈ 938.272 MeV</code>.
            </p>

            <div className="flex flex-col gap-2.5">
              {channels.map((ch) => {
                const speed = calculateSpeed(ch.energy);
                return (
                  <div key={ch.name} className="flex flex-col gap-1 border-b border-slate-800/50 pb-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-space-cyan">{ch.name} Channel</span>
                      <span className="text-slate-100">{ch.flux.toFixed(4)} pfu</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Velocity: {speed.velocityKms.toLocaleString()} km/s</span>
                      <span>({speed.percentC}% of light speed)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spectrum curve plot */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
            Differential Intensity Spectrum [J(E) vs Energy (MeV)]
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFlux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="energy" type="number" scale="log" domain={[1, 100]} name="Energy" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis scale="log" domain={[0.0001, 10]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontFamily: "monospace", fontSize: "11px" }}
                  itemStyle={{ color: "#f8fafc" }}
                  formatter={(value, name) => {
                    if (name === "flux") return [`${value} pfu`, "Flux"];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Energy Channel: ${label} MeV`}
                />
                <Area type="monotone" dataKey="flux" stroke="#ff003c" strokeWidth={2} fillOpacity={1} fill="url(#colorFlux)" name="flux" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-slate-400" />
            <span>Integrals indicate high-energy protons carry substantial penetrative risk, requiring thick crew shielding.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
