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
                content: 'In classical computing, information is stored in **bits**. A classical bit is deterministically either a 0 or a 1. There is no ambiguity about its state before you read it.'
              },
              {
                type: 'theory',
                content: 'A **qubit** (quantum bit) is the basic unit of quantum information. Instead of being strictly 0 or 1, a qubit is described by a **quantum state**. This state assigns mathematical weights, called amplitudes, to the two fundamental computational basis states: |0⟩ and |1⟩.'
              },
              {
                type: 'conceptComparison',
                items: [
                  { title: 'Classical Bit', description: 'Always exactly 0 or exactly 1. Reading it simply reveals its existing state.' },
                  { title: 'Quantum Bit (Qubit)', description: 'Described by a quantum state. Measuring it produces a classical 0 or 1 according to probabilities defined by the state.' }
                ]
              },
              {
                type: 'theory',
                content: 'We can visualize the state of a single, unentangled qubit geometrically on a sphere known as the **Bloch Sphere**. The north pole represents the state |0⟩, and the south pole represents the state |1⟩.'
              },
              {
                type: 'blochSphere'
              },
              {
                type: 'interactiveCircuit',
                title: 'Classical vs Quantum States',
                description: 'By default, a qubit starts in the state |0⟩. Apply the X gate below to flip it from |0⟩ to |1⟩. Notice how the Bloch vector points straight down. Then, press Reset and apply the H gate to place the qubit in a state that assigns equal probability to 0 and 1.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              },
              {
                type: 'quickCheck',
                question: 'If a qubit is in the state |0⟩ and we apply an X gate, what happens?',
                options: [
                  'It enters a superposition of 0 and 1.',
                  'It remains in the state |0⟩.',
                  'It flips to the state |1⟩.',
                  'It is immediately measured.'
                ],
                correctAnswerIndex: 2,
                explanation: 'The X gate acts similarly to a classical NOT gate. It deterministically flips the quantum state from |0⟩ to |1⟩.'
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
                  'A classical bit is strictly 0 or 1.',
                  'A qubit is described by a quantum state.',
                  'The basis states are written as |0⟩ and |1⟩.',
                  'The Bloch sphere visualizes a single qubit state.'
                ]
              },
              {
                type: 'whyItMatters',
                content: 'Understanding that qubits are defined by quantum states rather than classical values is the first step toward understanding how quantum computers can process information differently than classical computers.'
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
            objective: 'Understand how amplitudes describe a quantum state and mathematically relate to measurement probabilities.',
            blocks: [
              {
                type: 'theory',
                content: 'To describe quantum states mathematically, we use **Dirac notation** (or bra-ket notation). A generic quantum state is written as |ψ⟩.'
              },
              {
                type: 'theory',
                content: 'A single qubit state can be written as a linear combination of the two computational basis states, |0⟩ and |1⟩:'
              },
              {
                type: 'equation',
                content: '|\\psi\\rangle = α|0\\rangle + β|1\\rangle'
              },
              {
                type: 'theory',
                content: 'In this equation, α and β are complex numbers known as **amplitudes**. They are not probabilities themselves. However, their squared magnitudes give us the probability of measuring each corresponding classical outcome.'
              },
              {
                type: 'equation',
                content: 'P(0) = |α|^2, \\quad P(1) = |β|^2'
              },
              {
                type: 'theory',
                content: 'Because the qubit must produce *some* outcome when measured, the sum of all probabilities must equal 1 (or 100%). This requirement is called **normalization**:'
              },
              {
                type: 'equation',
                content: '|α|^2 + |β|^2 = 1'
              },
              {
                type: 'stateVectorVisualization'
              },
              {
                type: 'quickCheck',
                question: 'If a quantum state has amplitudes α = 1 and β = 0, what is the probability of measuring 1?',
                options: ['100%', '50%', '0%', 'It cannot be determined from amplitudes alone.'],
                correctAnswerIndex: 2,
                explanation: 'The probability of measuring 1 is given by P(1) = |β|². Since β = 0, P(1) = 0² = 0%.'
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
            objective: 'Learn how observation forces a quantum state to collapse into a single classical outcome.',
            blocks: [
              {
                type: 'theory',
                content: 'In quantum mechanics, you cannot directly read a qubit\'s amplitudes. To extract information, you must **measure** the qubit.'
              },
              {
                type: 'theory',
                content: 'When you measure a qubit in the computational basis, its quantum state collapses. The qubit will yield a classical 0 with probability P(0) = |α|², or a classical 1 with probability P(1) = |β|². After measurement, the qubit remains permanently in the state corresponding to the observed outcome.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Repeated Measurement (Shots)',
                description: 'Because measurement is probabilistic, quantum algorithms are typically run many times. Each run is called a **shot**. Apply the H gate below to assign equal amplitudes to 0 and 1, then observe the measurement chart to see how repeated shots approximate the theoretical probabilities.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];\nmeasure q[0] -> c[0];\n',
                visualizations: ['stateVector', 'measurement']
              },
              {
                type: 'quickCheck',
                question: 'A qubit is prepared in a state where P(0)=50% and P(1)=50%. We measure it and obtain a classical 1. If we immediately measure it a second time, what will the outcome be?',
                options: [
                  '50% 0, 50% 1',
                  'Always 0',
                  'Always 1',
                  'It depends on the original amplitudes.'
                ],
                correctAnswerIndex: 2,
                explanation: 'The first measurement collapsed the quantum state to |1⟩. Therefore, any immediate subsequent measurement will deterministically yield 1.'
              },
              {
                type: 'whyItMatters',
                content: 'Understanding measurement is essential because every quantum algorithm eventually needs to convert an unobservable quantum state into classical information that we can read and use.'
              }
            ]
          }
        ]
      },
      {
        id: 'm-superposition',
        courseId: 'c-fundamentals',
        title: 'Superposition',
        description: 'The ability of a quantum system to exist in a linear combination of states.',
        prerequisites: ['m-measurement'],
        lessons: [
          {
            id: 'l-superposition-basics',
            moduleId: 'm-superposition',
            title: 'Creating Superposition',
            description: 'Understanding linear combinations and the Hadamard gate.',
            objective: 'Use the Hadamard gate to transform a basis state into a balanced superposition.',
            blocks: [
              {
                type: 'theory',
                content: 'When a qubit\'s state assigns non-zero amplitudes to more than one basis state, we say the qubit is in a **superposition**. This means the state is a linear combination of the basis states. It does not mean the qubit is "both 0 and 1 at the same time." Rather, it has a distinct mathematical state that yields probabilistic outcomes upon measurement.'
              },
              {
                type: 'theory',
                content: 'The **Hadamard (H) gate** is the primary operation used to create superposition. When applied to the state |0⟩, it produces the |+⟩ state, which has equal positive amplitudes for 0 and 1.'
              },
              {
                type: 'equation',
                content: 'H|0\\rangle = |+\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle + \\frac{1}{\\sqrt{2}}|1\\rangle'
              },
              {
                type: 'theory',
                content: 'Let us verify the probabilities. The amplitude for |0⟩ is 1/√2. Therefore, P(0) = |1/√2|² = 1/2 = 50%. The same is true for P(1).'
              },
              {
                type: 'interactiveCircuit',
                title: 'Hadamard Transformation',
                description: 'Apply the H gate to the initial |0⟩ state. Watch the Bloch vector move to the equator, indicating a superposition, and observe how the probabilities become exactly 50/50.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              },
              {
                type: 'quickCheck',
                question: 'A qubit is in the state (|0⟩ + |1⟩) / √2. When we perform a single measurement shot, what result do we observe?',
                options: [
                  'A simultaneous 0 and 1.',
                  'Either a 0 or a 1, completely deterministically.',
                  'Either a 0 or a 1, randomly with 50% probability each.',
                  'A value of 0.5.'
                ],
                correctAnswerIndex: 2,
                explanation: 'A single measurement always produces a single classical result (0 or 1). Because the state is (|0⟩ + |1⟩) / √2, the outcome is probabilistic, with a 50% chance of each.'
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: |0⟩ → ( |0⟩ + |1⟩ ) / √2',
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
        description: 'Correlated quantum states across multiple qubits.',
        prerequisites: ['m-superposition'],
        lessons: [
          {
            id: 'l-bell-states',
            moduleId: 'm-entanglement',
            title: 'Entanglement and Bell States',
            description: 'The simplest examples of quantum entanglement.',
            objective: 'Build a Bell state to understand how two qubits can exhibit perfectly correlated measurement outcomes.',
            blocks: [
              {
                type: 'theory',
                content: 'When we have two qubits, their combined computational basis states are |00⟩, |01⟩, |10⟩, and |11⟩. **Entanglement** occurs when the overall quantum state of the system cannot be factored into independent states for each individual qubit.'
              },
              {
                type: 'theory',
                content: 'The most famous entangled states are the **Bell states**. We can create one by placing the first qubit (q0) into superposition using an H gate, and then applying a Controlled-NOT (CX) gate with q0 as the control and q1 as the target. The resulting state is:'
              },
              {
                type: 'equation',
                content: '|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}|00\\rangle + \\frac{1}{\\sqrt{2}}|11\\rangle'
              },
              {
                type: 'theory',
                content: 'Notice that the states |01⟩ and |10⟩ have an amplitude of zero. This means if we measure both qubits, we will only ever observe 00 or 11. If we measure q0 and observe a 0, the state collapses entirely to |00⟩, meaning q1 must also be 0. This perfect correlation is stronger than any classical correlation.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Creating Entanglement',
                description: 'We start with both qubits in |0⟩. Apply H to q0, then apply CX. Observe the resulting state vector to see that only the |00⟩ and |11⟩ states have non-zero probabilities.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\n',
                availableGates: ['H', 'CX'],
                visualizations: ['stateVector']
              },
              {
                type: 'quickCheck',
                question: 'If you create the Bell state (|00⟩ + |11⟩) / √2, measure q0, and obtain the classical result 1, what will a subsequent measurement of q1 yield?',
                options: [
                  'Always 0',
                  'Always 1',
                  '50% 0 and 50% 1',
                  'The result is undefined'
                ],
                correctAnswerIndex: 1,
                explanation: 'Because the state only contains the combinations |00⟩ and |11⟩, measuring q0 as 1 collapses the entire system to |11⟩. Therefore, q1 is guaranteed to be 1.'
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
            title: 'Transforming States',
            description: 'Understanding quantum gates as mathematical operations on states.',
            objective: 'Observe how different quantum gates manipulate the state vector and Bloch sphere as inputs and outputs.',
            blocks: [
              {
                type: 'theory',
                content: 'Quantum gates are operations that change a qubit\'s state. Conceptually, a gate receives an input state, applies a mathematical transformation, and produces an output state.'
              },
              {
                type: 'conceptComparison',
                items: [
                  { title: 'X Gate (NOT)', description: 'Flips the basis states: X|0⟩ = |1⟩ and X|1⟩ = |0⟩. Geometrically, it is a 180-degree rotation around the X axis of the Bloch sphere.' },
                  { title: 'Z Gate (Phase)', description: 'Leaves |0⟩ unchanged but flips the sign of |1⟩: Z|1⟩ = −|1⟩. Geometrically, it is a rotation around the Z axis.' }
                ]
              },
              {
                type: 'theory',
                content: 'Unlike classical gates (like AND or OR), all quantum gates (except measurement) must be reversible. You can always apply the reverse operation to return to your original state.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Gate Explorer',
                description: 'Apply X, H, and Z gates in different combinations. Observe how the input state is transformed into the output state on the Bloch sphere.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n',
                availableGates: ['X', 'H', 'Z']
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
                content: 'The Bloch sphere provides a powerful geometric intuition for single-qubit states. Any valid single-qubit state can be represented as a point on the surface of this sphere.'
              },
              {
                type: 'theory',
                content: 'The North pole represents |0⟩ and the South pole represents |1⟩. The equator represents states where the probabilities of measuring 0 or 1 are exactly equal (like |+⟩ and |−⟩), differing only by their relative phase.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Bloch Rotations',
                description: 'Apply an H gate to move the state vector from the North pole (|0⟩) to the equator (|+⟩). Then apply a Z gate to flip the phase, moving the vector to the opposite side of the equator (|−⟩).',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\n'
              },
              {
                type: 'whyItMatters',
                content: 'While the Bloch sphere is incredibly useful for visualizing single qubits, it is mathematically incapable of representing entangled states. When working with multi-qubit algorithms, we must rely on state vectors and probability distributions instead.'
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
    description: 'Master the concepts, notation, and rules you need to understand and build quantum circuits.',
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
            objective: 'Understand how qubits and quantum wires are represented inside a circuit.',
            blocks: [
              {
                type: 'theory',
                content: 'A **quantum circuit** represents a sequence of quantum operations applied to quantum data over time. Think of it like a musical score that tells the quantum computer exactly what to do.'
              },
              {
                type: 'theory',
                content: 'In standard circuit notation, each qubit is represented by a single horizontal solid line called a **quantum wire**. The diagram is read from left to right, representing the passage of time.'
              },
              {
                type: 'theory',
                content: 'By convention, unless explicitly stated otherwise, every quantum wire starts at the far left perfectly initialized in the computational basis state |0⟩.'
              },
              {
                type: 'theory',
                content: 'If a circuit uses multiple qubits, it will have multiple horizontal wires stacked vertically. For example, a three-qubit circuit has three parallel horizontal wires. Each wire independently tracks the state of its respective qubit over time.'
              },
              {
                type: 'quickCheck',
                question: 'If you see three horizontal solid lines in a quantum circuit diagram extending from left to right, what do they represent?',
                options: [
                  'Three separate time dimensions.',
                  'Three quantum gates.',
                  'Three qubits evolving over time.',
                  'A single qubit that has been copied three times.'
                ],
                correctAnswerIndex: 2,
                explanation: 'Each horizontal wire represents an individual qubit, and the left-to-right axis represents time. Three wires mean three qubits.'
              },
              {
                type: 'keyTakeaways',
                points: [
                  'Circuits are read from left to right over time.',
                  'A single solid horizontal line represents one qubit.',
                  'Qubits begin initialized in the |0⟩ state.',
                  'Now you know what the lines represent.'
                ]
              }
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
            title: 'Gates in Circuits',
            description: 'Placing gates on wires.',
            objective: 'Learn how to read, place, and follow quantum gates in a circuit diagram.',
            blocks: [
              {
                type: 'theory',
                content: 'If wires are the physical qubits, **gates** are the instructions. Single-qubit gates are typically drawn as solid square blocks placed directly on a quantum wire.'
              },
              {
                type: 'theory',
                content: 'When a wire passes through a gate block, it means the gate\'s mathematical transformation is applied to that qubit at that moment in time. For example, an X block placed on a wire initialized in |0⟩ represents the physical transformation: |0⟩ → X → |1⟩.'
              },
              {
                type: 'theory',
                content: 'Multi-qubit gates connect multiple wires. The most common is the **Controlled-NOT (CX)** gate. It uses special notation: a solid dot on the "control" wire, connected by a vertical line to a circle-with-a-cross (⊕) on the "target" wire.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Reading Gate Notation',
                description: 'Observe the circuit diagram below. Place an X gate on q0. Then place an H gate on q1 to create a superposition: |0⟩ → H → |+⟩. Notice how the square blocks sit on the wires.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\n',
                availableGates: ['X', 'H', 'Z', 'CX']
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: Controlled-X (CNOT)',
                targetCircuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncx q[0],q[1];\n',
                buttonText: 'Build CX Gate'
              },
              {
                type: 'quickCheck',
                question: 'In a circuit diagram, you see a vertical line connecting a solid dot on wire q0 to a ⊕ symbol on wire q1. What does this mean?',
                options: [
                  'q0 is swapped with q1.',
                  'q0 acts as the control qubit and q1 is the target qubit.',
                  'q1 acts as the control qubit and q0 is the target qubit.',
                  'Both qubits are measured simultaneously.'
                ],
                correctAnswerIndex: 1,
                explanation: 'The solid dot indicates the control qubit (q0), and the ⊕ symbol indicates the target qubit (q1) that receives the NOT operation.'
              },
              {
                type: 'keyTakeaways',
                points: [
                  'Single-qubit gates appear as blocks on a wire.',
                  'Controlled gates use a dot for the control and a ⊕ for the target.',
                  'Now you know what the symbols on those lines mean.'
                ]
              }
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
            title: 'Measurements & Classical Bits',
            description: 'Converting qubits to classical bits.',
            objective: 'Distinguish a quantum state from the classical result produced by measurement.',
            blocks: [
              {
                type: 'theory',
                content: 'A quantum circuit is only useful if we can read the result. **Measurement** is typically drawn as a block containing a meter symbol. It is usually placed at the very end of the circuit.'
              },
              {
                type: 'theory',
                content: 'It is critical to distinguish between the **quantum state** and the **classical measurement result**. A measurement operation takes a single solid quantum wire as input, forces the quantum state to collapse, and outputs a double horizontal line representing a **classical wire**. The classical wire carries a definitive classical bit (0 or 1) to a classical register.'
              },
              {
                type: 'theory',
                content: 'For example, if you place an H gate followed by a measurement on a qubit initialized at |0⟩, it does *not* mean the qubit "becomes 50% zero and 50% one". It means the quantum state was in a linear combination (|0⟩ + |1⟩) / √2 before measurement, and the single measurement forces it to produce exactly one classical bit—either a 0 or a 1.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Classical Outcomes',
                description: 'Place an H gate on q0, followed immediately by a measurement. Run multiple shots and compare the observed classical counts with the theoretical probability distribution.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[1];\ncreg c[1];\nh q[0];\nmeasure q[0] -> c[0];\n',
                availableGates: ['H'],
                visualizations: ['measurement']
              },
              {
                type: 'quickCheck',
                question: 'Which part of the circuit diagram records a classical measurement result?',
                options: [
                  'The single solid horizontal wire.',
                  'The double horizontal wire.',
                  'The square H gate block.',
                  'The solid dot on the control wire.'
                ],
                correctAnswerIndex: 1,
                explanation: 'A double horizontal line explicitly represents classical information (classical bits), distinguishing it from the single solid line of a quantum wire.'
              },
              {
                type: 'keyTakeaways',
                points: [
                  'Measurement blocks usually appear at the right edge of a circuit.',
                  'A double line represents a classical wire carrying a definite 0 or 1.',
                  'Now you know how the quantum computation produces a classical result.'
                ]
              }
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
            title: 'Reading Complex Circuits',
            description: 'Sequential and parallel execution.',
            objective: 'Understand how sequential, parallel, and controlled operations combine into larger circuits.',
            blocks: [
              {
                type: 'theory',
                content: 'To read a complete circuit, we must understand how gates combine.'
              },
              {
                type: 'theory',
                content: 'When gates are placed one after another on the same wire, they execute **sequentially**. Intuitively, the gate on the left happens first in time, followed by the gate on its right. Mathematically, this corresponds to **matrix multiplication** (note that in linear algebra, matrix operations are written right-to-left, reversing the visual circuit order).'
              },
              {
                type: 'theory',
                content: 'When gates are placed on different wires at the same horizontal position, they execute in **parallel**. Because they operate independently on separate qubits simultaneously, their order does not matter. Mathematically, this corresponds to a **tensor product**, which combines their individual matrices into one larger system matrix.'
              },
              {
                type: 'interactiveCircuit',
                title: 'Complete Circuit Execution',
                description: 'Build a two-qubit circuit with an H gate on q0 followed sequentially by a controlled-X (CX) from q0 to q1. You are reading a complete circuit: initialization, parallel idle wires, a single-qubit gate, a multi-qubit gate, and finally measurement. Observe how the final measurement results are correlated.',
                qasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\n',
                availableGates: ['H', 'CX'],
                visualizations: ['measurement']
              },
              {
                type: 'circuitPractice',
                title: 'BUILD THIS: Sequential and Controlled Operations',
                targetCircuit: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0],q[1];\n',
                buttonText: 'Build Full Circuit'
              },
              {
                type: 'quickCheck',
                question: 'Why does changing the order of two sequential gates on the same wire matter?',
                options: [
                  'Because time flows from left to right; the first gate changes the input state that the second gate receives.',
                  'Because gates must alternate between single and multi-qubit operations.',
                  'It actually does not matter; sequential gates can be swapped freely.',
                  'Because the tensor product is not commutative.'
                ],
                correctAnswerIndex: 0,
                explanation: 'A circuit represents a sequence of operations in time. The first gate transforms the state, and the second gate operates on that newly transformed state, not the original one. Mathematically, matrix multiplication is not commutative.'
              },
              {
                type: 'keyTakeaways',
                points: [
                  'Sequential gates apply one after another on a wire (matrix multiplication).',
                  'Parallel gates act on different wires simultaneously (tensor products).',
                  'Now you can read a complete circuit and are ready to build one.'
                ]
              }
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
    theory: '### The Problem\nImagine a black-box function (an oracle) that takes a binary input and produces a binary output (0 or 1). We are promised the function is either **constant** (returns the same output for all inputs) or **balanced** (returns 0 for half the inputs, and 1 for the other half). Our goal is to determine which type of function it is.\n\n### Classical vs Quantum\nClassically, in the worst case, we would need to check more than half of all possible inputs to be completely certain. If there are 2ⁿ possible inputs, this takes 2ⁿ⁻¹ + 1 queries. The Deutsch-Jozsa quantum algorithm determines the answer with exactly **one** query, demonstrating a theoretical exponential speedup.\n\n### The Circuit\nThe algorithm works by initializing all query qubits in the |+⟩ state, and an auxiliary target qubit in the |−⟩ state. When the oracle is applied, it writes its output into the phase of the target qubit, a technique known as **phase kickback**. The query qubits then undergo interference via Hadamard gates.\n\n### The Measurement\nWhen we measure the query qubits, if the function was constant, total constructive interference guarantees we measure all zeros (00...0). If the function was balanced, total destructive interference ensures we measure anything *except* all zeros.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[1];\nx q[1];\nh q[0];\nh q[1];\ncx q[0],q[1];\nh q[0];\nmeasure q[0] -> c[0];\n'
  },
  {
    id: 'a-grover',
    title: 'Grover\'s Algorithm',
    description: 'Provides quadratic speedup for unstructured search problems.',
    difficulty: 'Intermediate',
    theory: '### The Problem\nImagine searching for a specific item in an unsorted database of N items. Because there is no structure to exploit, a classical computer must check items one by one.\n\n### Classical vs Quantum\nClassically, this search requires on average N/2 queries, scaling linearly as O(N). Grover\'s quantum algorithm finds the target item in roughly √N queries, providing a quadratic speedup. While not exponential, a quadratic speedup is massive for astronomically large datasets.\n\n### The Circuit\nGrover\'s algorithm repeatedly applies two operations: an **Oracle** that flips the phase of the target state, and a **Diffusion Operator** that inverts all amplitudes about their mean. This process, known as **amplitude amplification**, systematically shrinks the probability of incorrect answers while growing the probability of the correct answer.\n\n### The Measurement\nAfter the optimal number of iterations, measuring the qubits will yield the binary index of the target item with near certainty.',
    prerequisites: ['c-fundamentals', 'c-circuit-theory'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\nh q[1];\ncz q[0],q[1];\nh q[0];\nh q[1];\nz q[0];\nz q[1];\ncz q[0],q[1];\nh q[0];\nh q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-teleportation',
    title: 'Quantum Teleportation',
    description: 'Transfers quantum information between qubits using entanglement and classical communication.',
    difficulty: 'Intermediate',
    theory: '### The Problem\nThe No-Cloning Theorem states that it is impossible to create an identical copy of an arbitrary unknown quantum state. If Alice wants to send a quantum state to Bob, she cannot simply copy it. \n\n### The Quantum Solution\nQuantum Teleportation allows Alice to destroy the quantum state in her possession and exactly recreate it in Bob\'s possession, bypassing the No-Cloning Theorem. This process requires them to share an entangled Bell pair beforehand, and requires Alice to send two classical bits of information to Bob.\n\n### The Circuit\nAlice entangles the qubit she wishes to teleport with her half of the Bell pair, and then measures both of her qubits. Because of the entanglement, Bob\'s qubit instantly collapses into a state highly correlated with the original message. \n\n### The Measurement\nAlice\'s measurement yields two classical bits (00, 01, 10, or 11). She sends these classical bits to Bob. Bob uses them to determine which Pauli gates (X and/or Z) he must apply to correct his qubit, perfectly reconstructing the teleported state.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[2];\nh q[1];\ncx q[1],q[2];\ncx q[0],q[1];\nh q[0];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-bernstein-vazirani',
    title: 'Bernstein-Vazirani',
    description: 'Finds a hidden binary string in one query.',
    difficulty: 'Beginner',
    theory: '### The Problem\nImagine a black-box function that computes the bitwise dot product of an input string with a hidden secret string s. The goal is to determine the secret string s.\n\n### Classical vs Quantum\nClassically, if the string has n bits, it takes exactly n queries to discover the string by testing inputs with a single 1 bit. The Bernstein-Vazirani algorithm discovers the hidden string in exactly **one** quantum query, representing a polynomial speedup.\n\n### The Circuit\nThe circuit is structurally identical to the Deutsch-Jozsa algorithm. Query qubits are initialized in |+⟩ and a target qubit in |−⟩. The oracle kicks back the phase determined by the secret string onto the query qubits.\n\n### The Measurement\nBecause of the specific way phase kickback acts on the |+⟩ states, applying final Hadamard gates perfectly uncomputes the superposition, leaving the qubits deterministically in the exact binary state of the secret string s.',
    prerequisites: ['c-fundamentals'],
    canonicalCircuitQasm: 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[2];\nx q[2];\nh q[0];\nh q[1];\nh q[2];\ncx q[0],q[2];\ncx q[1],q[2];\nh q[0];\nh q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];\n'
  },
  {
    id: 'a-simon',
    title: 'Simon\'s Algorithm',
    description: 'Finds a hidden period in a function with exponential speedup.',
    difficulty: 'Advanced',
    theory: '### The Problem\nWe are given a function that maps binary strings to binary strings. We are promised that the function is 2-to-1: it produces the exact same output for two different inputs if and only if those inputs differ by a secret hidden string s (using bitwise XOR). Our goal is to find s.\n\n### Classical vs Quantum\nClassically, this problem requires evaluating the function O(2^(n/2)) times before we probabilistically find two inputs that produce the same output. Simon\'s algorithm finds the hidden string s in O(n) queries, offering a true exponential speedup for a specific oracle problem.\n\n### Significance\nSimon\'s algorithm provided the conceptual breakthrough that inspired Peter Shor to discover Shor\'s algorithm for integer factorization, demonstrating that quantum computers can efficiently solve period-finding problems.\n\n*Note: This algorithm is theory-only and does not currently have a canonical executable circuit available in the simulator.*',
    prerequisites: ['a-deutsch-jozsa']
  },
  {
    id: 'a-qft',
    title: 'Quantum Fourier Transform',
    description: 'The quantum analogue of the discrete Fourier transform.',
    difficulty: 'Advanced',
    theory: '### The Problem\nThe Discrete Fourier Transform maps data in the time or spatial domain into the frequency domain. It is a cornerstone of classical signal processing.\n\n### Classical vs Quantum\nThe Quantum Fourier Transform (QFT) is the quantum analogue of the discrete Fourier transform. While the classical Fast Fourier Transform operates on N amplitudes in O(N log N) time, the QFT operates on a quantum state with N = 2ⁿ amplitudes in O(n²) time. This represents an exponential speedup in manipulating the amplitudes.\n\n### Limitations\nImportantly, the QFT does *not* allow us to compute the classical Fourier transform of classical data faster. We cannot efficiently read out the transformed amplitudes due to measurement collapse. However, it is extremely powerful when used as a subroutine inside larger quantum algorithms (such as Shor\'s algorithm and Quantum Phase Estimation) to extract periodicities encoded in phases.\n\n*Note: This algorithm is theory-only and does not currently have a canonical executable circuit available in the simulator.*',
    prerequisites: ['a-grover']
  }
]
