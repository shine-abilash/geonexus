import axios from "axios";
import { Shield, ShieldAlert, Users, Info } from "lucide-react";

interface RiskProps {
  astronautRisk: any;
  onRefresh: () => void;
}

const API_BASE = "http://localhost:8000/api";

export default function AstronautRisk({ astronautRisk, onRefresh }: RiskProps) {
  const profile = astronautRisk?.profile;
  const doseRate = astronautRisk?.estimated_dose_rate_msv_h || 0.0;
  const riskLevel = astronautRisk?.risk_level || "GREEN";
  const recommendedZone = astronautRisk?.recommended_zone || "Zone A";
  const timeLimit = astronautRisk?.time_to_dose_limit_h || floatInf();

  function floatInf() {
    return 9999.0;
  }

  const handleMoveZone = async (zone: string) => {
    try {
      await axios.post(`${API_BASE}/astronaut/position`, { zone_name: zone });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getZoneBorderClass = (zoneName: string) => {
    const isCurrent = profile?.current_zone === zoneName;
    const isRecommended = recommendedZone.startsWith(zoneName);
    
    if (isCurrent && isRecommended) {
      return "border-space-green bg-space-green/10 shadow-lg shadow-space-green/5";
    }
    if (isCurrent) {
      return "border-space-cyan bg-space-cyan/5";
    }
    if (isRecommended && riskLevel !== "GREEN") {
      return "border-dashed border-space-yellow bg-space-yellow/5 animate-pulse";
    }
    return "border-slate-800 bg-space-950/20";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">ASTRONAUT RADIATION DOSIMETRY</h2>
        <p className="text-xs text-slate-400 font-mono">Dose risk assessment, spacecraft layout, and shelter optimization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crew Status & Dose Stats */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 flex items-center gap-2">
              <Users size={16} className="text-space-cyan" />
              <span>Astronaut Profile</span>
            </h3>

            <div className="flex flex-col gap-3 font-mono text-xs mt-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Name:</span>
                <span className="text-slate-200 font-bold">{profile?.name || "Commander Mark Watney"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Current Zone:</span>
                <span className="text-space-cyan font-bold">{profile?.current_zone || "Zone A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Zone Shielding:</span>
                <span className="text-slate-200 font-bold">{profile?.shielding_g_cm2?.toFixed(1) || "2.0"} g/cm² Al equiv</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Cumulative Dose:</span>
                <span className="text-slate-200 font-bold">{profile?.cumulative_dose_msv?.toFixed(2) || "12.4"} mSv</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Estimated Dose Rate:</span>
                <span className={`font-bold ${doseRate > 1.0 ? "text-space-red glow-text-red" : doseRate > 0.1 ? "text-space-yellow" : "text-space-green"}`}>
                  {doseRate.toFixed(4)} mSv/h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time to Dose Limit:</span>
                <span className="text-slate-200 font-bold">
                  {timeLimit > 1000 ? "Nominal (>100 hrs)" : `${timeLimit.toFixed(1)} hours`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-start gap-1">
            <Info size={12} className="shrink-0 text-slate-400 mt-0.5" />
            <span>Dose limits are standard NASA PELs. Simplified model attenuation factors applied.</span>
          </div>
        </div>

        {/* 2D Spacecraft Layout Map */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
              Spacecraft 2D Layout Map
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-space-cyan inline-block rounded-sm" /> Current Position</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 border border-dashed border-space-yellow inline-block rounded-sm" /> Recommended Shelter</span>
            </div>
          </div>

          {/* Grid layout of space ship */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-space-950/60 rounded-xl border border-slate-800/80 my-2">
            
            {/* Zone A */}
            <div 
              onClick={() => handleMoveZone("Zone A")}
              className={`p-4 border rounded-xl flex flex-col justify-between h-28 cursor-pointer hover:border-slate-600 transition ${getZoneBorderClass("Zone A")}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-300">ZONE A (Cockpit)</span>
                <Shield size={14} className="text-slate-500" />
              </div>
              <div className="flex justify-between items-end font-mono">
                <span className="text-[10px] text-slate-400">Shielding: 2.0 g/cm²</span>
                {profile?.current_zone === "Zone A" && (
                  <span className="px-1.5 py-0.5 bg-space-cyan/20 border border-space-cyan rounded text-[9px] text-space-cyan font-bold tracking-wider animate-pulse">
                    👨‍🚀 CREW HERE
                  </span>
                )}
              </div>
            </div>

            {/* Zone B */}
            <div 
              onClick={() => handleMoveZone("Zone B")}
              className={`p-4 border rounded-xl flex flex-col justify-between h-28 cursor-pointer hover:border-slate-600 transition ${getZoneBorderClass("Zone B")}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-300">ZONE B (Habitation)</span>
                <Shield size={14} className="text-slate-400" />
              </div>
              <div className="flex justify-between items-end font-mono">
                <span className="text-[10px] text-slate-400">Shielding: 4.0 g/cm²</span>
                {profile?.current_zone === "Zone B" && (
                  <span className="px-1.5 py-0.5 bg-space-cyan/20 border border-space-cyan rounded text-[9px] text-space-cyan font-bold tracking-wider animate-pulse">
                    👨‍🚀 CREW HERE
                  </span>
                )}
              </div>
            </div>

            {/* Zone C */}
            <div 
              onClick={() => handleMoveZone("Zone C")}
              className={`p-4 border rounded-xl flex flex-col justify-between h-28 cursor-pointer hover:border-slate-600 transition ${getZoneBorderClass("Zone C")}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-300">ZONE C (Glovebox Lab)</span>
                <Shield size={14} className="text-slate-300" />
              </div>
              <div className="flex justify-between items-end font-mono">
                <span className="text-[10px] text-slate-400">Shielding: 6.0 g/cm²</span>
                {profile?.current_zone === "Zone C" && (
                  <span className="px-1.5 py-0.5 bg-space-cyan/20 border border-space-cyan rounded text-[9px] text-space-cyan font-bold tracking-wider animate-pulse">
                    👨‍🚀 CREW HERE
                  </span>
                )}
              </div>
            </div>

            {/* Zone D */}
            <div 
              onClick={() => handleMoveZone("Zone D (Storm Shelter)")}
              className={`p-4 border rounded-xl flex flex-col justify-between h-28 cursor-pointer hover:border-slate-600 transition ${getZoneBorderClass("Zone D (Storm Shelter)")}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-300">ZONE D (Storm Shelter)</span>
                <ShieldAlert size={14} className="text-space-red animate-pulse" />
              </div>
              <div className="flex justify-between items-end font-mono">
                <span className="text-[10px] text-slate-400">Shielding: 15.0 g/cm²</span>
                {profile?.current_zone === "Zone D (Storm Shelter)" && (
                  <span className="px-1.5 py-0.5 bg-space-cyan/20 border border-space-cyan rounded text-[9px] text-space-cyan font-bold tracking-wider animate-pulse">
                    👨‍🚀 CREW HERE
                  </span>
                )}
              </div>
            </div>

          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center leading-tight">
            Click on a zone to simulate moving the astronaut crew profile. Shielding thickness modifies dose rates dynamically.
          </div>
        </div>

      </div>

    </div>
  );
}
