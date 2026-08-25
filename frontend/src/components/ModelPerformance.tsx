import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

export default function ModelPerformance() {
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/model/performance`)
      .then(res => {
        setPerformanceData(res.data.comparison_table);
      })
      .catch(err => console.error("Error fetching model performance data:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">MODEL METRICS & BENCHMARKS</h2>
        <p className="text-xs text-slate-400 font-mono">Statistical validation comparing the active Multi-Task SepNet architecture against baselines</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Performance Table Card */}
        <div className="glass-panel rounded-xl p-5 border-slate-800">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 mb-4">
            Cross-Model Metrics Benchmarks (Chronological Holdout Validation)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Model Description</th>
                  <th className="pb-3 text-center">Classifier F1-Score</th>
                  <th className="pb-3 text-center">Classifier ROC-AUC</th>
                  <th className="pb-3 text-center">Flux Regressor MAE (pfu)</th>
                  <th className="pb-3 text-center">Flux Regressor RMSE (pfu)</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-slate-800/40 hover:bg-space-800/10 ${
                      row.Model.includes("Multi-Task") ? "bg-space-cyan/5 text-space-cyan" : "text-slate-300"
                    }`}
                  >
                    <td className="py-4 pr-4 font-bold">{row.Model}</td>
                    <td className="py-4 text-center font-bold">
                      {typeof row["Classifier F1"] === "number" ? row["Classifier F1"].toFixed(3) : row["Classifier F1"]}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row["Classifier ROC-AUC"] === "number" ? row["Classifier ROC-AUC"].toFixed(3) : row["Classifier ROC-AUC"]}
                    </td>
                    <td className="py-4 text-center font-bold">
                      {typeof row["Flux Regressor MAE"] === "number" ? row["Flux Regressor MAE"].toFixed(2) : row["Flux Regressor MAE"]}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row["Flux Regressor RMSE"] === "number" ? row["Flux Regressor RMSE"].toFixed(2) : row["Flux Regressor RMSE"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 border border-slate-800/80 bg-space-950/40 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-space-cyan shrink-0 mt-0.5" />
            <div className="text-[11px] font-mono text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-bold">Evaluation Rationale:</span> Chronological split validation ensures zero future data leakage. The Persistence Baseline assumes the current particle flux is constant. The Random Forest models evaluate flattened input sequences, while the <span className="text-space-cyan font-bold">Multi-Task SepNet</span> employs a hybrid Transformer + LSTM encoder, yielding improved F1 score on highly imbalanced solar particle events.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
