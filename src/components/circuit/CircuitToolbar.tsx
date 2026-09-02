import { useCircuit } from '@/state/CircuitContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Undo, Redo, Trash2, Play, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

export function CircuitToolbar() {
  const { 
    circuitState, setQubitCount, clearCircuit, 
    undo, redo, canUndo, canRedo 
  } = useCircuit()

  const navigate = useNavigate()

  const handleClear = () => {
    if (circuitState.operations.length === 0) return
    if (window.confirm('Are you sure you want to clear the entire circuit?')) {
      clearCircuit()
      toast.success('Circuit cleared')
    }
  }

  const handleRun = () => {
    if (circuitState.operations.length === 0) {
      toast.error('Cannot simulate an empty circuit. Add some gates first.')
      return
    }
    navigate('/simulator')
  }

  return (
    <div className="flex items-center justify-between p-2 bg-card border-b border-border mb-4 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded">
          <span className="text-xs font-label-caps uppercase text-muted-foreground ml-2">Qubits</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setQubitCount(circuitState.numQubits - 1)}
            disabled={circuitState.numQubits <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-code-sm font-bold min-w-[1ch] text-center">{circuitState.numQubits}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setQubitCount(circuitState.numQubits + 1)}
            disabled={circuitState.numQubits >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border mx-2"></div>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleClear} title="Clear Circuit" disabled={circuitState.operations.length === 0}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-4 text-xs font-code-sm text-muted-foreground mr-4">
          <span>Gates: {circuitState.operations.length}</span>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90" 
          onClick={handleRun}
        >
          <Play className="h-4 w-4 mr-2" /> Run Simulation
        </Button>
      </div>
    </div>
  )
}
