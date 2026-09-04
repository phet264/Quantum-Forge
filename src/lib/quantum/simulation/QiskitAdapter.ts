import type { SimulationBackend, SimulationResult } from './types'
import type { CircuitState } from '@/types/circuit'
import { generateQASM, validateCircuitForQASM } from '../qasm'

export class QiskitAdapter implements SimulationBackend {
  id = 'qiskit' as const

  async run(circuit: CircuitState, shots: number): Promise<SimulationResult> {
    const startTime = performance.now()
    
    try {
      if (circuit.operations.length === 0) {
        throw new Error('Circuit has no gates to simulate.')
      }

      const validation = validateCircuitForQASM(circuit)
      if (!validation.valid) {
        throw new Error(`QASM Validation Failed: ${validation.error}\nReason: ${validation.errorDetails?.reason}`)
      }

      const qasmCode = generateQASM(circuit)
      
      // Attempt to hit the Python FastAPI backend
      const response = await fetch('/api/simulate/qiskit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qasm: qasmCode, shots })
      })

      if (!response.ok) {
        let errDetail = `HTTP error! status: ${response.status}`
        
        if (response.status === 502 || response.status === 504) {
          errDetail = "Qiskit Aer unavailable. Reason: The Python simulation backend is offline or unreachable."
        } else {
          try {
            const errData = await response.json()
            if (errData.detail) errDetail = errData.detail
          } catch (_) {}
        }
        throw new Error(errDetail)
      }

      const data = await response.json()
      
      return {
        backend: this.id,
        shots,
        measurements: data.measurements || {},
        probabilities: data.probabilities || {},
        stateVector: data.stateVector,
        timeTakenMs: performance.now() - startTime,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      }

    } catch (e: any) {
      let errorMsg = e.message || 'Unknown error'
      if (!e.message || e.message === 'Failed to fetch' || e.message.includes('NetworkError')) {
         errorMsg = 'Backend Unavailable: Ensure the Qiskit Aer simulation server is running.'
      }

      return {
        backend: this.id,
        shots,
        measurements: {},
        probabilities: {},
        timeTakenMs: performance.now() - startTime,
        status: 'ERROR',
        errorMessage: errorMsg,
        timestamp: new Date().toISOString()
      }
    }
  }
}
