import type { SimulationBackend, SimulationResult } from './types'
import type { CircuitState } from '@/types/circuit'

// A lightweight, exact state-vector simulator in TypeScript
// Handles <= 10 qubits reasonably well in the browser.

export class LocalSimulator implements SimulationBackend {
  id = 'local' as const

  async run(circuit: CircuitState, shots: number): Promise<SimulationResult> {
    const startTime = performance.now()
    
    try {
      // Basic validation
      if (circuit.operations.length === 0) {
        throw new Error('Circuit has no gates to simulate.')
      }
      
      const numQubits = circuit.numQubits
      const dim = 1 << numQubits
      
      // Initialize state vector to |0...0>
      let stateReal = new Float64Array(dim)
      let stateImag = new Float64Array(dim)
      stateReal[0] = 1.0

      // Sort operations by timeStep to ensure correct execution order
      const ops = [...circuit.operations].sort((a, b) => a.timeStep - b.timeStep)

      for (const op of ops) {
        if (op.type === 'Measure') continue // Measurements are handled at the end by sampling
        
        const target = op.targets[0]
        const control = op.controls.length > 0 ? op.controls[0] : -1

        const newReal = new Float64Array(dim)
        const newImag = new Float64Array(dim)

        for (let i = 0; i < dim; i++) {
          // If controlled and control bit is 0, nothing changes
          if (control !== -1) {
            const controlBit = (i >> control) & 1
            if (controlBit === 0) {
              newReal[i] = stateReal[i]
              newImag[i] = stateImag[i]
              continue
            }
          }

          const targetBit = (i >> target) & 1
          const partnerIndex = i ^ (1 << target) // flip the target bit to find the partner state

          const v0Real = targetBit === 0 ? stateReal[i] : stateReal[partnerIndex]
          const v0Imag = targetBit === 0 ? stateImag[i] : stateImag[partnerIndex]
          const v1Real = targetBit === 1 ? stateReal[i] : stateReal[partnerIndex]
          const v1Imag = targetBit === 1 ? stateImag[i] : stateImag[partnerIndex]

          let resReal = 0
          let resImag = 0

          if (op.type === 'H') {
            const invSqrt2 = 1 / Math.sqrt(2)
            if (targetBit === 0) {
              resReal = (v0Real + v1Real) * invSqrt2
              resImag = (v0Imag + v1Imag) * invSqrt2
            } else {
              resReal = (v0Real - v1Real) * invSqrt2
              resImag = (v0Imag - v1Imag) * invSqrt2
            }
          } else if (op.type === 'X' || op.type === 'CX') {
            resReal = targetBit === 0 ? v1Real : v0Real
            resImag = targetBit === 0 ? v1Imag : v0Imag
          } else if (op.type === 'Y') {
             // Y matrix: [0, -i], [i, 0]
             if (targetBit === 0) {
               resReal = v1Imag
               resImag = -v1Real
             } else {
               resReal = -v0Imag
               resImag = v0Real
             }
          } else if (op.type === 'Z' || op.type === 'CZ') {
            resReal = targetBit === 0 ? v0Real : -v1Real
            resImag = targetBit === 0 ? v0Imag : -v1Imag
          } else if (op.type === 'S') {
             resReal = targetBit === 0 ? v0Real : -v1Imag
             resImag = targetBit === 0 ? v0Imag : v1Real
          } else if (op.type === 'T') {
             if (targetBit === 0) {
               resReal = v0Real
               resImag = v0Imag
             } else {
               const invSqrt2 = 1 / Math.sqrt(2)
               resReal = (v1Real - v1Imag) * invSqrt2
               resImag = (v1Real + v1Imag) * invSqrt2
             }
          } else {
             // Pass through unsupported for now (like SWAP, Rx, Ry, Rz for MVP simulator)
             if (op.type === 'SWAP') {
                throw new Error('SWAP is not yet natively supported in the lightweight simulator.')
             }
             resReal = targetBit === 0 ? v0Real : v1Real
             resImag = targetBit === 0 ? v0Imag : v1Imag
          }

          newReal[i] = resReal
          newImag[i] = resImag
        }
        
        stateReal = newReal
        stateImag = newImag
      }

      // Calculate probabilities
      const exactProbabilities = new Float64Array(dim)
      let totalProb = 0
      for (let i = 0; i < dim; i++) {
        exactProbabilities[i] = stateReal[i] * stateReal[i] + stateImag[i] * stateImag[i]
        totalProb += exactProbabilities[i]
      }

      // Normalize in case of floating point drift
      if (totalProb > 0) {
        for (let i = 0; i < dim; i++) exactProbabilities[i] /= totalProb
      }

      // Perform sampling (shots)
      const measurements: Record<string, number> = {}
      const probabilities: Record<string, number> = {}
      
      if (shots > 0) {
        for (let s = 0; s < shots; s++) {
          const r = Math.random()
          let cumulative = 0
          let chosenState = 0
          for (let i = 0; i < dim; i++) {
            cumulative += exactProbabilities[i]
            if (r <= cumulative) {
              chosenState = i
              break
            }
          }
          
          // Format as binary string, e.g., '01'
          const binStr = chosenState.toString(2).padStart(numQubits, '0')
          // toString(2) naturally puts the least significant bit (q0) on the right.
          // This is standard notation (e.g. |q2 q1 q0>), so we just use binStr directly.
          
          measurements[binStr] = (measurements[binStr] || 0) + 1
        }
        
        // Calculate resulting probabilities from shots
        for (const [key, count] of Object.entries(measurements)) {
          probabilities[key] = count / shots
        }
      } else {
         // Exact math mode (0 shots)
         for (let i = 0; i < dim; i++) {
           if (exactProbabilities[i] > 0.0001) {
              const binStr = i.toString(2).padStart(numQubits, '0')
              probabilities[binStr] = exactProbabilities[i]
           }
         }
      }

      // Format state vector for output
      const stateVector = []
      for (let i = 0; i < dim; i++) {
        stateVector.push({ real: stateReal[i], imag: stateImag[i] })
      }

      // Small deliberate delay to feel like a real simulation run
      await new Promise(resolve => setTimeout(resolve, 600))

      return {
        backend: this.id,
        shots,
        measurements,
        probabilities,
        stateVector,
        timeTakenMs: performance.now() - startTime,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      }

    } catch (e: any) {
      return {
        backend: this.id,
        shots,
        measurements: {},
        probabilities: {},
        timeTakenMs: performance.now() - startTime,
        status: 'ERROR',
        errorMessage: e.message || 'Unknown simulation error',
        timestamp: new Date().toISOString()
      }
    }
  }
}
