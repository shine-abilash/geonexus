import re
import csv
from pathlib import Path


# ============================================================
# FILE PATHS
# ============================================================

input_file = Path("nist_aluminum_pstar_raw.txt")
output_file = Path("nist_aluminum_pstar.csv")


# ============================================================
# READ NIST TEXT
# ============================================================

if not input_file.exists():
    raise FileNotFoundError(
        f"Could not find {input_file}"
    )

text = input_file.read_text()


# ============================================================
# EXTRACT NUMERIC DATA ROWS
# ============================================================

rows = []

for line in text.splitlines():

    line = line.strip()

    # Ignore empty/header lines
    if not line:
        continue

    # NIST data rows contain 7 numerical values
    parts = line.split()

    if len(parts) != 7:
        continue

    try:

        values = [
            float(value)
            for value in parts
        ]

    except ValueError:
        continue

    rows.append(values)


# ============================================================
# CHECK DATA
# ============================================================

print()
print("==========================================")
print("       NIST DATA CONVERSION")
print("==========================================")

print()
print(f"Rows detected: {len(rows)}")


if len(rows) == 0:
    raise ValueError(
        "No NIST data rows were detected."
    )


# ============================================================
# WRITE CSV
# ============================================================

headers = [
    "energy_mev",
    "electronic_stopping",
    "nuclear_stopping",
    "total_stopping",
    "csda_range",
    "projected_range",
    "detour_factor"
]


with output_file.open(
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.writer(file)

    writer.writerow(headers)

    writer.writerows(rows)


# ============================================================
# DISPLAY INFORMATION
# ============================================================

print()
print(f"CSV created: {output_file}")

print(
    f"Energy range: "
    f"{rows[0][0]} MeV → {rows[-1][0]} MeV"
)

print(
    f"Number of data points: "
    f"{len(rows)}"
)

print()
print("First data row:")
print(rows[0])

print()
print("Last data row:")
print(rows[-1])

print()
print("==========================================")
print("       CONVERSION COMPLETE")
print("==========================================")