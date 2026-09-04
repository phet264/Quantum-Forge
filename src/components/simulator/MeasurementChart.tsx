import { useSimulation } from '@/state/SimulationContext'
import { useAnimation } from '@/state/AnimationContext'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function MeasurementChart() {
  const { latestResult } = useSimulation()
  const { isAnimating, isMeasuring } = useAnimation()
  const [viewMode, setViewMode] = useState<'probabilities' | 'counts'>('probabilities')

  if (isAnimating && !isMeasuring) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded bg-card/30 text-muted-foreground p-6 text-center">
        <Loader2 className="w-8 h-8 mb-4 animate-spin text-primary/50" />
        <p className="font-headline-sm text-foreground mb-1">Quantum Execution in Progress</p>
        <p className="text-xs">Measurement pending...</p>
      </div>
    )
  }

  if (isMeasuring) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-primary/30 rounded bg-primary/5 text-primary p-6 text-center animate-pulse">
        <div className="w-12 h-12 mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="font-headline-sm mb-1 tracking-widest uppercase">Measuring...</p>
        <p className="text-xs text-primary/70">Collapsing quantum state to classical bits</p>
      </div>
    )
  }

  if (!latestResult || latestResult.status !== 'SUCCESS') {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded bg-card/30 text-muted-foreground p-6 text-center">
        No measurement data available. Run a simulation to see results.
      </div>
    )
  }

  const { probabilities, shots, measurements } = latestResult
  
  // Sort by probability descending
  const sortedStates = Object.keys(probabilities).sort((a, b) => probabilities[b] - probabilities[a])
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
        <div>
          <h4 className="font-headline-md text-foreground">Measurement Probabilities</h4>
          <p className="text-xs text-muted-foreground font-body-sm">Based on {shots === 0 ? 'exact state vector' : `${shots} shots`}</p>
        </div>
        
        {shots > 0 && (
          <div className="flex bg-muted/50 rounded-md p-1 border border-border">
            <button 
              onClick={() => setViewMode('probabilities')}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${viewMode === 'probabilities' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Probabilities
            </button>
            <button 
              onClick={() => setViewMode('counts')}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${viewMode === 'counts' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Counts
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-2">
        {sortedStates.map(state => {
          const prob = probabilities[state]
          const widthPct = Math.max(1, Math.round(prob * 100))
          const count = measurements[state] || 0
          
          const displayValue = viewMode === 'counts' && shots > 0 
            ? `${count}` 
            : `${(prob * 100).toFixed(1)}%`
            
          return (
            <div key={state} className="flex items-center space-x-3 group relative">
              <div className="w-12 text-right font-code-sm text-foreground shrink-0">
                |{state}⟩
              </div>
              
              <div className="flex-1 h-8 bg-card border border-border rounded-sm overflow-hidden relative">
                {/* Bar */}
                <div 
                  className="h-full bg-primary/80 group-hover:bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              
              <div className="w-16 font-code-sm text-muted-foreground group-hover:text-foreground transition-colors text-right shrink-0">
                {displayValue}
              </div>
              
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 rounded text-xs font-code-sm text-foreground whitespace-nowrap transition-opacity z-10 pointer-events-none">
                {shots > 0 ? `${count} counts` : 'Exact'} ({(prob * 100).toFixed(1)}%)
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
