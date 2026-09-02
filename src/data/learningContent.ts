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
            content: `
A **qubit** (quantum bit) is the basic unit of quantum information. 
Unlike a classical bit, which must be strictly $0$ or $1$, a qubit can exist in a linear combination (superposition) of both states simultaneously.

Mathematically, a qubit's state is represented by a vector in a two-dimensional complex vector space. The two basis states are conventionally written as $|0\\rangle$ and $|1\\rangle$ (Dirac notation).
            `
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
            title: 'Dirac Notation',
            description: 'Learn the standard notation for quantum states.',
            content: 'Dirac notation, or bra-ket notation, is the standard language of quantum mechanics...'
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
            content: 'When a qubit is measured in the computational basis, its superposition collapses to either $|0\\rangle$ or $|1\\rangle$.'
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
            title: 'Superposition Basics',
            description: 'Understanding linear combinations.',
            content: 'A qubit state is $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ where $|\\alpha|^2 + |\\beta|^2 = 1$.'
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
            content: 'Bell states are specific quantum states of two qubits that represent the simplest examples of quantum entanglement.'
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
            content: 'Quantum gates are represented by unitary matrices. The Hadamard gate creates superposition.'
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
            content: 'The Bloch sphere provides a way to visualize the state of a single qubit.'
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
            content: 'In a quantum circuit, horizontal lines represent qubits over time, moving left to right.'
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
            content: 'Gates act as operators changing the state of the qubits they are applied to.'
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
            content: 'Measurement is represented by a meter symbol and maps a qubit state to a classical wire.'
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
            content: 'Sequential gates multiply their matrices; parallel gates tensor product their matrices.'
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
    prerequisites: ['c-fundamentals']
  },
  {
    id: 'a-grover',
    title: 'Grover\'s Algorithm',
    description: 'Provides quadratic speedup for unstructured search problems.',
    difficulty: 'Intermediate',
    theory: 'Grover\'s algorithm uses amplitude amplification to increase the probability of measuring the correct answer in an unstructured database.',
    prerequisites: ['c-fundamentals', 'c-circuit-theory']
  },
  {
    id: 'a-teleportation',
    title: 'Quantum Teleportation',
    description: 'Transfers quantum information between qubits using entanglement and classical communication.',
    difficulty: 'Intermediate',
    theory: 'Teleportation destroys the original quantum state and recreates it elsewhere, bypassing the no-cloning theorem using Bell states.',
    prerequisites: ['c-fundamentals']
  },
  {
    id: 'a-bernstein-vazirani',
    title: 'Bernstein-Vazirani',
    description: 'Finds a hidden binary string in one query.',
    difficulty: 'Beginner',
    theory: 'An extension of Deutsch-Jozsa that extracts a hidden string using quantum parallelism and interference.',
    prerequisites: ['c-fundamentals']
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
