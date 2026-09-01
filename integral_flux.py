def integral_flux(energy, flux, threshold):
    total = 0

    for i in range(len(energy) - 1):
        if energy[i] >= threshold:
            width = energy[i + 1] - energy[i]
            height = (flux[i] + flux[i + 1]) / 2
            total += height * width

    return total


# Example
energy = [10, 20, 30, 40, 50, 60]
flux = [100, 80, 60, 40, 20, 10]

result = integral_flux(energy, flux, 30)

print("Integral proton flux above 30 MeV:", result)
