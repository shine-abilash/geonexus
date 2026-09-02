import numpy as np
import pandas as pd
from pathlib import Path

NIST_FILE = Path(__file__).resolve().parent / "stopping" / "nist_data" / "aluminum.csv"
DENSITY = 2.6989  # g/cm³


def calculate_stopping_power(proton_energy, thickness_mm):

    data = pd.read_csv(NIST_FILE)
    energy = data["energy_mev"].to_numpy()
    stopping = data["total_stopping"].to_numpy()
    csda_range = data["csda_range"].to_numpy()

    if not energy.min() <= proton_energy <= energy.max():
        raise ValueError(
            f"Energy {proton_energy:.3f} MeV is outside "
            f"the NIST data range ({energy.min():.3f} - {energy.max():.3f} MeV)."
        )

    stopping_power = np.interp(proton_energy, energy, stopping)
    mass_thickness = DENSITY * (thickness_mm / 10)
    initial_range = np.interp(proton_energy, energy, csda_range)
    remaining_range = initial_range - mass_thickness

    remaining_energy = (
        0.0 if remaining_range <= 0
        else np.interp(remaining_range, csda_range, energy)
    )

    energy_loss = proton_energy - remaining_energy

    return {
        "proton_energy": proton_energy,
        "material": "Aluminum",
        "thickness_mm": thickness_mm,
        "stopping_power": stopping_power,
        "energy_loss": energy_loss,
        "remaining_energy": remaining_energy
    }


if __name__ == "__main__":

    energies = np.array([
        np.sqrt(1 * 10),
        np.sqrt(10 * 30),
        np.sqrt(30 * 50)
    ])
    thicknesses = [1, 2, 3, 4, 5]

    print("\n==============================================")
    print("   PROTO FLUX - ALUMINUM SHIELDING")
    print("==============================================")

    for proton_energy in energies:
        print(f"\nProton Energy: {proton_energy:.3f} MeV")
        print("-" * 46)

        for thickness in thicknesses:
            result = calculate_stopping_power(proton_energy, thickness)

            print(
                f"Thickness: {thickness} mm"
                f" | Stopping Power: {result['stopping_power']:.4f} MeV cm²/g"
                f" | Energy Loss: {result['energy_loss']:.4f} MeV"
                f" | Remaining Energy: {result['remaining_energy']:.4f} MeV"
            )