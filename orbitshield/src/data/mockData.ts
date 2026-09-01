// ============================================================
// MOCK DATA — Replace these with real API calls later
// All endpoints are documented below for easy integration
// ============================================================

// API_ENDPOINT: GET /api/live-radiation
export const generateLiveRadiationData = () => {
  const base = [0.21, 0.24, 0.27, 0.32, 0.29, 0.31, 0.35, 0.38, 0.42, 0.40,
    0.44, 0.48, 0.52, 0.49, 0.45, 0.42, 0.39, 0.36, 0.38, 0.41,
    0.43, 0.47, 0.51, 0.55];
  const now = new Date();
  return base.map((r, i) => {
    const t = new Date(now.getTime() - (base.length - 1 - i) * 5 * 60 * 1000);
    return {
      time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      radiation: r + (Math.random() - 0.5) * 0.02,
      flux: (r * 13500).toFixed(0),
    };
  });
};

// API_ENDPOINT: GET /api/current-stats
export const currentStats = {
  currentRadiation: 0.42,
  unit: 'Gy',
  currentFlux: 2.84e4,
  predicted24hPeak: 1.26,
  safetyStatus: 'SAFE' as 'SAFE' | 'WARNING' | 'DANGER',
  lastUpdated: 'Just now',
};

// API_ENDPOINT: GET /api/sepnet/detection
export const sepnetDetection = {
  eventDetected: true,
  confidence: 96.8,
  signalStrength: 87.4,
  noiseLevel: 12.6,
  processingTime: '142ms',
};

// API_ENDPOINT: GET /api/prediction/today
export const todayPrediction = {
  modelName: 'LSTM Model 1',
  inputTimestamps: 6,
  outputHours: 24,
  lowest: 0.12,
  average: 0.48,
  peak: 1.18,
  riskLevel: 'MODERATE' as const,
  interpretation: 'Radiation is expected to gradually increase during the next 8 hours before slowly decreasing toward baseline levels. A moderate peak is anticipated between 14:00–18:00 UTC.',
  hourly: Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() + i) % 24;
    const base = 0.3 + Math.sin((i / 24) * Math.PI * 1.5) * 0.4 + Math.random() * 0.1;
    return {
      hour: `${String(hour).padStart(2, '0')}:00`,
      predicted: parseFloat(base.toFixed(3)),
      lower: parseFloat((base * 0.85).toFixed(3)),
      upper: parseFloat((base * 1.15).toFixed(3)),
    };
  }),
};

// API_ENDPOINT: GET /api/prediction/future
export const futurePrediction = {
  modelName: 'LSTM Model 2',
  outputDays: 2,
  days: [
    {
      label: 'Day 1',
      peak: 0.84,
      average: 0.52,
      lowest: 0.18,
      risk: 'LOW' as const,
      hourly: Array.from({ length: 24 }, (_, i) => {
        const base = 0.25 + Math.sin((i / 24) * Math.PI * 2) * 0.35 + Math.random() * 0.08;
        return { hour: `${String(i).padStart(2, '0')}:00`, predicted: parseFloat(base.toFixed(3)) };
      }),
    },
    {
      label: 'Day 2',
      peak: 1.42,
      average: 0.88,
      lowest: 0.31,
      risk: 'HIGH' as const,
      hourly: Array.from({ length: 24 }, (_, i) => {
        const base = 0.5 + Math.sin((i / 24) * Math.PI) * 0.7 + Math.random() * 0.12;
        return { hour: `${String(i).padStart(2, '0')}:00`, predicted: parseFloat(Math.max(0.1, base).toFixed(3)) };
      }),
    },
  ],
};

