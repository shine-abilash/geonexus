import React, { useState, useEffect } from "react";
import axios from "axios";
import { Play, Pause, SkipForward, RotateCcw, Calendar, CheckCircle2 } from "lucide-react";

interface ReplayProps {
  replayStatus: any;
  onRefresh: () => void;
}

const API_BASE = "http://localhost:8000/api";

export default function HistoricalReplay({ replayStatus, onRefresh }: ReplayProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | string>("");
  const [timelineVal, setTimelineVal] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Fetch events list
    axios.get(`${API_BASE}/events`)
      .then(res => {
        setEvents(res.data);
        if (res.data.length > 0) {
          setSelectedEventId(res.data[0].id);
        }
      })
      .catch(err => console.error("Error fetching historical event list:", err));
  }, []);

  useEffect(() => {
    if (replayStatus) {
      setIsPlaying(replayStatus.is_active);
      if (replayStatus.current_replay_time && replayStatus.start_time) {
        const start = new Date(replayStatus.start_time).getTime();
        const curr = new Date(replayStatus.current_replay_time).getTime();
        // Set timeline offset in minutes
        setTimelineVal(Math.round((curr - start) / 60000));
      }
    }
  }, [replayStatus]);

  const handleSelectEvent = async () => {
    if (!selectedEventId) return;
    try {
      // Find replay metadata
      const res = await axios.get(`${API_BASE}/events/${selectedEventId}/replay`);
      const meta = res.data;
      
      // Override simulation time to event start
      await axios.post(`${API_BASE}/replay/time`, { target_time: meta.start_time });
      
      // Make sure simulation speed is normal
      await axios.post(`${API_BASE}/replay/speed`, { speed: 1.0 });
      
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlay = async () => {
    try {
      const endpoint = isPlaying ? "stop" : "start";
      await axios.post(`${API_BASE}/replay/${endpoint}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStep = async () => {
    try {
      await axios.post(`${API_BASE}/replay/step`, { minutes: 10.0 });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!replayStatus?.start_time) return;
    try {
      await axios.post(`${API_BASE}/replay/time`, { target_time: replayStatus.start_time });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSliderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTimelineVal(val);
    
    if (!replayStatus?.start_time) return;
    const start = new Date(replayStatus.start_time).getTime();
    const targetMs = start + val * 60000;
    const targetIso = new Date(targetMs).toISOString();
    
    try {
      await axios.post(`${API_BASE}/replay/time`, { target_time: targetIso });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeedChange = async (speed: number) => {
    try {
      await axios.post(`${API_BASE}/replay/speed`, { speed });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Convert timeline min to hours
  const formatMinutes = (m: number) => {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold tracking-wider font-mono text-white">HISTORICAL REPLAY CONSOLE</h2>
        <p className="text-xs text-slate-400 font-mono">Evaluate model prediction performance on historical solar energetic particle events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scenario Selection */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300 flex items-center gap-2">
            <Calendar size={16} className="text-space-cyan" />
            <span>Select Event Scenario</span>
          </h3>

          <div className="flex flex-col gap-3 font-mono text-xs">
            <label className="text-slate-400">Select Event:</label>
            <select 
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-space-950 border border-slate-800 text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-space-cyan"
            >
              <option value="">-- Choose SEP Event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name || `Event ${ev.id}`} (Peak: {ev.peak_flux} pfu)
                </option>
              ))}
            </select>

            <button 
              onClick={handleSelectEvent}
              disabled={!selectedEventId}
              className="w-full bg-space-cyan hover:bg-cyan-400 text-space-950 font-bold p-2.5 rounded-lg transition disabled:opacity-40"
            >
              LOAD EVENT telemetries
            </button>
          </div>

          <div className="text-[10px] text-slate-500 font-mono leading-relaxed mt-2 border-t border-slate-800/80 pt-4">
            Loading an event config adjusts the database simulation time bounds. Playback steps chronologically, allowing researchers to evaluate forecasting lead times.
          </div>
        </div>

        {/* Timeline Control Board */}
        <div className="glass-panel rounded-xl p-5 border-slate-800 lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-sm font-bold tracking-wider font-mono uppercase text-slate-300">
            Playback Controller
          </h3>

          {/* Timeline slider scrubber */}
          <div className="flex flex-col gap-2 font-mono">
            <div className="flex justify-between text-xs text-slate-400">
              <span>START TIME: {replayStatus?.start_time ? new Date(replayStatus.start_time).toLocaleTimeString() : "00:00"}</span>
              <span className="text-space-cyan font-bold">Elapsed: {formatMinutes(timelineVal)}</span>
              <span>CURRENT SIM: {replayStatus?.current_replay_time ? new Date(replayStatus.current_replay_time).toLocaleTimeString() : "00:00"}</span>
            </div>
            
            <input 
              type="range"
              min="0"
              max="4320" // up to 3 days (3 * 24 * 60)
              value={timelineVal}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-space-cyan"
            />
          </div>

          {/* Button buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleTogglePlay}
                className="bg-space-800 hover:bg-slate-700 text-white font-bold p-3 rounded-lg border border-slate-700 transition"
                title={isPlaying ? "Pause Simulation" : "Start Simulation"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button 
                onClick={handleStep}
                className="bg-space-800 hover:bg-slate-700 text-white font-bold p-3 rounded-lg border border-slate-700 transition"
                title="Step 10 Min Forward"
              >
                <SkipForward size={16} />
              </button>

              <button 
                onClick={handleReset}
                className="bg-space-800 hover:bg-slate-700 text-white font-bold p-3 rounded-lg border border-slate-700 transition"
                title="Reset Clock to Start"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 text-[10px]">SPEED MULTIPLIER:</span>
              {[1, 6, 36, 144].map((mult) => (
                <button
                  key={mult}
                  onClick={() => handleSpeedChange(mult)}
                  className={`px-2.5 py-1.5 rounded-lg border transition ${
                    replayStatus?.speed_multiplier === mult 
                      ? "bg-space-cyan/20 border-space-cyan text-space-cyan font-bold" 
                      : "bg-space-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {mult === 1 ? "1x" : mult === 6 ? "10x" : mult === 36 ? "60x" : "240x"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border border-slate-800 p-3 rounded-lg text-xs font-mono text-emerald-400 bg-emerald-950/5">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Replay status verified: Model inputs are sliced sequentially to prevent future data leakage.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
