import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CircuitState } from '@/types/circuit'
import { useUser } from './UserContext'

export interface SharedCircuit {
  id: string
  title: string
  circuitState: CircuitState
  ownerId: string
  ownerName: string
  sharedWith: 'Instructor' | 'Collaborator' | 'Class'
  createdAt: string
  challengeContext?: {
    assessmentId: string
    challengeId: string
  }
}

interface SharedCircuitsContextType {
  sharedCircuits: SharedCircuit[]
  shareCircuit: (title: string, circuit: CircuitState, sharedWith: 'Instructor' | 'Collaborator' | 'Class', challengeContext?: { assessmentId: string; challengeId: string }) => void
  deleteSharedCircuit: (id: string) => void
}

const SharedCircuitsContext = createContext<SharedCircuitsContextType | undefined>(undefined)

const STORAGE_KEY = 'quantumforge_shared_circuits_v1'

export function SharedCircuitsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [sharedCircuits, setSharedCircuits] = useState<SharedCircuit[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      return []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedCircuits))
  }, [sharedCircuits])

  const shareCircuit = (
    title: string, 
    circuit: CircuitState, 
    sharedWith: 'Instructor' | 'Collaborator' | 'Class',
    challengeContext?: { assessmentId: string; challengeId: string }
  ) => {
    if (!user) return
    const newShare: SharedCircuit = {
      id: `share-${Date.now()}`,
      title,
      circuitState: circuit,
      ownerId: user.id,
      ownerName: user.name,
      sharedWith,
      createdAt: new Date().toISOString(),
      challengeContext
    }
    setSharedCircuits(prev => [newShare, ...prev])
  }

  const deleteSharedCircuit = (id: string) => {
    setSharedCircuits(prev => prev.filter(c => c.id !== id))
  }

  return (
    <SharedCircuitsContext.Provider value={{ sharedCircuits, shareCircuit, deleteSharedCircuit }}>
      {children}
    </SharedCircuitsContext.Provider>
  )
}

export function useSharedCircuits() {
  const context = useContext(SharedCircuitsContext)
  if (context === undefined) {
    throw new Error('useSharedCircuits must be used within a SharedCircuitsProvider')
  }
  return context
}
