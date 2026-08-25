import { useState, useEffect } from "react";
import axios from "axios";
import { AlertOctagon, Link2, CheckCircle2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

export default function DataSources() {
  const [sources, setSources] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("GREEN");

  useEffect(() => {
    axios.get(`${API_BASE}/system/health`)
      .then(res => {
        setSources(res.data.sources);
        setStatus(res.data.status);
      })
      .catch(err => console.error("Error fetching system health data:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">DATA SOURCE STATUS</h2>
        <p className="text-xs text-slate-400 font-mono">Observe telemetry stream health, API polling freshness, and endpoints</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Sources status list */}
        <div className="glass-panel rounded-xl p-5 border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
              Active Observatory Telemetry Ingest Nodes
            </h3>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              status === "GREEN" ? "bg-space-green/10 text-space-green border-space-green/20" : "bg-space-yellow/10 text-space-yellow border-space-yellow/20"
            }`}>
              SYSTEM INTEGRITY: {status}
            </span>
          </div>

          <div className="flex flex-col gap-4 font-mono text-xs">
            {sources.map((src) => (
              <div 
                key={src.id} 
                className="p-4 border border-slate-800/80 bg-space-950/20 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg border shrink-0 ${
                    src.status === "OK" ? "bg-space-green/5 border-space-green/20 text-space-green" : "bg-space-yellow/5 border-space-yellow/20 text-space-yellow"
                  }`}>
                    {src.status === "OK" ? <CheckCircle2 size={18} /> : <AlertOctagon size={18} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-100 font-bold text-sm">{src.source_name}</span>
                    <a 
                      href={src.url || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-space-cyan flex items-center gap-1 transition text-[10px]"
                    >
                      <Link2 size={12} />
                      <span>{src.url || "Static Database Simulation"}</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Status:</span>
                    <span className={`font-bold ${src.status === "OK" ? "text-space-green" : "text-space-yellow"}`}>
                      {src.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    <span>Last Ingest:</span>
                    <span>{new Date(src.last_successful_update).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
