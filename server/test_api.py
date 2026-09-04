import urllib.request
import json

print("Health:")
try:
    print(urllib.request.urlopen('http://127.0.0.1:8000/health').read().decode())
except Exception as e:
    print(e)

print("Simulate:")
qasm = """OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];
"""
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/simulate/qiskit', 
    data=json.dumps({'qasm': qasm, 'shots': 1024}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
try:
    print(urllib.request.urlopen(req).read().decode())
except Exception as e:
    print(e)
