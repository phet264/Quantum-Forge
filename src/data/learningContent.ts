import type { Course, QuantumAlgorithm } from '../types/learning'

export const COURSES: Course[] = [
  {
    id: 'c-fundamentals',
    title: 'Quantum Fundamentals',
    description: 'Learn the core principles of quantum mechanics required for quantum computing.',
    modules: [
      {
        id: 'm-qubits',
        courseId: 'c-fundamentals',
        title: 'Qubits',
        description: 'Introduction to the fundamental unit of quantum information.',
        lessons: [
          {
            id: 'l-intro-qubits',
            moduleId: 'm-qubits',
            title: 'What is a Qubit?',
            description: 'Understand the difference between classical bits and qubits.',
            objective: 'Understand how qubits differ from classical bits and how their states determine measurement probabilities.',
            blocks: [
              {
                type: 'theory',
                content: 'A **qubit** (quantum bit) is the basic unit of quantum information. Unlike a classical bit, which must be strictly $0$ or $1$, a qubit can exist in a linear combination (superposition) of both states simultaneously.'
              },
              {
                type: 'conceptComparison',
                items: [
                  { title: 'Classical Bit', description: 'Can only be 0 or 1. Like a coin sitting flat on a table (Heads or Tails).' },
                  { title: 'Quantum Bit (Qubit)', description: 'Can be in a state combining 0 and 1. Like a coin spinning in the air.' }
                ]
              },
              {
                type: 'theory',
                content: 'Mathematically, a qubit\'s state is represented by a vector. The two basic states are written as $|0\\rangle$ and $|1\\rangle$. We can visualize this state on a sphere known as the **Bloch Sphere**.'
              },
              {
                type: 'blochSphere'
              },
              {
                type: 'interactiveCircuit',
                title: 'Classical vs Quantum States',
                description: 'Apply the X gate to flip the qubit from $|0\\rangle$ to $|1\\rangle$ like a classical bit. Then reset and apply the H gate to see a quantum superposition.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              },
              {
                type: 'quickCheck',
                question: 'If a qubit is in state $|0\\rangle$ and we apply an X gate, what happens?',
                options: [
                  'It goes into superposition',
                  'It remains $|0\\rangle$',
                  'It flips to $|1\\rangle$',
                  'It gets measured'
                ],
                correctAnswerIndex: 2,
                explanation: 'The X gate acts like a classical NOT gate, flipping the state from $|0\\rangle$ to $|1\\rangle$.'
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: |0⟩ → |1⟩',
                targetCircuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\nx q[0];\n',
                buttonText: 'Build with X Gate'
              },
              {
                type: 'keyTakeaways',
                points: [
                  'A classical bit is either 0 or 1.',
                  'A qubit is represented by a quantum state.',
                  'The Bloch sphere visualizes a single qubit state.'
                ]
              },
              {
                type: 'whyItMatters',
                content: 'Understanding qubits is the foundation for quantum gates, superposition, measurement, and ultimately quantum circuits.'
              }
            ]
          }
        ]
      },
      {
        id: 'm-quantum-states',
        courseId: 'c-fundamentals',
        title: 'Quantum States',
        description: 'Explore state vectors and the mathematics behind quantum states.',
        prerequisites: ['m-qubits'],
        lessons: [
          {
            id: 'l-dirac',
            moduleId: 'm-quantum-states',
            title: 'Quantum States & Dirac Notation',
            description: 'Learn the standard notation for quantum states and amplitudes.',
            objective: 'Understand how amplitudes describe a quantum state and their relation to probabilities.',
            blocks: [
              {
                type: 'theory',
                content: 'Dirac notation, or bra-ket notation, is the standard language of quantum mechanics. A quantum state is written as $|\\psi\\rangle$.'
              },
              {
                type: 'equation',
                content: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle'
              },
              {
                type: 'theory',
                content: 'Here, $\\alpha$ and $\\beta$ are complex numbers called **amplitudes**. Their squared magnitudes give the probability of measuring 0 or 1.'
              },
              {
                type: 'equation',
                content: 'P(0) = |\\alpha|^2, \\quad P(1) = |\\beta|^2'
              },
              {
                type: 'theory',
                content: 'Because the total probability must be 100%, the amplitudes must be normalized:'
              },
              {
                type: 'equation',
                content: '|\\alpha|^2 + |\\beta|^2 = 1'
              },
              {
                type: 'stateVectorVisualization'
              },
              {
                type: 'quickCheck',
                question: 'If a quantum state has amplitudes α = 1 and β = 0, what is the probability of measuring 1?',
                options: ['100%', '50%', '0%', 'It cannot be determined'],
                correctAnswerIndex: 2,
                explanation: 'P(1) = |β|². Since β = 0, P(1) = 0² = 0%.'
              }
            ]
          }
        ]
      },
      {
        id: 'm-measurement',
        courseId: 'c-fundamentals',
        title: 'Measurement',
        description: 'Understand how measuring a quantum system collapses its state.',
        prerequisites: ['m-quantum-states'],
        lessons: [
          {
            id: 'l-collapse',
            moduleId: 'm-measurement',
            title: 'Wavefunction Collapse',
            description: 'The process of observation in quantum systems.',
            objective: 'Learn how observation forces a quantum superposition into a single classical outcome.',
            blocks: [
              {
                type: 'theory',
                content: 'When a qubit in superposition is measured, it collapses to either $|0\\rangle$ or $|1\\rangle$.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Repeated Measurement',
                description: 'Apply the H gate to create superposition, then measure. Repeat to see how the classical outcomes form a probability distribution over many shots.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];\nmeasure q[0] -> c[0];\n'
              },
              {
                type: 'quickCheck',
                question: 'What happens to a qubit immediately after it is measured?',
                options: [
                  'It remains in superposition',
                  'It collapses to the measured classical state',
                  'It gets entangled',
                  'Its amplitudes double'
                ],
                correctAnswerIndex: 1,
                explanation: 'Measurement permanently collapses the quantum state into the basis state corresponding to the measurement outcome.'
              }
            ]
          }
        ]
      },
      {
        id: 'm-superposition',
        courseId: 'c-fundamentals',
        title: 'Superposition',
        description: 'The ability of a quantum system to be in multiple states at once.',
        prerequisites: ['m-measurement'],
        lessons: [
          {
            id: 'l-superposition-basics',
            moduleId: 'm-superposition',
            title: 'Creating Superposition',
            description: 'Understanding linear combinations and the Hadamard gate.',
            objective: 'Use the Hadamard gate to put a qubit into a balanced superposition.',
            blocks: [
              {
                type: 'theory',
                content: 'The **Hadamard (H) gate** is used to create superposition. When applied to $|0\\rangle$, it creates the $|+\\rangle$ state, which has equal amplitudes for 0 and 1.'
              },
              {
                type: 'equation',
                content: 'H|0\\rangle = |+\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle + \\frac{1}{\\sqrt{2}}|1\\rangle'
              },
              {
                type: 'interactiveCircuit',
                title: 'Hadamard Action',
                description: 'Apply the H gate. Watch how the Bloch vector moves to the equator, and how the probabilities become exactly 50/50.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              },
              {
                type: 'quickCheck',
                question: 'A qubit is in the state (|0⟩ + |1⟩)/√2. What happens when it is measured?',
                options: [
                  'Always |0⟩',
                  'Always |1⟩',
                  '50% |0⟩ and 50% |1⟩',
                  'It produces both classical results simultaneously'
                ],
                correctAnswerIndex: 2,
                explanation: 'The squared magnitude of 1/√2 is 1/2 (50%). You will measure 0 half the time and 1 half the time, but never both at once in a single shot.'
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: |0⟩ → (|0⟩ + |1⟩)/√2',
                targetCircuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\nh q[0];\n',
                buttonText: 'Build with H Gate'
              }
            ]
          }
        ]
      },
      {
        id: 'm-entanglement',
        courseId: 'c-fundamentals',
        title: 'Entanglement',
        description: 'Spooky action at a distance: correlated quantum states.',
        prerequisites: ['m-superposition'],
        lessons: [
          {
            id: 'l-bell-states',
            moduleId: 'm-entanglement',
            title: 'Bell States',
            description: 'The simplest examples of quantum entanglement.',
            objective: 'Build a Bell state using H and CNOT gates to see correlated measurement results.',
            blocks: [
              {
                type: 'theory',
                content: 'Entanglement links two or more qubits such that the state of one cannot be described independently of the others. The most famous examples are the **Bell states**.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Creating Entanglement',
                description: 'We need two qubits. First apply H to q0 to create superposition. Then apply a Controlled-NOT (CX) with q0 as control and q1 as target. This creates the state $(|00\\rangle + |11\\rangle)/\\sqrt{2}$.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\n'
              },
              {
                type: 'quickCheck',
                question: 'If you measure q0 of the Bell state (|00⟩ + |11⟩)/√2 and get 0, what will a measurement of q1 yield?',
                options: [
                  '0',
                  '1',
                  '50% 0, 50% 1',
                  'It is completely random'
                ],
                correctAnswerIndex: 0,
                explanation: 'Because the state only contains |00⟩ and |11⟩, if q0 is measured as 0, the state collapses entirely to |00⟩, meaning q1 must also be 0.'
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: Bell State',
                targetCircuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0],q[1];\n',
                buttonText: 'Build Bell State'
              }
            ]
          }
        ]
      },
      {
        id: 'm-gates',
        courseId: 'c-fundamentals',
        title: 'Quantum Gates',
        description: 'Operations that manipulate quantum states.',
        prerequisites: ['m-entanglement'],
        lessons: [
          {
            id: 'l-single-qubit-gates',
            moduleId: 'm-gates',
            title: 'Single Qubit Gates',
            description: 'Pauli, Hadamard, and Phase gates.',
            objective: 'Observe how different quantum gates manipulate the state vector and Bloch sphere.',
            blocks: [
              {
                type: 'theory',
                content: 'Quantum gates are operations that change a qubit\'s state. Mathematically, they are unitary matrices.'
              },
              {
                type: 'conceptComparison',
                items: [
                  { title: 'X Gate', description: 'Flips the amplitude of |0⟩ and |1⟩ (rotation around X axis).' },
                  { title: 'Z Gate', description: 'Flips the phase of |1⟩ (rotation around Z axis).' }
                ]
              },
              {
                type: 'interactiveCircuit',
                title: 'Gate Explorer',
                description: 'Try applying X, H, and Z gates in different orders and observe the Bloch vector.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              }
            ]
          }
        ]
      },
      {
        id: 'm-bloch-sphere',
        courseId: 'c-fundamentals',
        title: 'Bloch Sphere',
        description: 'A geometric representation of a qubit state.',
        prerequisites: ['m-gates'],
        lessons: [
          {
            id: 'l-bloch-viz',
            moduleId: 'm-bloch-sphere',
            title: 'Visualizing Qubits',
            description: 'Mapping the complex state vector to a 3D sphere.',
            objective: 'Master the geometric intuition of single qubit states using the Bloch sphere.',
            blocks: [
              {
                type: 'theory',
                content: 'The Bloch sphere represents the state of a single qubit as a point on the surface of a sphere. The poles represent $|0\\rangle$ (North) and $|1\\rangle$ (South), while the equator represents equal superpositions with different phases.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Bloch Rotations',
                description: 'Apply an H gate to reach the equator (|+⟩). Then apply a Z gate to flip the phase to |−⟩ (moving to the opposite side of the equator).',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c-circuit-theory',
    title: 'Circuit Design Theory',
    description: 'Learn the concepts needed before building quantum circuits.',
    modules: [
      {
        id: 'm-circuit-basics',
        courseId: 'c-circuit-theory',
        title: 'Qubits & Wires',
        description: 'How to read and construct quantum circuit diagrams.',
        lessons: [
          {
            id: 'l-wires',
            moduleId: 'm-circuit-basics',
            title: 'Wires and Flow',
            description: 'Time evolution in a circuit diagram.',
            objective: 'Read basic circuit diagram flow.',
            blocks: [
              { type: 'theory', content: 'In a quantum circuit, horizontal lines represent qubits over time, moving left to right.' }
            ]
          }
        ]
      },
      {
        id: 'm-circuit-gates',
        courseId: 'c-circuit-theory',
        title: 'Gates',
        description: 'Applying operators in circuits.',
        prerequisites: ['m-circuit-basics'],
        lessons: [
          {
            id: 'l-applying-gates',
            moduleId: 'm-circuit-gates',
            title: 'Applying Gates',
            description: 'Placing gates on wires.',
            blocks: [
              { type: 'theory', content: 'Gates act as operators changing the state of the qubits they are applied to.' }
            ]
          }
        ]
      },
      {
        id: 'm-circuit-measurement',
        courseId: 'c-circuit-theory',
        title: 'Measurements',
        description: 'Extracting classical information.',
        prerequisites: ['m-circuit-gates'],
        lessons: [
          {
            id: 'l-measurement-gate',
            moduleId: 'm-circuit-measurement',
            title: 'The Measurement Gate',
            description: 'Converting qubits to classical bits.',
            blocks: [
              { type: 'theory', content: 'Measurement is represented by a meter symbol and maps a qubit state to a classical wire.' }
            ]
          }
        ]
      },
      {
        id: 'm-circuit-composition',
        courseId: 'c-circuit-theory',
        title: 'Circuit Composition',
        description: 'Building complex operations from primitive gates.',
        prerequisites: ['m-circuit-measurement'],
        lessons: [
          {
            id: 'l-composition',
            moduleId: 'm-circuit-composition',
            title: 'Composing Operations',
            description: 'Sequential and parallel execution.',
            blocks: [
              { type: 'theory', content: 'Sequential gates multiply their matrices; parallel gates tensor product their matrices.' }
            ]
          }
        ]
      }
    ]
  }
]

export const ALGORITHMS: QuantumAlgorithm[] = [
  {
    id: 'a-deutsch-jozsa',
    title: 'Deutsch-Jozsa Algorithm',
    description: 'Determines if a function is constant or balanced in a single evaluation.',
    difficulty: 'Beginner',
    theory: 'The Deutsch-Jozsa algorithm demonstrates exponential speedup over classical algorithms for a specific problem: determining if a black-box function is constant or balanced.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[1];\nx q[1];\nh q[0];\nh q[1];\ncx q[0],q[1];\nh q[0];\nmeasure q[0] -> c[0];\n'
  },
  {
    id: 'a-grover',
    title: 'Grover\'s Algorithm',
    description: 'Provides quadratic speedup for unstructured search problems.',
    difficulty: 'Intermediate',
    theory: 'Grover\'s algorithm uses amplitude amplification to increase the probability of measuring the correct answer in an unstructured database.',
    prerequisites: ['c-fundamentals', 'c-circuit-theory'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\nh q[1];\ncz q[0],q[1];\nh q[0];\nh q[1];\nz q[0];\nz q[1];\ncz q[0],q[1];\nh q[0];\nh q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-teleportation',
    title: 'Quantum Teleportation',
    description: 'Transfers quantum information between qubits using entanglement and classical communication.',
    difficulty: 'Intermediate',
    theory: 'Teleportation destroys the original quantum state and recreates it elsewhere, bypassing the no-cloning theorem using Bell states.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[2];\nh q[1];\ncx q[1],q[2];\ncx q[0],q[1];\nh q[0];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-bernstein-vazirani',
    title: 'Bernstein-Vazirani',
    description: 'Finds a hidden binary string in one query.',
    difficulty: 'Beginner',
    theory: 'An extension of Deutsch-Jozsa that extracts a hidden string using quantum parallelism and interference.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[2];\nx q[2];\nh q[0];\nh q[1];\nh q[2];\ncx q[0],q[2];\ncx q[1],q[2];\nh q[0];\nh q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-simon',
    title: 'Simon\'s Algorithm',
    description: 'Finds a hidden period in a function with exponential speedup.',
    difficulty: 'Advanced',
    theory: 'Simon\'s algorithm provided the inspiration for Shor\'s algorithm by showing how quantum computers can solve period-finding problems efficiently.',
    prerequisites: ['a-deutsch-jozsa']
  },
  {
    id: 'a-qft',
    title: 'Quantum Fourier Transform',
    description: 'The quantum analogue of the discrete Fourier transform.',
    difficulty: 'Advanced',
    theory: 'QFT is a core subroutine in many quantum algorithms, including Shor\'s algorithm and phase estimation.',
    prerequisites: ['a-grover']
  }
]
