from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

sim = AerSimulator()

def test_circuit(name, qc):
    qc.measure_all()
    compiled_circuit = transpile(qc, sim)
    job = sim.run(compiled_circuit, shots=1024)
    result = job.result()
    counts = result.get_counts(compiled_circuit)
    print(f"--- {name} ---")
    print(counts)

qc_h = QuantumCircuit(1)
qc_h.h(0)
test_circuit("H Gate", qc_h)

qc_x = QuantumCircuit(1)
qc_x.x(0)
test_circuit("X Gate", qc_x)

qc_bell = QuantumCircuit(2)
qc_bell.h(0)
qc_bell.cx(0, 1)
test_circuit("Bell State", qc_bell)
