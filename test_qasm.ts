import { validateCircuitForQASM, generateQASM } from './src/lib/quantum/qasm'
import { GateType, CircuitState } from './src/types/circuit'

const gates: GateType[] = ['I', 'X', 'Y', 'Z', 'H', 'S', 'T', 'Rx', 'Ry', 'Rz', 'CX', 'CZ', 'SWAP', 'Measure']

const state: CircuitState = {
  numQubits: 2,
  operations: gates.map((g, i) => ({
    id: `op-${i}`,
    type: g,
    targets: g === 'SWAP' || g === 'CX' || g === 'CZ' ? [1] : [0],
    controls: g === 'CX' || g === 'CZ' ? [0] : (g === 'SWAP' ? [0] : []),
    timeStep: i,
    param: g.startsWith('R') ? 'pi/2' : undefined
  }))
}

// Fix SWAP targets
const swapOp = state.operations.find(o => o.type === 'SWAP')!
swapOp.targets = [0, 1]
swapOp.controls = []

const validation = validateCircuitForQASM(state)
console.log('Validation:', validation)

if (validation.valid) {
  const qasm = generateQASM(state)
  console.log('Generated QASM:\n' + qasm)
}

// Test Invalid Gate
const invalidState = {
  numQubits: 1,
  operations: [{
    id: 'op-invalid',
    type: 'FAKE' as GateType,
    targets: [0],
    controls: [],
    timeStep: 0
  }]
}
console.log('Invalid Validation:', validateCircuitForQASM(invalidState))
