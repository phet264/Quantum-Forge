import { useCircuit } from '@/state/CircuitContext'
import { GATE_DEFINITIONS } from '@/types/circuit'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function GateInspector() {
  const { circuitState, selectedGateId, updateGate, removeGate } = useCircuit()
  
  const gate = circuitState.operations.find(op => op.id === selectedGateId)
  
  if (!gate) {
    return (
      <div className="h-full flex flex-col">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider">Inspector</h3>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground bg-muted/30 rounded border border-dashed border-border p-4 text-center">
          Select a gate on the circuit to view its properties.
        </div>
      </div>
    )
  }

  const def = GATE_DEFINITIONS[gate.type]

  const handleTargetChange = (index: number, val: string) => {
    let num = parseInt(val, 10)
    if (isNaN(num)) num = 0
    num = Math.max(0, Math.min(num, circuitState.numQubits - 1))
    const newTargets = [...gate.targets]
    newTargets[index] = num
    updateGate(gate.id, { targets: newTargets })
  }

  const handleControlChange = (index: number, val: string) => {
    let num = parseInt(val, 10)
    if (isNaN(num)) num = 0
    num = Math.max(0, Math.min(num, circuitState.numQubits - 1))
    const newControls = [...gate.controls]
    newControls[index] = num
    updateGate(gate.id, { controls: newControls })
  }

  const handleParamChange = (val: string) => {
    updateGate(gate.id, { param: val })
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider">Inspector</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="font-headline-md">{def.name} ({gate.type})</span>
        </div>

        <div className="space-y-3">
          {gate.targets.map((t, idx) => (
            <div key={`target-${idx}`} className="space-y-1">
              <label className="text-xs font-code-sm text-muted-foreground uppercase">Target Qubit {def.numTargets > 1 ? idx + 1 : ''}</label>
              <Input 
                type="number" 
                min={0} 
                max={circuitState.numQubits - 1} 
                value={t} 
                onChange={e => handleTargetChange(idx, e.target.value)}
                className="font-code-sm"
              />
            </div>
          ))}

          {gate.controls.map((c, idx) => (
            <div key={`control-${idx}`} className="space-y-1">
              <label className="text-xs font-code-sm text-muted-foreground uppercase">Control Qubit</label>
              <Input 
                type="number" 
                min={0} 
                max={circuitState.numQubits - 1} 
                value={c} 
                onChange={e => handleControlChange(idx, e.target.value)}
                className="font-code-sm"
              />
            </div>
          ))}

          {def.hasParam && (
            <div className="space-y-1">
              <label className="text-xs font-code-sm text-muted-foreground uppercase">Parameter (Angle)</label>
              <Input 
                type="text" 
                value={gate.param || ''} 
                onChange={e => handleParamChange(e.target.value)}
                className="font-code-sm"
                placeholder="e.g. pi/2"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-code-sm text-muted-foreground uppercase">Time Step</label>
            <Input 
              type="number" 
              value={gate.timeStep} 
              disabled
              className="font-code-sm bg-muted/50"
            />
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <Button variant="destructive" className="w-full" onClick={() => removeGate(gate.id)}>
            Delete Gate
          </Button>
        </div>
      </div>
    </div>
  )
}
