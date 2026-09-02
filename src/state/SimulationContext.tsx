import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { BackendType, SimulationResult } from '@/lib/quantum/simulation/types'
import { LocalSimulator } from '@/lib/quantum/simulation/LocalSimulator'
import { QiskitAdapter } from '@/lib/quantum/simulation/QiskitAdapter'
import { useCircuit } from './CircuitContext'
import { toast } from 'sonner'

interface SimulationContextType {
  activeBackend: BackendType
  setActiveBackend: (backend: BackendType) => void
  shots: number
  setShots: (shots: number) => void
  isRunning: boolean
  runSimulation: () => Promise<void>
  history: SimulationResult[]
  latestResult: SimulationResult | null
  isStale: boolean
  clearHistory: () => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const { circuitState } = useCircuit()
  const [activeBackend, setActiveBackend] = useState<BackendType>('qiskit')
  const [shots, setShots] = useState(1024)
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<SimulationResult[]>([])
  const [lastSimulatedHash, setLastSimulatedHash] = useState<string | null>(null)

  const currentCircuitHash = JSON.stringify(circuitState.operations)

  const runSimulation = useCallback(async () => {
    if (circuitState.operations.length === 0) {
      toast.error('Cannot simulate an empty circuit.')
      return
    }

    setIsRunning(true)

    try {
      let engine
      if (activeBackend === 'local') engine = new LocalSimulator()
      else if (activeBackend === 'qiskit') engine = new QiskitAdapter()
      else throw new Error('Unsupported backend')

      const result = await engine.run(circuitState, shots)
      
      setHistory(prev => [result, ...prev].slice(0, 10)) // Keep last 10
      setLastSimulatedHash(currentCircuitHash)
      
      if (result.status === 'ERROR') {
        toast.error(`Simulation failed: ${result.errorMessage}`)
      } else {
        toast.success(`Simulation completed in ${Math.round(result.timeTakenMs)}ms`)
      }
    } catch (e: any) {
      toast.error(e.message || 'Simulation encountered an unexpected error')
    } finally {
      setIsRunning(false)
    }
  }, [circuitState, activeBackend, shots, currentCircuitHash])

  const clearHistory = useCallback(() => {
    setHistory([])
    setLastSimulatedHash(null)
  }, [])

  const latestResult = history[0] || null
  const isStale = latestResult !== null && lastSimulatedHash !== currentCircuitHash

  return (
    <SimulationContext.Provider value={{
      activeBackend, setActiveBackend,
      shots, setShots,
      isRunning, runSimulation,
      history,
      latestResult,
      isStale,
      clearHistory
    }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
