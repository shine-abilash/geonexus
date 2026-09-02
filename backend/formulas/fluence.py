import numpy as np

def calculate_fluence(J, t):
    J = np.array(J, dtype=float)
    t = np.array(t, dtype=float)

    if len(J) != len(t):
        raise ValueError("J and t must be the same length")

    if len(J) < 2:
        raise ValueError("Need at least 2 data points to integrate")

    if hasattr(np, "trapezoid"):
        fluence = np.trapezoid(J, t)
    else:
        fluence = np.trapz(J, t)

    return fluence