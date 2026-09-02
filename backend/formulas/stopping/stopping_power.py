import numpy as np
import pandas as pd
from pathlib import Path


# ============================================================
# MATERIAL DATABASE
# ============================================================

MATERIALS = {
    "aluminum": {
        "name": "Aluminum",
        "density": 2.69890,
        "file": "aluminum.csv"
    },

    "copper": {
        "name": "Copper",
        "density": 8.96,
        "file": "copper.csv"
    },

    "iron": {
        "name": "Iron",
        "density": 7.874,
        "file": "iron.csv"
    },

    "titanium": {
        "name": "Titanium",
        "density": 4.506,
        "file": "titanium.csv"
    },

    "water": {
        "name": "Water",
        "density": 1.0,
        "file": "water.csv"
    },

    "polyethylene": {
        "name": "Polyethylene",
        "density": 0.94,
        "file": "polyethylene.csv"
    },

    "silicon": {
        "name": "Silicon",
        "density": 2.329,
        "file": "silicon.csv"
    },

    "carbon": {
        "name": "Carbon",
        "density": 2.267,
        "file": "carbon.csv"
    }
}


# ============================================================
# NIST DATA DIRECTORY
# ============================================================

DATA_DIR = Path("nist_data")


# ============================================================
# SHOW AVAILABLE MATERIALS
# ============================================================

def show_materials():

    print()
    print("Available Materials")
    print("-------------------")

    for number, material in enumerate(MATERIALS, start=1):

        name = MATERIALS[material]["name"]

        print(f"{number}. {name}")


# ============================================================
# LOAD NIST PSTAR DATA
# ============================================================

def load_nist_data(material):

    material = material.lower()

    if material not in MATERIALS:

        raise ValueError(
            f"Unknown material: {material}"
        )

    filename = MATERIALS[material]["file"]

    data_path = DATA_DIR / filename

    if not data_path.exists():

        raise FileNotFoundError(
            f"NIST data file not found:\n{data_path}"
        )

    data = pd.read_csv(data_path)

    required_columns = [
        "energy_mev",
        "electronic_stopping",
        "nuclear_stopping",
        "total_stopping",
        "csda_range",
        "projected_range",
        "detour_factor"
    ]

    for column in required_columns:

        if column not in data.columns:

            raise ValueError(
                f"Missing column '{column}' "
                f"in {data_path}"
            )

    data = data.sort_values(
        "energy_mev"
    )

    return data


# ============================================================
# GET MATERIAL DENSITY
# ============================================================

def get_density(material):

    material = material.lower()

    if material not in MATERIALS:

        raise ValueError(
            f"Unknown material: {material}"
        )

    return MATERIALS[material]["density"]


# ============================================================
# MASS STOPPING POWER
# ============================================================

def get_mass_stopping_power(
    proton_energy_mev,
    material
):

    data = load_nist_data(material)

    energies = data[
        "energy_mev"
    ].to_numpy()

    stopping_power = data[
        "total_stopping"
    ].to_numpy()

    if proton_energy_mev < energies.min():

        raise ValueError(
            f"Energy {proton_energy_mev} MeV "
            f"is below NIST data range."
        )

    if proton_energy_mev > energies.max():

        raise ValueError(
            f"Energy {proton_energy_mev} MeV "
            f"is above NIST data range."
        )

    mass_stopping = np.interp(
        proton_energy_mev,
        energies,
        stopping_power
    )

    return mass_stopping


# ============================================================
# LINEAR STOPPING POWER
# ============================================================

def calculate_stopping_power(
    proton_energy_mev,
    material
):

    density = get_density(material)

    mass_stopping = get_mass_stopping_power(
        proton_energy_mev,
        material
    )

    linear_stopping = (
        mass_stopping * density
    )

    return linear_stopping


# ============================================================
# CSDA RANGE
# ============================================================

def get_csda_range(
    proton_energy_mev,
    material
):

    data = load_nist_data(material)

    energies = data[
        "energy_mev"
    ].to_numpy()

    ranges = data[
        "csda_range"
    ].to_numpy()

    if proton_energy_mev < energies.min():

        raise ValueError(
            "Energy is below NIST range."
        )

    if proton_energy_mev > energies.max():

        raise ValueError(
            "Energy is above NIST range."
        )

    csda_range = np.interp(
        proton_energy_mev,
        energies,
        ranges
    )

    return csda_range


# ============================================================
# PHYSICAL RANGE
# ============================================================

def get_physical_range(
    proton_energy_mev,
    material
):

    density = get_density(material)

    csda_range = get_csda_range(
        proton_energy_mev,
        material
    )

    physical_range = (
        csda_range / density
    )

    return physical_range


# ============================================================
# ENERGY AFTER SHIELD
# ============================================================

