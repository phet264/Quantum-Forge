import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { CircuitState, GateInstance } from '../types/circuit'
import { parseQASM, generateQASM } from '../lib/quantum/qasm'

interface CircuitContextType {
  circuitState: CircuitState
  code: string
  parseError: string | null
  selectedGateId: string | null
  highlightedGateIds: string[]
  
  // Actions
  setHighlightedGateIds: (ids: string[]) => void
  setQubitCount: (count: number) => void
  addGate: (gate: Omit<GateInstance, 'id'>) => void
  updateGate: (id: string, updates: Partial<GateInstance>) => void
  removeGate: (id: string) => void
  selectGate: (id: string | null) => void
  updateFromCode: (newCode: string) => void
  clearCircuit: () => void
  loadCircuit: (circuit: CircuitState) => void
  
  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const defaultState: CircuitState = {
  numQubits: 3,
  operations: []
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined)

export function CircuitProvider({ children }: { children: ReactNode }) {
  const [circuitState, setCircuitState] = useState<CircuitState>(defaultState)
  const [code, setCode] = useState<string>('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null)
  const [highlightedGateIds, setHighlightedGateIds] = useState<string[]>([])

  // History state
  const [history, setHistory] = useState<CircuitState[]>([defaultState])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Initialize code on first mount
  useEffect(() => {
    setCode(generateQASM(defaultState))
  }, [])

  const pushHistory = useCallback((newState: CircuitState) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Core update function that handles the Flow A: Visual -> Code
  const updateStateAndSyncCode = useCallback((newState: CircuitState) => {
    setCircuitState(newState)
    pushHistory(newState)
    
    // Generate new code from the visual state
    const newCode = generateQASM(newState)
    setCode(newCode)
    setParseError(null)
  }, [pushHistory])

  // Flow B: Code -> Visual
  const updateFromCode = useCallback((newCode: string) => {
    setCode(newCode)
    
    // Attempt to parse
    const result = parseQASM(newCode)
    if (result.error) {
      setParseError(result.error)
    } else if (result.state) {
      setParseError(null)
      setCircuitState(result.state)
      pushHistory(result.state)
    }
  }, [pushHistory])

  const setQubitCount = useCallback((count: number) => {
    const validCount = Math.max(1, count)
    
    // Remove gates that would be out of bounds
    const validOps = circuitState.operations.filter(op => 
      op.targets.every(t => t < validCount) && 
      op.controls.every(c => c < validCount)
    )

    updateStateAndSyncCode({
      numQubits: validCount,
      operations: validOps
    })
    
    if (selectedGateId && !validOps.find(op => op.id === selectedGateId)) {
      setSelectedGateId(null)
    }
  }, [circuitState, selectedGateId, updateStateAndSyncCode])

  const addGate = useCallback((gate: Omit<GateInstance, 'id'>) => {
    const newGate: GateInstance = {
      ...gate,
      id: `gate-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    updateStateAndSyncCode({
      ...circuitState,
      operations: [...circuitState.operations, newGate]
    })
    setSelectedGateId(newGate.id)
  }, [circuitState, updateStateAndSyncCode])

  const updateGate = useCallback((id: string, updates: Partial<GateInstance>) => {
    const newOps = circuitState.operations.map(op => 
      op.id === id ? { ...op, ...updates } : op
    )
    updateStateAndSyncCode({
      ...circuitState,
      operations: newOps
    })
  }, [circuitState, updateStateAndSyncCode])

  const removeGate = useCallback((id: string) => {
    const newOps = circuitState.operations.filter(op => op.id !== id)
    updateStateAndSyncCode({
      ...circuitState,
      operations: newOps
    })
    if (selectedGateId === id) setSelectedGateId(null)
  }, [circuitState, selectedGateId, updateStateAndSyncCode])

  const clearCircuit = useCallback(() => {
    const emptyState = { numQubits: circuitState.numQubits, operations: [] }
    updateStateAndSyncCode(emptyState)
    setSelectedGateId(null)
  }, [circuitState.numQubits, updateStateAndSyncCode])

  const loadCircuit = useCallback((circuit: CircuitState) => {
    updateStateAndSyncCode(circuit)
    setSelectedGateId(null)
  }, [updateStateAndSyncCode])

  const selectGate = (id: string | null) => setSelectedGateId(id)

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const prevState = history[newIndex]
      setHistoryIndex(newIndex)
      setCircuitState(prevState)
      setCode(generateQASM(prevState))
      setParseError(null)
      setSelectedGateId(null)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]
      setHistoryIndex(newIndex)
      setCircuitState(nextState)
      setCode(generateQASM(nextState))
      setParseError(null)
      setSelectedGateId(null)
    }
  }, [history, historyIndex])

  return (
    <CircuitContext.Provider value={{
      circuitState,
      code,
      parseError,
      selectedGateId,
      highlightedGateIds,
      setHighlightedGateIds,
      setQubitCount,
      addGate,
      updateGate,
      removeGate,
      selectGate,
      updateFromCode,
      clearCircuit,
      loadCircuit,
      undo,
      redo,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1
    }}>
      {children}
    </CircuitContext.Provider>
  )
}

export function useCircuit() {
  const context = useContext(CircuitContext)
  if (context === undefined) {
    throw new Error('useCircuit must be used within a CircuitProvider')
  }
  return context
}
