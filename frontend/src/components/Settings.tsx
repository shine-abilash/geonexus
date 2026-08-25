import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface SettingsProps {
  onRefresh: () => void;
}

const API_BASE = "http://localhost:8000/api";

export default function Settings({ onRefresh }: SettingsProps) {
  const [thresholds, setThresholds] = useState<any>({
    SEP_PROBABILITY_WARNING: 0.50,
    SEP_PROBABILITY_CRITICAL: 0.80,
    PROTON_FLUX_WARNING: 10.0,
    PROTON_FLUX_CRITICAL: 100.0,
    PREDICTED_DOSE_WARNING_MSV: 5.0,
    PREDICTED_DOSE_CRITICAL_MSV: 50.0,
    LEAD_TIME_WARNING_MIN: 60.0
  });
  
  const [saving, setSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    // Load current thresholds
    axios.get(`${API_BASE}/thresholds`)
      .then(res => {
        setThresholds(res.data);
      })
      .catch(err => console.error("Error loading thresholds config:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds((prev: any) => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await axios.post(`${API_BASE}/thresholds`, thresholds);
      setMsg("Threshold configurations successfully updated.");
      onRefresh();
    } catch (err) {
      console.error(err);
      setMsg("Error saving configurations. Check backend connectivity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">SAFETY WARNING THRESHOLDS</h2>
        <p className="text-xs text-slate-400 font-mono">Configure radiation trigger thresholds for mission decision-support alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form panel */}
        <div className="glass-panel rounded-xl p-5 border-slate-800">
          <form onSubmit={handleSave} className="flex flex-col gap-4 font-mono text-xs">
            
            <div className="flex flex-col gap-2">
              <label className="text-slate-400">SEP Event Warning Probability (0.0 to 1.0):</label>
              <input 
                type="number" 
                step="0.05"
                min="0.0"
                max="1.0"
                name="SEP_PROBABILITY_WARNING"
                value={thresholds.SEP_PROBABILITY_WARNING}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400">SEP Event Critical Probability (0.0 to 1.0):</label>
              <input 
                type="number" 
                step="0.05"
                min="0.0"
                max="1.0"
                name="SEP_PROBABILITY_CRITICAL"
                value={thresholds.SEP_PROBABILITY_CRITICAL}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400">Proton Flux Warning Threshold (pfu):</label>
              <input 
                type="number" 
                step="0.5"
                min="0.1"
                name="PROTON_FLUX_WARNING"
                value={thresholds.PROTON_FLUX_WARNING}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400">Proton Flux Critical Threshold (pfu):</label>
              <input 
                type="number" 
                step="5.0"
                min="1.0"
                name="PROTON_FLUX_CRITICAL"
                value={thresholds.PROTON_FLUX_CRITICAL}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400">Predicted Warning Dose Rate (mSv/h):</label>
              <input 
                type="number" 
                step="0.1"
                min="0.05"
                name="PREDICTED_DOSE_WARNING_MSV"
                value={thresholds.PREDICTED_DOSE_WARNING_MSV}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400">Predicted Critical Dose Rate (mSv/h):</label>
              <input 
                type="number" 
                step="1.0"
                min="0.5"
                name="PREDICTED_DOSE_CRITICAL_MSV"
                value={thresholds.PREDICTED_DOSE_CRITICAL_MSV}
                onChange={handleChange}
                className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-space-cyan hover:bg-cyan-400 text-space-950 font-bold p-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>{saving ? "SAVING CONFIGS..." : "SAVE THRESHOLD LEVELS"}</span>
            </button>

            {msg && (
              <div className={`p-2.5 rounded-lg text-center font-bold ${
                msg.includes("Error") ? "bg-space-red/10 border border-space-red/20 text-space-red" : "bg-space-green/10 border border-space-green/20 text-space-green"
              }`}>
                {msg}
              </div>
            )}

          </form>
        </div>

        {/* Explain thresholds card */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 text-xs font-mono leading-relaxed text-slate-400 flex flex-col gap-3">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 flex items-center gap-2">
            <SettingsIcon size={16} className="text-space-cyan" />
            <span>Configuring Triggers</span>
          </h3>
          <p>
            The rule-based decision support logic checks predictions and real-time streams to issue flags:
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-2 text-[11px]">
            <li><span className="text-space-yellow font-bold">YELLOW (Elevated Alert):</span> Triggered when predicted SEP probability exceeds <code className="text-slate-200">SEP_PROBABILITY_WARNING</code> or current proton flux is elevated.</li>
            <li><span className="text-space-orange font-bold">ORANGE (Evacuation warning):</span> Triggered if forecasted proton flux exceeds <code className="text-slate-200">PROTON_FLUX_WARNING</code> or estimated dose rates exceed <code className="text-slate-200">PREDICTED_DOSE_WARNING_MSV</code>.</li>
            <li><span className="text-space-red font-bold">RED (Evacuation mandate):</span> Triggered if forecasted proton flux exceeds <code className="text-slate-200">PROTON_FLUX_CRITICAL</code> or dose rates exceed <code className="text-slate-200">PREDICTED_DOSE_CRITICAL_MSV</code>.</li>
          </ul>
          <p className="border-t border-slate-800/80 pt-3 text-[10px] text-slate-500 leading-normal">
            Note: Threshold modifications are saved to `configs/alert_thresholds.json` dynamically and are loaded immediately by the alert evaluator.
          </p>
        </div>

      </div>

    </div>
  );
}
