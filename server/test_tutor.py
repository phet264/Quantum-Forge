import urllib.request
import json
import urllib.error

def test_tutor(name, prompt, qasm=None, sim_summary=None):
    print(f"\n{'='*50}\nTEST: {name}\nPROMPT: {prompt}\n{'-'*50}")
    ctx = {}
    if qasm: 
        ctx['circuit'] = {
            "numQubits": 1 if "q[1]" in qasm else 2,
            "depth": 1,
            "operations": [{"type": "X", "targets": [0], "controls": [], "timeStep": 0}],
            "qasm": qasm
        }
    if sim_summary: 
        ctx['simulation'] = sim_summary

    req_data = {
        "messages": [{"role": "user", "content": prompt}],
        "context": ctx
    }
    
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/tutor/chat', 
        data=json.dumps(req_data).encode('utf-8'), 
        headers={'Content-Type': 'application/json'}
    )
    try:
        res = json.loads(urllib.request.urlopen(req).read().decode())
        print(res.get("reply", "No reply in response"))
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.read().decode())
    except Exception as e:
        print("Error:", e)

# 6. Test: "Explain my circuit" with X q0
test_tutor(
    "Explain my circuit (X gate)", 
    "Explain my circuit", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nx q[0];'
)

# 12. Test H gate simulation
test_tutor(
    "Why these probabilities? (H gate)", 
    "Why are the probabilities approximately 50/50?", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];',
    sim_summary={"backend": "qiskit-aer", "shots": 1024, "counts": {"0": 502, "1": 522}, "probabilities": {"0": 0.49, "1": 0.51}}
)

# 13. Test Bell simulation
test_tutor(
    "Why 00 and 11? (Bell state)", 
    "Why do I get approximately 00 and 11?", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];',
    sim_summary={"backend": "qiskit-aer", "shots": 1024, "counts": {"00": 512, "11": 512}, "probabilities": {"00": 0.5, "11": 0.5}}
)

# 8. Test: "Explain each gate"
test_tutor(
    "Explain each gate", 
    "Explain each gate", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];'
)

# 9. Test: "Find an error"
test_tutor(
    "Find an error (Suspicious circuit)", 
    "Find an error", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];\nx q[0];\nh q[0];'
)

# 10. Test: "Optimize my circuit"
test_tutor(
    "Optimize my circuit", 
    "Optimize my circuit", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nx q[0];\nx q[0];'
)

# 11. Test: "Generate Qiskit code"
test_tutor(
    "Generate Qiskit code", 
    "Generate Qiskit code", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0],q[1];'
)

# 14. Test: No simulation data
test_tutor(
    "No simulation data", 
    "Explain my results.", 
    qasm='OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];'
)
