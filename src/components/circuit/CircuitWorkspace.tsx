import { useCircuit } from '@/state/CircuitContext'
import { getCircuitDepth, isCellOccupied, GATE_DEFINITIONS } from '@/types/circuit'
import type { GateType } from '@/types/circuit'
import { Trash2 } from 'lucide-react'

export function CircuitWorkspace() {
  const { circuitState, addGate, selectGate, selectedGateId, removeGate } = useCircuit()
  const { numQubits, operations } = circuitState
  
  // Create a grid up to the current depth + 5 empty steps for expansion
  const depth = Math.max(10, getCircuitDepth(circuitState) + 5)
  const timeSteps = Array.from({ length: depth }, (_, i) => i)
  const qubits = Array.from({ length: numQubits }, (_, i) => i)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent, targetQubit: number, timeStep: number) => {
    e.preventDefault()
    const gateType = e.dataTransfer.getData('application/quantum-gate') as GateType
    if (!gateType || !GATE_DEFINITIONS[gateType]) return

    // Prevent placing on occupied cell
    if (isCellOccupied(circuitState, targetQubit, timeStep)) return

    const def = GATE_DEFINITIONS[gateType]
    
    // Default assignments for targets and controls
    let targets = [targetQubit]
    let controls: number[] = []

    if (def.numControls === 1) {
      // If CX or CZ, we need a control. Try to place control on qubit above, else below
      const controlQubit = targetQubit > 0 ? targetQubit - 1 : targetQubit + 1
      if (controlQubit < numQubits && !isCellOccupied(circuitState, controlQubit, timeStep)) {
        controls = [controlQubit]
      } else {
        // If we can't find a valid control slot, abort (or we could just drop it and let it be invalid, but aborting is safer)
        alert('Not enough space for a controlled gate here.')
        return
      }
    } else if (def.numTargets === 2) {
      // SWAP gate
      const target2 = targetQubit > 0 ? targetQubit - 1 : targetQubit + 1
      if (target2 < numQubits && !isCellOccupied(circuitState, target2, timeStep)) {
        targets = [targetQubit, target2]
      } else {
        alert('Not enough space for a SWAP gate here.')
        return
      }
    }

    addGate({
      type: gateType,
      targets,
      controls,
      timeStep,
      param: def.hasParam ? 'pi/2' : undefined
    })
  }

  return (
    <div className="flex-1 overflow-auto bg-card rounded-lg border border-border relative">
      <div className="min-w-max p-6 inline-block">
        
        {/* Timeline Header */}
        <div className="flex mb-4">
          <div className="w-16 shrink-0"></div>
          {timeSteps.map(step => (
            <div key={step} className="w-16 text-center font-code-sm text-[10px] uppercase tracking-wider text-muted-foreground/70 shrink-0">
              Step {step}
            </div>
          ))}
        </div>

        {/* Wires Grid */}
        <div className="relative">
          {qubits.map(q => (
            <div key={q} className="flex h-16 items-center relative group">
              {/* Qubit Label */}
              <div className="w-16 shrink-0 font-code-sm text-foreground/80 flex items-center justify-center font-bold">
                q[{q}]
              </div>
              
              {/* Wire Line */}
              <div className="absolute left-16 right-0 h-[2px] bg-border z-0 top-1/2 -translate-y-1/2 group-hover:bg-primary/30 transition-colors"></div>

              {/* Drop Zones */}
              {timeSteps.map(step => (
                <div 
                  key={step} 
                  className="w-16 h-16 shrink-0 relative z-10 border border-transparent hover:border-primary/50 hover:bg-primary/10 transition-colors rounded-sm"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, q, step)}
                  onClick={() => selectGate(null)}
                >
                </div>
              ))}
            </div>
          ))}

          {/* Render Gates Overlay */}
          {operations.map(op => {
            const minQubit = Math.min(...op.targets, ...(op.controls || []))
            const maxQubit = Math.max(...op.targets, ...(op.controls || []))
            const span = maxQubit - minQubit
            const isSelected = selectedGateId === op.id

            return (
              <div 
                key={op.id}
                className="absolute z-20"
                style={{
                  left: `${64 + op.timeStep * 64}px`, // 64px offset + 64px per step
                  top: `${minQubit * 64}px`, // 64px per wire height
                  width: '64px',
                  height: `${(span + 1) * 64}px`
                }}
              >
                <div 
                  className={`absolute inset-2 bg-background border flex flex-col items-center justify-center rounded cursor-pointer transition-colors shadow-sm ${
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectGate(op.id)
                  }}
                >
                  <span className="font-code-sm font-bold text-primary">{op.type}</span>
                  {op.param && <span className="text-[10px] font-code-sm text-muted-foreground">{op.param}</span>}
                  
                  {/* Visual connections for multi-qubit gates */}
                  {span > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 bg-primary/50" 
                         style={{ height: `${span * 64 - 16}px` }} 
                    />
                  )}

                  {/* Delete button (only visible when selected) */}
                  {isSelected && (
                    <button 
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md hover:scale-110 hover:bg-red-600 transition-all z-30"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeGate(op.id)
                      }}
                      title="Delete gate"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          {operations.length === 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm border border-border px-6 py-4 rounded-lg shadow-sm text-center max-w-sm">
                <p className="font-headline-md mb-2">Circuit is Empty</p>
                <p className="text-muted-foreground font-body-sm">
                  Drag and drop gates from the library onto the wires, or use the editor to write QASM code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
