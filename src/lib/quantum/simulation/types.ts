import type { CircuitState } from '@/types/circuit'

export type BackendType = 'local' | 'qiskit' | 'pennylane' | 'cirq'

export interface BackendAvailability {
  id: BackendType
  name: string
  available: boolean
  description: string
  comingSoon?: boolean
}

export interface SimulationResult {
  backend: BackendType
  shots: number
  measurements: Record<string, number> // e.g. "00": 502, "01": 498
  probabilities: Record<string, number> // e.g. "00": 0.502, "01": 0.498
  stateVector?: { real: number, imag: number }[]
  timeTakenMs: number
  status: 'SUCCESS' | 'ERROR'
  errorMessage?: string
  timestamp: string
}

export interface SimulationBackend {
  id: BackendType
  run(circuit: CircuitState, shots: number): Promise<SimulationResult>
}
