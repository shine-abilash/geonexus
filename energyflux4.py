import numpy as np
import pandas as pd

# =====================================================
# STEP 1 : MOCK LSTM OUTPUT
# =====================================================

print("\n===== LSTM OUTPUT =====")

lstm_output = pd.DataFrame({
    "time": [
        "2026-01-01 00:00",
        "2026-01-01 01:00",
        "2026-01-01 02:00"
    ],
    "P<10": [100, 120, 110],
    "P<30": [180, 210, 190],
    "P<50": [230, 260, 240]
})

print(lstm_output)

# =====================================================
# STEP 2 : MOCK PROTON FLUX MODULE
# Converts cumulative channels to differential flux
# =====================================================

print("\n===== PROTON FLUX MODULE =====")

def proton_flux_module(row):

    flux_1_10 = row["P<10"]
    flux_10_30 = row["P<30"] - row["P<10"]
    flux_30_50 = row["P<50"] - row["P<30"]

    return np.array([
        flux_1_10,
        flux_10_30,
        flux_30_50
    ])


# =====================================================
# STEP 3 : ENERGY CHANNELS
# =====================================================

energy = np.array([
    np.sqrt(1 * 10),      # 1-10 MeV
    np.sqrt(10 * 30),     # 10-30 MeV
    np.sqrt(30 * 50)      # 30-50 MeV
])

print("\nRepresentative Energies:")
print(energy)

# =====================================================
# STEP 4 : ENERGY FLUX MODULE
# F_E = ∫ E J(E,t) dE
# =====================================================

def energy_flux_module(energy, flux):

    integrand = energy * flux

    F_E = np.trapz(integrand, energy)

    return F_E


# =====================================================
# STEP 5 : COMPLETE PIPELINE
# =====================================================

print("\n===== FINAL ENERGY FLUX =====")

results = []

for _, row in lstm_output.iterrows():

    # output of proton flux module
    J = proton_flux_module(row)

    # energy flux
    F_E = energy_flux_module(energy, J)

    results.append({
        "time": row["time"],
        "Energy_Flux": F_E
    })

results_df = pd.DataFrame(results)

print(results_df)