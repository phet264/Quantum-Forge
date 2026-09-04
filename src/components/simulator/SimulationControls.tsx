import { useSimulation } from '@/state/SimulationContext'
import { useCircuit } from '@/state/CircuitContext'
import { useAnimation } from '@/state/AnimationContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Play, Square, RotateCcw, Pause, Loader2, Database, Network, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function SimulationControls() {
  const { activeBackend, setActiveBackend, shots, setShots, isRunning, runSimulation, latestResult, isStale } = useSimulation()
  const { circuitState } = useCircuit()
  const { playAnimation, stopAnimation, pauseAnimation, resumeAnimation, restartAnimation, isPlaying, isPaused, isAnimating, progress, isMeasuring, settings, updateSettings } = useAnimation()
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

  const handleRun = async () => {
    if (error) return
    
    // 1. Capture current circuit implicitly via context
    // 2. Execute actual simulation first
    await runSimulation()
    
    // 3. Play animation
    if (settings.enabled) {
      await playAnimation(circuitState)
    }
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
            disabled={isRunning || isPlaying || !!error || isCircuitEmpty}
          >
            {isRunning || isPlaying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {isPlaying ? 'Animating...' : 'Simulating...'}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" /> Run Simulation
              </>
            )}
          </Button>

          {settings.enabled && (isPlaying || isRunning) && (
            <div className="flex flex-col space-y-2 mt-4 p-4 border border-primary/20 bg-primary/5 rounded-md">
              <div className="flex justify-between text-xs font-code-sm text-primary uppercase mb-2">
                <span>{isMeasuring ? 'Measuring...' : isPaused ? 'Paused' : 'Animating...'}</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-primary/20 h-1 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex space-x-2">
                {isPaused ? (
                  <Button className="flex-1" variant="default" size="sm" onClick={resumeAnimation}>
                    <Play className="w-4 h-4 mr-1" /> Resume
                  </Button>
                ) : (
                  <Button className="flex-1" variant="secondary" size="sm" onClick={pauseAnimation} disabled={!isAnimating || isMeasuring}>
                    <Pause className="w-4 h-4 mr-1" /> Pause
                  </Button>
                )}
                <Button className="flex-1" variant="outline" size="sm" onClick={() => restartAnimation(circuitState)}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Restart
                </Button>
                <Button className="flex-1" variant="destructive" size="sm" onClick={stopAnimation}>
                  <Square className="w-4 h-4 mr-1" /> Stop
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-code-sm uppercase">Animate Execution</span>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSettings({ enabled: checked })} 
              />
            </div>
            {settings.enabled && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-code-sm uppercase">Speed ({settings.speed}x)</span>
                <input 
                  type="range" 
                  min="0.2" max="3" step="0.1" 
                  value={settings.speed}
                  onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
                  className="w-24"
                />
              </div>
            )}
          </div>

          {/* Execution Status Display */}
          {latestResult && !isPlaying && (
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
