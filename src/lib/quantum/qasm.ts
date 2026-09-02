import type { CircuitState, GateInstance, GateType } from '../../types/circuit'

export interface ParseResult {
  state?: CircuitState
  error?: string
}

// Map common QASM gate names to our GateType
const GATE_MAP: Record<string, GateType> = {
  i: 'I', id: 'I',
  x: 'X',
  y: 'Y',
  z: 'Z',
  h: 'H',
  s: 'S',
  t: 'T',
  rx: 'Rx',
  ry: 'Ry',
  rz: 'Rz',
  cx: 'CX', cnot: 'CX',
  cz: 'CZ',
  swap: 'SWAP',
  measure: 'Measure'
}

export function parseQASM(code: string): ParseResult {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'))
  
  let numQubits = 2 // default
  const operations: GateInstance[] = []
  
  // To assign timeSteps, we track the next available time step for each qubit
  const nextTimeStep: Record<number, number> = {}

  let opCounter = 0

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (line.endsWith(';')) {
      line = line.slice(0, -1).trim()
    }

    if (line.startsWith('qreg')) {
      // e.g. qreg q[3];
      const match = line.match(/q\[(\d+)\]/)
      if (match) {
        numQubits = parseInt(match[1], 10)
      }
      continue
    }

    if (line.startsWith('OPENQASM') || line.startsWith('include')) continue

    // Match gate operations: gate_name q[target] OR gate_name q[control], q[target] OR gate(param) q[target]
    // Example: h q[0]; or cx q[0], q[1]; or rx(pi/2) q[0];
    const gateMatch = line.match(/^([a-zA-Z]+)(?:\(([^)]+)\))?\s+(.+)$/)
    if (!gateMatch) {
      return { error: `Syntax error on line ${i + 1}: "${line}"` }
    }

    const [, rawGateName, param, qubitsStr] = gateMatch
    const gateName = rawGateName.toLowerCase()
    const gateType = GATE_MAP[gateName]

    if (!gateType) {
      return { error: `Unsupported gate "${rawGateName}" on line ${i + 1}` }
    }

    // Extract qubit indices: "q[0], q[1]" -> [0, 1]
    const qubitIndices = [...qubitsStr.matchAll(/q\[(\d+)\]/g)].map(m => parseInt(m[1], 10))

    if (qubitIndices.length === 0) {
      return { error: `No valid qubits specified on line ${i + 1}` }
    }

    for (const q of qubitIndices) {
      if (q >= numQubits) {
        return { error: `Qubit index out of bounds: q[${q}] on line ${i + 1} (max ${numQubits - 1})` }
      }
    }

    let controls: number[] = []
    let targets: number[] = []

    if (gateType === 'CX' || gateType === 'CZ') {
      if (qubitIndices.length !== 2) return { error: `${gateType} requires exactly 2 qubits on line ${i + 1}` }
      controls = [qubitIndices[0]]
      targets = [qubitIndices[1]]
    } else if (gateType === 'SWAP') {
      if (qubitIndices.length !== 2) return { error: `SWAP requires exactly 2 qubits on line ${i + 1}` }
      targets = [qubitIndices[0], qubitIndices[1]]
    } else {
      if (qubitIndices.length !== 1) return { error: `${gateType} requires exactly 1 qubit on line ${i + 1}` }
      targets = [qubitIndices[0]]
    }

    // Determine time step (must be after all previous operations on involved qubits)
    const involvedQubits = [...controls, ...targets]
    const maxStep = Math.max(0, ...involvedQubits.map(q => nextTimeStep[q] || 0))
    
    const timeStep = maxStep
    
    // Update next available time step
    involvedQubits.forEach(q => {
      nextTimeStep[q] = timeStep + 1
    })

    operations.push({
      id: `op-${opCounter++}-${Date.now()}`,
      type: gateType,
      targets,
      controls,
      param: param || undefined,
      timeStep
    })
  }

  return {
    state: {
      numQubits,
      operations
    }
  }
}

export function generateQASM(state: CircuitState): string {
  const lines: string[] = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${state.numQubits}];`,
    'creg c[4]; // Optional classical register',
    ''
  ]

  // Sort operations by time step
  const sortedOps = [...state.operations].sort((a, b) => a.timeStep - b.timeStep)

  for (const op of sortedOps) {
    let gateStr = ''
    if (op.type === 'Measure') {
      // Assuming measure q[i] -> c[i]
      gateStr = `measure q[${op.targets[0]}] -> c[${op.targets[0]}];`
    } else {
      let name = op.type.toLowerCase()
      if (op.param) {
        name += `(${op.param})`
      }
      
      const args: string[] = []
      for (const ctrl of op.controls) args.push(`q[${ctrl}]`)
      for (const tgt of op.targets) args.push(`q[${tgt}]`)

      gateStr = `${name} ${args.join(', ')};`
    }
    lines.push(gateStr)
  }

  return lines.join('\n')
}
