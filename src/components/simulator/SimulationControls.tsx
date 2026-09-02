import { useSimulation } from '@/state/SimulationContext'
import { useCircuit } from '@/state/CircuitContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Play, Loader2, Database, Network, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function SimulationControls() {
  const { activeBackend, setActiveBackend, shots, setShots, isRunning, runSimulation, latestResult, isStale } = useSimulation()
  const { circuitState } = useCircuit()
  const [localShots, setLocalShots] = useState(shots.toString())
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalShots(shots.toString())
  }, [shots])

  const handleShotChange = (val: string) => {
    setLocalShots(val)
    const num = parseInt(val, 10)
    if (isNaN(num)) {
      setError('Shots must be a number')
    } else if (num < 0 || num > 100000) {
      setError('Shots must be between 0 and 100,000')
    } else {
      setError('')
      setShots(num)
    }
  }

  const handleRun = () => {
    if (error) return
    runSimulation()
  }

  const isCircuitEmpty = circuitState.operations.length === 0

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider flex items-center">
          <Database className="h-4 w-4 mr-2" /> Backend Selection
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={() => setActiveBackend('local')}
            className={`w-full flex items-center justify-between p-3 rounded border text-left transition-colors ${activeBackend === 'local' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
          >
            <div>
              <div className="font-headline-md text-sm">Local State-Vector Simulator</div>
              <div className="text-xs text-muted-foreground font-body-sm mt-1">Browser execution (Up to 10 qubits)</div>
            </div>
            {activeBackend === 'local' && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
          </button>
          
          <button
            onClick={() => setActiveBackend('qiskit')}
            className={`w-full flex items-center justify-between p-3 rounded border text-left transition-colors ${activeBackend === 'qiskit' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
          >
            <div>
              <div className="font-headline-md text-sm flex items-center">
                Qiskit Aer 
              </div>
              <div className="text-xs text-muted-foreground font-body-sm mt-1">Python/FastAPI execution (Real Qiskit Aer)</div>
            </div>
            {activeBackend === 'qiskit' && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider flex items-center">
          <Network className="h-4 w-4 mr-2" /> Execution Settings
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-code-sm text-muted-foreground uppercase">Number of Shots</label>
            <Input 
              type="text" 
              value={localShots}
              onChange={(e) => handleShotChange(e.target.value)}
              className={`font-code-sm ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {error ? (
              <p className="text-[10px] text-destructive flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {error}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground">Set to 0 for exact state vector analysis.</p>
            )}
          </div>
          
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            size="lg"
            onClick={handleRun}
            disabled={isRunning || !!error || isCircuitEmpty}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running...
              </>
            ) : isCircuitEmpty ? (
              <>No Circuit Loaded</>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Run Simulation
              </>
            )}
          </Button>

          {/* Execution Status Display */}
          {latestResult && (
             <div className={`mt-4 p-3 rounded text-sm font-body-sm border ${
               isStale ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
               : latestResult.status === 'SUCCESS' ? 'bg-primary/10 border-primary/20 text-primary' 
               : 'bg-destructive/10 border-destructive/20 text-destructive'
             }`}>
               <div className="flex items-center font-medium mb-1">
                 {isStale ? (
                   <><AlertTriangle className="w-4 h-4 mr-2" /> Circuit changed — run again</>
                 ) : latestResult.status === 'SUCCESS' ? (
                   <><CheckCircle2 className="w-4 h-4 mr-2" /> Simulation completed</>
                 ) : (
                   <><AlertCircle className="w-4 h-4 mr-2" /> Simulation failed</>
                 )}
               </div>
               
               {!isStale && latestResult.status === 'SUCCESS' ? (
                 <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2 text-foreground/80">
                   <div><span className="text-muted-foreground">Backend:</span> {latestResult.backend === 'qiskit' ? 'Qiskit Aer' : 'Local'}</div>
                   <div><span className="text-muted-foreground">Shots:</span> {latestResult.shots}</div>
                   <div><span className="text-muted-foreground">Time:</span> {Math.round(latestResult.timeTakenMs)} ms</div>
                 </div>
               ) : !isStale && latestResult.status === 'ERROR' ? (
                 <div className="text-xs mt-1 text-destructive/80 font-code-sm">
                   {latestResult.errorMessage}
                 </div>
               ) : null}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
