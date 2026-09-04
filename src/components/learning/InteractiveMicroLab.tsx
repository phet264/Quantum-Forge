import { useEffect, useRef } from 'react'
import { CircuitProvider, useCircuit } from '@/state/CircuitContext'
import { SimulationProvider, useSimulation } from '@/state/SimulationContext'
import { AnimationProvider, useAnimation } from '@/state/AnimationContext'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { BlochSphere } from '../simulator/BlochSphere'
import { StateVectorView } from '../simulator/StateVectorView'
import { MeasurementChart } from '../simulator/MeasurementChart'
import type { GateType } from '@/types/circuit'

interface InteractiveMicroLabProps {
  initialQasm: string
  title: string
  description: string
  availableGates?: ('X' | 'H' | 'Z' | 'Y' | 'CX')[]
  visualizations?: ('bloch' | 'stateVector' | 'measurement')[]
}

function MicroLabInner({
  initialQasm,
  title,
  description,
  availableGates = ['X', 'H', 'Z'],
  visualizations = ['stateVector', 'bloch']
}: InteractiveMicroLabProps) {
  const { updateFromCode, addGate, circuitState, clearCircuit } = useCircuit()
  const { runSimulation, isRunning } = useSimulation()
  const { playAnimation, isAnimating, stopAnimation } = useAnimation()
  
  const hasMounted = useRef(false)
  const isResetting = useRef(false)

  // Initialize circuit and run simulation once on mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      updateFromCode(initialQasm)
    }
  }, [initialQasm, updateFromCode])

  // Automatically run simulation when circuit state changes
  useEffect(() => {
    if (hasMounted.current && circuitState.operations.length > 0 && !isAnimating && !isResetting.current) {
      // Small timeout to allow state to settle
      const timer = setTimeout(() => {
        runSimulation()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [circuitState, isAnimating, runSimulation])

  const handleApplyGate = async (gateType: string) => {
    if (isRunning || isAnimating) return
    
    addGate({
      type: gateType as GateType,
      targets: [0], // For simplicity in micro-labs, target q0 (unless CX)
      controls: gateType === 'CX' ? [0] : [],
      ...(gateType === 'CX' ? { targets: [1] } : {}),
      timeStep: Math.max(0, ...circuitState.operations.map((o: any) => o.timeStep)) + 1
    })

    // We will let the useEffect pick up the circuitState change and runSimulation.
    // However, to trigger Phase 6 animation, we should explicitly call playAnimation.
    // Wait, playAnimation takes the circuit state and simulates step by step.
    // Let's run simulation first then animate.
    setTimeout(async () => {
      await runSimulation()
      playAnimation(circuitState) // Note: playAnimation might use stale state here, but it fetches from context.
    }, 50)
  }

  const handleReset = () => {
    if (isRunning || isAnimating) {
      stopAnimation()
    }
    isResetting.current = true
    clearCircuit()
    setTimeout(() => {
      updateFromCode(initialQasm)
      setTimeout(() => {
        isResetting.current = false
        runSimulation()
      }, 50)
    }, 50)
  }

  return (
    <div className="my-8 border border-border rounded-lg bg-card/50 overflow-hidden shadow-sm">
      <div className="bg-primary/5 px-6 py-4 border-b border-border flex justify-between items-center">
        <h4 className="font-headline-md text-foreground flex items-center">
          <span className="text-primary mr-2">Micro-Lab:</span> {title}
        </h4>
        <Button size="sm" variant="outline" onClick={handleReset} disabled={isRunning || isAnimating}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        {description && (
          <p className="font-body-md text-muted-foreground">{description}</p>
        )}
        
        <div className="flex space-x-4">
          <div className="flex-1 space-y-4">
            <h5 className="font-label-caps text-xs text-muted-foreground uppercase tracking-wider">Controls</h5>
            <div className="flex flex-wrap gap-2">
              {availableGates.map(gate => (
                <Button 
                  key={gate} 
                  variant="secondary" 
                  onClick={() => handleApplyGate(gate)}
                  disabled={isRunning || isAnimating}
                >
                  Apply {gate} Gate
                </Button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <h5 className="font-label-caps text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Circuit</h5>
              <div className="font-code-sm text-sm text-foreground bg-background p-3 rounded border border-border overflow-x-auto">
                {circuitState.operations.length === 0 ? (
                  <span className="text-muted-foreground">Empty circuit...</span>
                ) : (
                  circuitState.operations.map((op: any, i: number) => (
                    <span key={i} className="inline-block mr-2 px-1 py-0.5 bg-muted rounded">
                      {op.type}(q{op.targets[0]}{op.controls.length ? `, c${op.controls[0]}` : ''})
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-4 border-l border-border pl-4">
            {visualizations.includes('bloch') && (
              <div className="bg-background rounded p-2 border border-border">
                <h5 className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-wider mb-1 px-2">Bloch Sphere (q0)</h5>
                <BlochSphere />
              </div>
            )}
            
            {visualizations.includes('stateVector') && (
              <div className="bg-background rounded p-2 border border-border">
                <h5 className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-wider mb-1 px-2">State Vector</h5>
                <StateVectorView />
              </div>
            )}
            
            {visualizations.includes('measurement') && (
              <div className="bg-background rounded p-2 border border-border">
                <h5 className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-wider mb-1 px-2">Measurement</h5>
                <MeasurementChart />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InteractiveMicroLab(props: InteractiveMicroLabProps) {
  return (
    <CircuitProvider>
      <AnimationProvider>
        <SimulationProvider>
          <MicroLabInner {...props} />
        </SimulationProvider>
      </AnimationProvider>
    </CircuitProvider>
  )
}
