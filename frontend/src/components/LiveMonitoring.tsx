import { Compass, Flame, Wind } from "lucide-react";

interface LiveProps {
  weatherData: any;
}

export default function LiveMonitoring({ weatherData }: LiveProps) {
  // Extract values
  const xray_long = weatherData?.solar?.xray_flux_long || 1e-7;
  const xray_short = weatherData?.solar?.xray_flux_short || 1e-8;
  const unsigned_flux = weatherData?.solar?.unsigned_magnetic_flux || 1.2e22;
  const mean_field = weatherData?.solar?.mean_magnetic_field || 250.0;
  
  const sw_speed = weatherData?.solar_wind?.speed || 400.0;
  const sw_density = weatherData?.solar_wind?.density || 5.0;
  const sw_temp = weatherData?.solar_wind?.temperature || 80000.0;
  const B_tot = weatherData?.solar_wind?.B_total || 5.0;
  const Bz = weatherData?.solar_wind?.Bz || 0.0;
  const Bx = weatherData?.solar_wind?.Bx || 0.0;
  const By = weatherData?.solar_wind?.By || 0.0;
  const dyn_press = weatherData?.solar_wind?.dynamic_pressure || 1.5;

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider font-mono text-white">TELEMETRY INGEST STATUS</h2>
          <p className="text-xs text-slate-400 font-mono">Real-time solar observations and solar wind stream status</p>
        </div>
      </div>

      {/* THREE PANELS: SOLAR AR, SOLAR WIND, IMF */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel 1: Solar Active Region Status */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider">
            <Flame size={16} className="text-space-cyan" />
            <span>Active Region Magnetics</span>
          </div>
          
          <div className="flex flex-col gap-3 font-mono text-xs mt-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">X-Ray Flux (0.1-0.8 nm):</span>
              <span className="text-slate-200 font-bold">{xray_long.toExponential(2)} W/m²</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">X-Ray Flux (0.05-0.4 nm):</span>
              <span className="text-slate-200 font-bold">{xray_short.toExponential(2)} W/m²</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Unsigned Magnetic Flux:</span>
              <span className="text-slate-200 font-bold">{unsigned_flux.toExponential(2)} Mx</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Mean Magnetic Field Strength:</span>
              <span className="text-slate-200 font-bold">{mean_field.toFixed(1)} G</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Magnetic Helicity Proxy:</span>
              <span className="text-slate-200 font-bold">
                {weatherData?.solar?.magnetic_helicity ? weatherData.solar.magnetic_helicity.toExponential(2) : "3.50e+26"} G² m
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Solar Wind Plasma */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider">
            <Wind size={16} className="text-space-cyan" />
            <span>Solar Wind Plasma</span>
          </div>
          
          <div className="flex flex-col gap-3 font-mono text-xs mt-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Bulk Speed:</span>
              <span className={`font-bold ${sw_speed > 600 ? "text-space-orange" : "text-slate-200"}`}>
                {sw_speed.toFixed(1)} km/s
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Proton Density:</span>
              <span className="text-slate-200 font-bold">{sw_density.toFixed(1)} cm⁻³</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Plasma Temperature:</span>
              <span className="text-slate-200 font-bold">{sw_temp.toExponential(1)} K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dynamic Pressure:</span>
              <span className="text-slate-200 font-bold">{dyn_press.toExponential(2)} nPa</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Interplanetary Magnetic Field */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider">
            <Compass size={16} className="text-space-cyan" />
            <span>Interplanetary Mag Field (IMF)</span>
          </div>
          
          <div className="flex flex-col gap-3 font-mono text-xs mt-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Magnitude (B):</span>
              <span className="text-slate-200 font-bold">{B_tot.toFixed(1)} nT</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">IMF Bx Component:</span>
              <span className="text-slate-200 font-bold">{Bx.toFixed(1)} nT</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">IMF By Component:</span>
              <span className="text-slate-200 font-bold">{By.toFixed(1)} nT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IMF Bz (Southward orientation):</span>
              <span className={`font-bold ${Bz < -10 ? "text-space-red glow-text-red" : Bz < -3 ? "text-space-yellow" : "text-space-green"}`}>
                {Bz.toFixed(1)} nT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: EVENTS AND CME LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Solar Flares Table */}
        <div className="glass-panel rounded-xl p-5 border-slate-800">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 mb-4">
            Recent Solar Flare Detections
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Timestamp (UTC)</th>
                  <th className="pb-2">Class</th>
                  <th className="pb-2">Peak Flux</th>
                  <th className="pb-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {weatherData?.recent_flares?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No recent flare notifications</td>
                  </tr>
                ) : (
                  weatherData?.recent_flares?.map((flare: any) => (
                    <tr key={flare.id} className="border-b border-slate-800/40 hover:bg-space-800/10">
                      <td className="py-2.5 text-slate-300">
                        {new Date(flare.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                      </td>
                      <td className={`py-2.5 font-bold ${flare.class_str.startsWith("X") ? "text-space-red font-bold text-xs" : "text-space-yellow"}`}>
                        {flare.class_str}
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {flare.peak_flux.toExponential(2)}
                      </td>
                      <td className="py-2.5 text-slate-400">
                        N{flare.location_lat}° W{Math.abs(flare.location_lon)}°
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent CME Events Table */}
        <div className="glass-panel rounded-xl p-5 border-slate-800">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 mb-4">
            Coronal Mass Ejection (CME) Events
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Onset Time</th>
                  <th className="pb-2">Speed (km/s)</th>
                  <th className="pb-2">Width (deg)</th>
                  <th className="pb-2">Halo?</th>
                </tr>
              </thead>
              <tbody>
                {weatherData?.recent_cmes?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">No CME events recorded</td>
                  </tr>
                ) : (
                  weatherData?.recent_cmes?.map((cme: any) => (
                    <tr key={cme.id} className="border-b border-slate-800/40 hover:bg-space-800/10">
                      <td className="py-2.5 text-slate-300">
                        {new Date(cme.onset_time).toISOString().replace("T", " ").substring(0, 16)}
                      </td>
                      <td className={`py-2.5 font-bold ${cme.speed >= 1200 ? "text-space-orange font-bold text-xs" : "text-slate-200"}`}>
                        {cme.speed.toFixed(0)}
                      </td>
                      <td className="py-2.5 text-slate-300">
                        {cme.angular_width.toFixed(0)}°
                      </td>
                      <td className="py-2.5">
                        {cme.halo_indicator ? (
                          <span className="px-1.5 py-0.5 rounded bg-space-red/20 text-space-red text-[9px] font-bold tracking-wider uppercase">
                            FULL HALO
                          </span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