def calculate_energy_after_shield(
    proton_energy_mev,
    thickness_cm,
    material
):

    density = get_density(material)

    # Areal density
    shield_areal_density = (
        thickness_cm * density
    )

    initial_range = get_csda_range(
        proton_energy_mev,
        material
    )

    # --------------------------------------------------------
    # Proton stops inside shield
    # --------------------------------------------------------

    if shield_areal_density >= initial_range:

        energy_deposited = proton_energy_mev

        remaining_energy = 0.0

        stopped = True

        return (
            energy_deposited,
            remaining_energy,
            stopped
        )

    # --------------------------------------------------------
    # Proton passes through shield
    # --------------------------------------------------------

    remaining_range = (
        initial_range
        - shield_areal_density
    )

    data = load_nist_data(material)

    energies = data[
        "energy_mev"
    ].to_numpy()

    ranges = data[
        "csda_range"
    ].to_numpy()

    remaining_energy = np.interp(
        remaining_range,
        ranges,
        energies
    )

    energy_deposited = (
        proton_energy_mev
        - remaining_energy
    )

    stopped = False

    return (
        energy_deposited,
        remaining_energy,
        stopped
    )


# ============================================================
# CALCULATE ONE MATERIAL
# ============================================================

def calculate_material(
    proton_energy_mev,
    thickness_cm,
    material
):

    material_info = MATERIALS[
        material.lower()
    ]

    density = material_info["density"]

    mass_stopping = get_mass_stopping_power(
        proton_energy_mev,
        material
    )

    linear_stopping = calculate_stopping_power(
        proton_energy_mev,
        material
    )

    csda_range = get_csda_range(
        proton_energy_mev,
        material
    )

    physical_range = get_physical_range(
        proton_energy_mev,
        material
    )

    (
        energy_deposited,
        remaining_energy,
        stopped
    ) = calculate_energy_after_shield(
        proton_energy_mev,
        thickness_cm,
        material
    )

    return {
        "material": material_info["name"],
        "density": density,
        "mass_stopping": mass_stopping,
        "linear_stopping": linear_stopping,
        "csda_range": csda_range,
        "physical_range": physical_range,
        "energy_deposited": energy_deposited,
        "remaining_energy": remaining_energy,
        "stopped": stopped
    }


# ============================================================
# USER INPUT
# ============================================================

def main():

    print()
    print("==========================================")
    print("     PROTON STOPPING POWER CALCULATOR")
    print("==========================================")

    show_materials()

    print()

    material_number = int(
        input("Select material number: ")
    )

    material_list = list(MATERIALS.keys())

    if (
        material_number < 1
        or material_number > len(material_list)
    ):

        raise ValueError(
            "Invalid material selection."
        )

    material = material_list[
        material_number - 1
    ]

    print()

    proton_energy = float(
        input(
            "Enter proton energy (MeV): "
        )
    )

    thickness_mm = float(
        input(
            "Enter shield thickness (mm): "
        )
    )

    thickness_cm = (
        thickness_mm / 10
    )

    # ========================================================
    # CALCULATION
    # ========================================================

    result = calculate_material(
        proton_energy,
        thickness_cm,
        material
    )

    # ========================================================
    # OUTPUT
    # ========================================================

    print()
    print("==========================================")
    print("             RESULTS")
    print("==========================================")

    print()
    print(
        f"Material             : "
        f"{result['material']}"
    )

    print(
        f"Density              : "
        f"{result['density']} g/cm^3"
    )

    print(
        f"Proton Energy        : "
        f"{proton_energy:.4f} MeV"
    )

    print()
    print(
        f"Mass Stopping Power  : "
        f"{result['mass_stopping']:.4f} "
        f"MeV cm^2/g"
    )

    print(
        f"Linear Stopping Power: "
        f"{result['linear_stopping']:.4f} "
        f"MeV/cm"
    )

    print()
    print(
        f"CSDA Range           : "
        f"{result['csda_range']:.6f} g/cm^2"
    )

    print(
        f"Physical Range       : "
        f"{result['physical_range']:.6f} cm"
    )

    print(
        f"Physical Range       : "
        f"{result['physical_range'] * 10:.4f} mm"
    )

    print()
    print(
        f"Shield Thickness     : "
        f"{thickness_mm:.2f} mm"
    )

    print(
        f"Energy Deposited     : "
        f"{result['energy_deposited']:.4f} MeV"
    )

    print(
        f"Energy Remaining     : "
        f"{result['remaining_energy']:.4f} MeV"
    )

    print()

    if result["stopped"]:

        print(
            "Proton Status        : "
            "STOPPED INSIDE SHIELD"
        )

    else:

        print(
            "Proton Status        : "
            "PASSED THROUGH SHIELD"
        )

    print()
    print("==========================================")
    print("          CALCULATION COMPLETE")
    print("==========================================")


if __name__ == "__main__":

    main()