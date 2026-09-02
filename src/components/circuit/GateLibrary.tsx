import { GATE_DEFINITIONS } from '@/types/circuit'
import type { GateType } from '@/types/circuit'

export function GateLibrary() {
  const handleDragStart = (e: React.DragEvent, type: GateType) => {
    e.dataTransfer.setData('application/quantum-gate', type)
    e.dataTransfer.effectAllowed = 'copy'
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                    className="bg-card border border-border hover:border-primary/50 hover:bg-primary/5 p-2 rounded cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-colors group"
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
