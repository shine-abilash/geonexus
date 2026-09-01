// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// Replace these with real API calls. Each export maps to one API endpoint.
// ─────────────────────────────────────────────────────────────────────────────

export interface RadiationPoint {
  time: string;
  radiation: number;
  flux: number;
}

export interface PredictionPoint {
  hour: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface Location {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  dose: number;
  energyLevel: string;
  risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  safetyScore: number;
  distance: number; // km from base
  description: string;
}

// ─── Live Radiation (past 30 points, 5-min intervals) ─────────────────────────
const now = new Date();
export const liveRadiationData: RadiationPoint[] = Array.from({ length: 30 }, (_, i) => {
  const t = new Date(now.getTime() - (29 - i) * 5 * 60 * 1000);
  const base = 0.22;
  const wave = Math.sin(i * 0.4) * 0.08 + Math.sin(i * 0.15) * 0.05;
  const noise = (Math.random() - 0.5) * 0.04;
  const radiation = +(base + wave + noise).toFixed(3);
  return {
    time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    radiation: Math.max(0.05, radiation),
    flux: +(radiation * 13500 + Math.random() * 800).toFixed(0),
  };
});

// Current (latest point)
export const currentRadiation = liveRadiationData[liveRadiationData.length - 1].radiation;
export const currentFlux = liveRadiationData[liveRadiationData.length - 1].flux;

// ─── SEPNET Event Detection ─────────────────────────────────────────────────
export const sepnetResult = {
  eventDetected: true,
  confidence: 96.8,
  modelVersion: 'SEPNET v2.1',
  processedAt: new Date().toISOString(),
};

// ─── Today's Prediction — LSTM Model 1 (24 hours) ──────────────────────────
export const todayPrediction: PredictionPoint[] = Array.from({ length: 24 }, (_, i) => {
  const h = new Date(now.getTime() + i * 3600 * 1000);
  const label = h.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const trend = 0.22 + Math.sin(i * 0.35) * 0.12 + (i < 12 ? i * 0.02 : (24 - i) * 0.015);
  const noise = (Math.random() - 0.5) * 0.02;
  const predicted = +(trend + noise).toFixed(3);
  return {
    hour: label,
    predicted: Math.max(0.05, predicted),
    lower: +(predicted - 0.06).toFixed(3),
    upper: +(predicted + 0.08).toFixed(3),
  };
});

export const todayStats = {
  lowest: +(Math.min(...todayPrediction.map(p => p.predicted))).toFixed(2),
  average: +(todayPrediction.reduce((a, b) => a + b.predicted, 0) / 24).toFixed(2),
  peak: +(Math.max(...todayPrediction.map(p => p.predicted))).toFixed(2),
  riskLevel: 'MODERATE' as const,
  aiInterpretation: 'Radiation is expected to increase during the next 8 hours, peaking around midday, before gradually declining in the late afternoon.',
};

// ─── Future Prediction — LSTM Model 2 (48 hours) ───────────────────────────
export const futurePrediction: PredictionPoint[] = Array.from({ length: 48 }, (_, i) => {
  const h = new Date(now.getTime() + i * 3600 * 1000);
  const label = `${Math.floor(i / 24) === 0 ? 'D1' : 'D2'} ${h.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  const dayEffect = i >= 24 ? 0.18 : 0;
  const trend = 0.22 + Math.sin(i * 0.28) * 0.14 + dayEffect + (Math.random() - 0.5) * 0.03;
  const predicted = +(trend).toFixed(3);
  return {
    hour: label,
    predicted: Math.max(0.05, predicted),
    lower: +(predicted - 0.07).toFixed(3),
    upper: +(predicted + 0.09).toFixed(3),
  };
});

export const futureDay1Stats = {
  peak: +(Math.max(...futurePrediction.slice(0, 24).map(p => p.predicted))).toFixed(2),
  average: +(futurePrediction.slice(0, 24).reduce((a, b) => a + b.predicted, 0) / 24).toFixed(2),
  risk: 'LOW' as const,
};
export const futureDay2Stats = {
  peak: +(Math.max(...futurePrediction.slice(24).map(p => p.predicted))).toFixed(2),
  average: +(futurePrediction.slice(24).reduce((a, b) => a + b.predicted, 0) / 24).toFixed(2),
  risk: 'HIGH' as const,
};

// ─── Radiation Analysis ─────────────────────────────────────────────────────
export const radiationAnalysis = {
  integralFlux: 2.84e4,
  fluence: 1.73e6,
  spectralIndex: 2.15,
  energyFlux: 4.28e5,
  stoppingPower: 184.3,
  absorbedDose: 0.72,
  riskLevel: 'MODERATE' as const,
};

// ─── Locations ──────────────────────────────────────────────────────────────
export const locations: Location[] = [
  {
    id: 'alpha',
    name: 'Location Alpha',
    shortName: 'α',
    lat: 28.5,
    lng: -80.6,
    dose: 0.18,
    energyLevel: 'Low',
    risk: 'LOW',
    safetyScore: 94,
    distance: 0,
    description: 'Current base — minimal shielding obstruction, ideal SAA avoidance path.',
  },
  {
    id: 'bravo',
    name: 'Location Bravo',
    shortName: 'β',
    lat: 29.1,
    lng: -81.2,
    dose: 0.47,
    energyLevel: 'Moderate',
    risk: 'MODERATE',
    safetyScore: 71,
    distance: 82,
    description: 'Moderate exposure — partial exposure to trapped particle belt edges.',
  },
  {
    id: 'charlie',
    name: 'Location Charlie',
    shortName: 'γ',
    lat: 27.8,
    lng: -79.9,
    dose: 0.72,
    energyLevel: 'Moderate-High',
    risk: 'MODERATE',
    safetyScore: 58,
    distance: 65,
    description: 'Elevated flux detected — close to South Atlantic Anomaly boundary.',
  },
  {
    id: 'delta',
    name: 'Location Delta',
    shortName: 'δ',
    lat: 30.2,
    lng: -80.0,
    dose: 1.24,
    energyLevel: 'High',
    risk: 'HIGH',
    safetyScore: 34,
    distance: 196,
    description: 'High radiation corridor — significant galactic cosmic ray flux.',
  },
  {
    id: 'echo',
    name: 'Location Echo',
    shortName: 'ε',
    lat: 27.2,
    lng: -81.8,
    dose: 1.61,
    energyLevel: 'Very High',
    risk: 'CRITICAL',
    safetyScore: 12,
    distance: 144,
    description: 'Critical zone — active SEP event impact region. Avoid immediately.',
  },
];

export const recommendedLocation = locations[0];

// ─── Formula cards ─────────────────────────────────────────────────────────
export const formulaCards = [
  {
    id: 1,
    title: 'Integral Flux',
    symbol: 'J(>E₀)',
    formula: 'J(>E₀) = ∫ J(E,t) dE',
    value: '2.84 × 10⁴',
    unit: 'particles/cm²/s',
    explanation: 'Counts how many radiation particles exceed a chosen energy threshold — tells us the intensity of high-energy radiation reaching the sensor.',
    color: 'ion',
  },
  {
    id: 2,
    title: 'Fluence',
    symbol: 'Φ(E)',
    formula: 'Φ(E) = ∫ J(E,t) dt',
    value: '1.73 × 10⁶',
    unit: 'particles/cm²',
    explanation: 'Measures the total number of radiation particles that have passed through a unit area over the entire observation period.',
    color: 'plasma',
  },
  {
    id: 3,
    title: 'Spectral Index',
    symbol: 'γ (gamma)',
    formula: 'J(E) = J₀ · E⁻ᵞ',
    value: '2.15',
    unit: 'dimensionless',
    explanation: 'Describes how the number of particles drops off as particle energy increases — a steeper slope means fewer extreme-energy particles.',
    color: 'ion',
  },
  {
    id: 4,
    title: 'Energy Flux',
    symbol: 'F(E)',
    formula: 'F(E) = ∫ E · J(E,t) dE',
    value: '4.28 × 10⁵',
    unit: 'MeV/cm²/s',
    explanation: 'Quantifies the total energy carried by all radiation particles combined — high energy flux means the radiation can do more damage.',
    color: 'plasma',
  },
  {
    id: 5,
    title: 'Stopping Power',
    symbol: 'S(E)',
    formula: 'S(E) = −dE/dx',
    value: '184.3',
    unit: 'MeV·cm²/g',
    explanation: 'Measures how quickly a radiation particle loses its energy as it travels through material — determines how deeply radiation penetrates.',
    color: 'ion',
  },
  {
    id: 6,
    title: 'Absorbed Dose',
    symbol: 'D',
    formula: 'D = (1.602×10⁻¹⁰) ∫ Φ(E)·S(E) dE',
    value: '0.72',
    unit: 'Gray (Gy)',
    explanation: 'The final result — how much radiation energy is actually deposited inside the astronaut\'s body or equipment. This is what determines health risk.',
    color: 'warn',
  },
];