// API_ENDPOINT: GET /api/analysis/physics
export const radiationAnalysis = {
  integralFlux: 28450,
  fluence: 1.72e6,
  spectralIndex: 2.34,
  energyFlux: 4.18e3,
  stoppingPower: 0.215,
  absorbedDose: 0.72,
  doseUnit: 'Gy',
  finalRisk: 'MODERATE' as const,
  calculations: [
    { id: 1, name: 'Integral Flux', symbol: 'J(>E₀)', formula: 'J(>E₀) = ∫ J(E,t) dE', value: '2.845 × 10⁴', unit: 'particles/cm²/s', explanation: 'Measures total radiation particles above a selected energy threshold.' },
    { id: 2, name: 'Fluence', symbol: 'Φ(E)', formula: 'Φ(E) = ∫ J(E,t) dt', value: '1.72 × 10⁶', unit: 'particles/cm²', explanation: 'Total radiation that passed through the area over the observation period.' },
    { id: 3, name: 'Spectral Index', symbol: 'γ', formula: 'J(E) = J₀ · E⁻ᵞ', value: '2.34', unit: 'dimensionless', explanation: 'Describes how radiation intensity decreases as particle energy increases.' },
    { id: 4, name: 'Energy Flux', symbol: 'F(E)', formula: 'F(E) = ∫ E · J(E,t) dE', value: '4.18 × 10³', unit: 'MeV/cm²/s', explanation: 'Total energy carried by all radiation particles combined.' },
    { id: 5, name: 'Stopping Power', symbol: 'S(E)', formula: 'S(E) = −dE/dx', value: '0.215', unit: 'MeV/cm', explanation: 'Energy lost by a particle as it travels through material — how quickly it slows down.' },
    { id: 6, name: 'Absorbed Dose', symbol: 'D', formula: 'D = 1.602×10⁻¹⁰ ∫ Φ(E)·S(E) dE', value: '0.72', unit: 'Gy', explanation: 'Final radiation energy absorbed by the astronaut or material — the key safety metric.' },
  ],
};

// API_ENDPOINT: GET /api/locations
export const locations = [
  { id: 'A', name: 'Location Alpha', shortName: 'Alpha', lat: 28.5, lon: -80.6, dose: 0.18, energyLevel: 'Low', risk: 'LOW' as const, safetyScore: 94, distance: '0.0 km', recommended: true, description: 'Near radiation shadow zone — optimal for mission ops', x: 35, y: 45 },
  { id: 'B', name: 'Location Beta', shortName: 'Beta', lat: 28.7, lon: -80.3, dose: 0.42, energyLevel: 'Low-Medium', risk: 'LOW' as const, safetyScore: 79, distance: '18.4 km', recommended: false, description: 'Slight elevation, moderate particle flux', x: 55, y: 30 },
  { id: 'C', name: 'Location Gamma', shortName: 'Gamma', lat: 28.3, lon: -80.9, dose: 0.72, energyLevel: 'Medium', risk: 'MODERATE' as const, safetyScore: 62, distance: '24.1 km', recommended: false, description: 'Open terrain — elevated flux levels detected', x: 20, y: 65 },
  { id: 'D', name: 'Location Delta', shortName: 'Delta', lat: 28.9, lon: -80.1, dose: 1.08, energyLevel: 'High', risk: 'HIGH' as const, safetyScore: 41, distance: '38.7 km', recommended: false, description: 'Exposed to direct particle stream — avoid', x: 72, y: 55 },
  { id: 'E', name: 'Location Epsilon', shortName: 'Epsilon', lat: 28.1, lon: -80.7, dose: 1.42, energyLevel: 'Very High', risk: 'DANGER' as const, safetyScore: 22, distance: '46.2 km', recommended: false, description: 'High radiation corridor — mission-critical risk', x: 48, y: 80 },
];

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'DANGER' | 'SAFE';

export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'LOW': case 'SAFE': return '#10b981';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#f97316';
    case 'DANGER': return '#ef4444';
    default: return '#94a3b8';
  }
};

export const getRiskBadgeClass = (risk: string): string => {
  switch (risk) {
    case 'LOW': case 'SAFE': return 'badge-safe';
    case 'MODERATE': return 'badge-moderate';
    case 'HIGH': case 'DANGER': return 'badge-danger';
    default: return 'badge-info';
  }
};
