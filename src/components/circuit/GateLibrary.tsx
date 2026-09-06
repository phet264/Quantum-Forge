import { GATE_DEFINITIONS } from '@/types/circuit'
import type { GateType } from '@/types/circuit'
import { useCircuit } from '@/state/CircuitContext'

export function GateLibrary() {
  const { selectTool, selectedTool, setDraggedTool } = useCircuit()
  const handleDragStart = (e: React.DragEvent, type: GateType) => {
    console.log('[QF-DND] DRAG_START', { gateType: type, sourceComponent: 'GateLibrary', dragData: type })
    e.dataTransfer.setData('application/quantum-gate', type)
    e.dataTransfer.setData('text/plain', type)
    e.dataTransfer.effectAllowed = 'copy'
    setDraggedTool(type)
  }

  const handleDragEnd = () => {
    setDraggedTool(null)
  }

  const categories = {
    'Single Qubit': ['I', 'X', 'Y', 'Z', 'H', 'S', 'T'] as GateType[],
    'Rotations': ['Rx', 'Ry', 'Rz'] as GateType[],
    'Multi Qubit': ['CX', 'CZ', 'SWAP'] as GateType[],
    'Measurement': ['Measure'] as GateType[]
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider px-2">Gate Library</h3>
      
      <div className="space-y-6 flex-1 pr-2">
        {Object.entries(categories).map(([category, gates]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-foreground/70 mb-3 px-2">{category}</h4>
            <div className="grid grid-cols-2 gap-2 px-2">
              {gates.map(type => {
                const def = GATE_DEFINITIONS[type]
                return (
                  <div
                    key={type}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, type)}
                    onDragEnd={handleDragEnd}
                    onPointerDown={() => selectTool(selectedTool === type ? null : type)}
                    className={`border p-2 rounded flex flex-col items-center justify-center transition-colors group ${
                      selectedTool === type 
                        ? 'bg-primary/20 border-primary ring-2 ring-primary/30 cursor-crosshair' 
                        : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5 cursor-grab active:cursor-grabbing'
                    }`}
                    title={def.description}
                  >
                    <div className="w-8 h-8 rounded border border-primary/30 flex items-center justify-center font-code-sm text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all mb-1 shadow-sm">
                      {type === 'Measure' ? 'M' : type}
                    </div>
                    <span className="text-[10px] font-body-sm text-muted-foreground">{def.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
