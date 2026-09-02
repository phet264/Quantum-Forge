import { useCircuit } from '@/state/CircuitContext'
import { useSimulation } from '@/state/SimulationContext'
import { Activity, Layers, Cpu, Database } from 'lucide-react'
import { getCircuitDepth } from '@/types/circuit'

export function CircuitSummary() {
  const { circuitState } = useCircuit()
  const { activeBackend } = useSimulation()
  
  const depth = getCircuitDepth(circuitState)
  
  // Filter out Identity gates for 'Active Gates' metric
  const activeGates = circuitState.operations.filter(op => op.type !== 'I')
  const gateCount = activeGates.length
  
  return (
    <div className="glass-card rounded-lg p-5 mb-6 flex items-center justify-between border border-border bg-card/50 overflow-x-auto">
      <div className="flex items-center space-x-6 min-w-max">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded mr-3">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-label-caps text-muted-foreground uppercase">Qubits</div>
            <div className="font-code-sm text-lg font-bold">{circuitState.numQubits}</div>
          </div>
        </div>
        
        <div className="h-8 w-px bg-border"></div>
        
        <div className="flex items-center">
          <div className="p-2 bg-secondary/10 rounded mr-3">
            <Layers className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <div className="text-xs font-label-caps text-muted-foreground uppercase">Active Gates</div>
            <div className="font-code-sm text-lg font-bold">{gateCount}</div>
          </div>
        </div>
        
        <div className="h-8 w-px bg-border"></div>
        
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded mr-3">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-label-caps text-muted-foreground uppercase">Circuit Depth</div>
            <div className="font-code-sm text-lg font-bold">{depth}</div>
          </div>
        </div>

        <div className="h-8 w-px bg-border"></div>
        
        <div className="flex items-center">
          <div className="p-2 bg-muted rounded mr-3">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xs font-label-caps text-muted-foreground uppercase">Selected Backend</div>
            <div className="font-code-sm text-sm font-bold mt-1">
               {activeBackend === 'qiskit' ? 'Qiskit Aer' : 'Local State-Vector'}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
