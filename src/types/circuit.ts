export type GateType = 
  | 'I' | 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' 
  | 'Rx' | 'Ry' | 'Rz' 
  | 'CX' | 'CZ' | 'SWAP' 
  | 'Measure'

export interface GateDef {
  type: GateType
  name: string
  description: string
  numTargets: number
  numControls: number
  hasParam: boolean
}

export const GATE_DEFINITIONS: Record<GateType, GateDef> = {
  I: { type: 'I', name: 'Identity', description: 'Does nothing.', numTargets: 1, numControls: 0, hasParam: false },
  X: { type: 'X', name: 'Pauli-X', description: 'Bit-flip (NOT gate).', numTargets: 1, numControls: 0, hasParam: false },
  Y: { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip.', numTargets: 1, numControls: 0, hasParam: false },
  Z: { type: 'Z', name: 'Pauli-Z', description: 'Phase flip.', numTargets: 1, numControls: 0, hasParam: false },
  H: { type: 'H', name: 'Hadamard', description: 'Creates superposition.', numTargets: 1, numControls: 0, hasParam: false },
  S: { type: 'S', name: 'Phase (S)', description: '90 degree Z-rotation.', numTargets: 1, numControls: 0, hasParam: false },
  T: { type: 'T', name: 'T Gate', description: '45 degree Z-rotation.', numTargets: 1, numControls: 0, hasParam: false },
  Rx: { type: 'Rx', name: 'Rx', description: 'Rotation around X-axis.', numTargets: 1, numControls: 0, hasParam: true },
  Ry: { type: 'Ry', name: 'Ry', description: 'Rotation around Y-axis.', numTargets: 1, numControls: 0, hasParam: true },
  Rz: { type: 'Rz', name: 'Rz', description: 'Rotation around Z-axis.', numTargets: 1, numControls: 0, hasParam: true },
  CX: { type: 'CX', name: 'CNOT', description: 'Controlled-NOT.', numTargets: 1, numControls: 1, hasParam: false },
  CZ: { type: 'CZ', name: 'CZ', description: 'Controlled-Z.', numTargets: 1, numControls: 1, hasParam: false },
  SWAP: { type: 'SWAP', name: 'SWAP', description: 'Swaps two qubits.', numTargets: 2, numControls: 0, hasParam: false },
  Measure: { type: 'Measure', name: 'Measurement', description: 'Measures qubit.', numTargets: 1, numControls: 0, hasParam: false }
}

export interface GateInstance {
  id: string
  type: GateType
  targets: number[] // qubit indices (e.g., [0] or [0, 1] for SWAP)
  controls: number[] // qubit indices (e.g., [0] for CX)
  param?: string // e.g., 'pi/2'
  timeStep: number // 0-indexed column in the circuit
}

export interface CircuitState {
  numQubits: number
  operations: GateInstance[]
}

// Helper to calculate circuit depth (max timeStep + 1)
export function getCircuitDepth(state: CircuitState): number {
  if (state.operations.length === 0) return 0
  return Math.max(...state.operations.map(op => op.timeStep)) + 1
}

// Helper to check if a specific grid cell is occupied
export function isCellOccupied(state: CircuitState, qubit: number, timeStep: number): boolean {
  return state.operations.some(op => 
    op.timeStep === timeStep && 
    (op.targets.includes(qubit) || op.controls.includes(qubit))
  )
}
