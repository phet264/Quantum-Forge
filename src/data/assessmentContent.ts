import type { Assessment } from '../types/assessment'

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-1',
    moduleId: 'mod-1',
    title: 'Quantum Measurement Basics',
    description: 'Test your understanding of superposition, measurement, and probability in quantum systems.',
    difficulty: 'Beginner',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        title: 'Superposition Outcomes',
        description: 'If a qubit is in an equal superposition of |0⟩ and |1⟩, what is the probability of measuring 0?',
        points: 10,
        options: ['0%', '50%', '100%', 'It depends on the observer'],
        correctOptionIndex: 1,
        explanation: 'An equal superposition (like the |+⟩ state created by a Hadamard gate) has a 50% chance of collapsing to |0⟩ and a 50% chance of collapsing to |1⟩ upon measurement.'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        title: 'Measurement Effect',
        description: 'What happens to a qubit immediately after it is measured?',
        points: 10,
        options: [
          'It returns to its initial state',
          'It remains in superposition',
          'It collapses to the measured state',
          'It becomes entangled'
        ],
        correctOptionIndex: 2,
        explanation: 'Measurement causes the quantum state to collapse to the basis state that was observed (e.g., |0⟩ or |1⟩).'
      }
    ]
  },
  {
    id: 'assess-2',
    moduleId: 'mod-2',
    title: 'Bell State Challenge',
    description: 'Construct the fundamental entangled state.',
    difficulty: 'Intermediate',
    passingScore: 100,
    questions: [
      {
        id: 'q-bell',
        type: 'circuit_challenge',
        title: 'Create a Bell State',
        description: 'Use the Circuit Builder to create a standard |Φ⁺⟩ Bell state. The state should produce a 50/50 measurement distribution of 00 and 11.',
        points: 50,
        initialQubits: 2,
        criteria: {
          targetProbabilities: {
            "00": 0.5,
            "11": 0.5
          },
          rules: [
            { type: 'must_not_be_empty', errorMessage: "Your circuit is currently empty." },
            { type: 'must_have_gate', gate: 'H', errorMessage: "This challenge requires a Hadamard (H) gate to put a qubit into superposition." },
            { type: 'must_entangle', errorMessage: "Your circuit might put a qubit into superposition, but the two qubits are not entangled. Missing: A controlled operation connecting the qubits." }
          ]
        },
        hint: "A Hadamard gate can create a superposition, but you need a multi-qubit gate to entangle them.",
        solution: {
          circuitDescription: "Apply a Hadamard (H) gate to q0, then apply a CNOT (CX) gate with q0 as the control and q1 as the target.",
          expectedResultDescription: "The measurement should yield |00⟩ and |11⟩ with roughly 50% probability each.",
          expectedCircuitQasm: "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[2];\nh q[0];\ncx q[0],q[1];"
        },
        explanation: 'A Bell state requires a Hadamard gate to create superposition on the first qubit, followed by a CNOT gate to entangle the second qubit.'
      },
      {
        id: 'q-superposition',
        type: 'circuit_challenge',
        title: 'Create a Superposition',
        description: 'Using the Circuit Builder, build a circuit that puts a single qubit into an equal superposition.',
        points: 50,
        initialQubits: 1,
        criteria: {
          targetProbabilities: {
            "0": 0.5,
            "1": 0.5
          },
          rules: [
            { type: 'must_not_be_empty', errorMessage: "Your circuit is currently empty." },
            { type: 'must_have_gate', gate: 'H', errorMessage: "This challenge requires a Hadamard (H) gate to enter a superposition." },
            { type: 'banned_gate', gate: 'X', errorMessage: "Your circuit currently has an X gate, but this challenge requires a qubit to enter a superposition." }
          ]
        },
        hint: "There is a single-qubit gate that maps the computational basis states to an equal superposition.",
        solution: {
          circuitDescription: "Apply a Hadamard (H) gate to q0.",
          expectedResultDescription: "The measurement should yield |0⟩ and |1⟩ with roughly 50% probability each.",
          expectedCircuitQasm: "OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[1];\nh q[0];"
        },
        explanation: 'A Hadamard gate places the qubit in a superposition of |0⟩ and |1⟩.'
      }
    ]
  }
]
