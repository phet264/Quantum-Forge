import urllib.request, json, urllib.error
def test(name, qasm):
    print(f"--- {name} ---")
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/simulate/qiskit', 
        data=json.dumps({'qasm': qasm, 'shots': 1024}).encode('utf-8'), 
        headers={'Content-Type': 'application/json'}
    )
    try:
        res = json.loads(urllib.request.urlopen(req).read().decode())
        print("Counts:", res.get("counts"))
        print("StateVector (first 4):", res.get("stateVector")[:4] if res.get("stateVector") else None)
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.read().decode())

test("H Gate", 'OPENQASM 2.0; include "qelib1.inc"; qreg q[1]; creg c[1]; h q[0];')
test("X Gate", 'OPENQASM 2.0; include "qelib1.inc"; qreg q[1]; creg c[1]; x q[0];')
test("Bell State", 'OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; creg c[2]; h q[0]; cx q[0],q[1];')
