import numpy as np
import pandas as pd

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
def proton_flux_module(row):

    flux_1_10 = row["P<10"]
    flux_10_30 = row["P<30"] - row["P<10"]
    flux_30_50 = row["P<50"] - row["P<30"]

    return np.array([
        flux_1_10,
        flux_10_30,
        flux_30_50
    ])


energy = np.array([
    np.sqrt(1 * 10),     
    np.sqrt(10 * 30),     
    np.sqrt(30 * 50)     
])

print("\nRepresentative Energies:")
print(energy)

def energy_flux_module(energy, flux):

    integrand = energy * flux

    F_E = np.trapz(integrand, energy)

    return F_E

# print("\n===== FINAL ENERGY FLUX =====")

# results = []

# for _, row in lstm_output.iterrows():

#     J = proton_flux_module(row)

#     F_E = energy_flux_module(energy, J)

#     results.append({
#         "time": row["time"],
#         "Energy_Flux": F_E
#     })

# results_df = pd.DataFrame(results)

# print(results_df)