/**
 * Boundary interface for quantum simulation engines.
 * Future adapters (e.g., Qiskit, PennyLane) will implement this interface.
 * UI components should only interact with this interface, not the concrete implementations.
 */

export interface QuantumCircuit {
  id: string
  name: string
  gates: any[] // Will type strictly in Phase 2
  numQubits: number
}

export interface SimulationResult {
  stateVector: number[][] // Complex numbers
  probabilities: Record<string, number>
  executionTimeMs: number
}

export interface QuantumAdapter {
  getName: () => string
  supportsBackend: (backend: 'local' | 'cloud') => boolean
  executeCircuit: (circuit: QuantumCircuit) => Promise<SimulationResult>
}

// Example stub for Phase 0
export class MockQuantumAdapter implements QuantumAdapter {
  getName() { return 'MockLocalSimulator' }
  supportsBackend() { return true }
  async executeCircuit(): Promise<SimulationResult> {
    return {
      stateVector: [],
      probabilities: {},
      executionTimeMs: 0
    }
  }
}
