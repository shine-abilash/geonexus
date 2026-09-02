import numpy as np

def calculate_spectral_index(energy, flux):
    log_energy = np.log(energy)
    log_flux = np.log(flux)

    slope, intercept = np.polyfit(log_energy, log_flux, 1)

    gamma = -slope
    J0 = np.exp(intercept)

    return gamma, J0


energy = np.array([10, 20, 40, 80, 100])
flux = np.array([1000, 500, 250, 125, 100])

gamma, J0 = calculate_spectral_index(energy, flux)

print("Spectral Index (γ):", gamma)
print("Normalization constant (J0):", J0)