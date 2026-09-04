import qiskit
from qiskit_aer import AerSimulator
import json

sim = AerSimulator()
# 1. Base circuit without measurements
qc = qiskit.QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# 2. Add measurements to a copy for counts (if shots > 0)
qc_meas = qc.copy()
qc_meas.measure_all()

# Transpile for simulator
qc_meas = qiskit.transpile(qc_meas, sim)
result_counts = sim.run(qc_meas, shots=1024).result()
counts = result_counts.get_counts(qc_meas)

# 3. Get statevector (use save_statevector for AerSimulator)
qc_sv = qc.copy()
qc_sv.save_statevector()
qc_sv = qiskit.transpile(qc_sv, sim)
result_sv = sim.run(qc_sv, shots=0).result()
sv = result_sv.get_statevector(qc_sv)

# Format SV to frontend schema
state_vector_formatted = [{"real": float(amp.real), "imag": float(amp.imag)} for amp in sv]

print(json.dumps({"counts": counts, "stateVector": state_vector_formatted[:4]}, indent=2))
