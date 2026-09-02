from stoppingpower5 import stoppingpower
import numpy as np
def doseageCalculation(stopping_power, proton_fluence,energy):
    
    c = 1.602e-10
    integral = np.trapezoid(
        proton_fluence * stopping_power,
        energy
    )
    MevToGy = 1.602e-5 * integral
    return MevToGy