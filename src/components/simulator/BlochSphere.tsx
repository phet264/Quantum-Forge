import { useState, useMemo } from 'react'
import { useSimulation } from '@/state/SimulationContext'
import { useAnimation } from '@/state/AnimationContext'

export function BlochSphere() {
  const { latestResult } = useSimulation()
  const { isAnimating, intermediateStateVector, settings } = useAnimation()
  const [selectedQubit, setSelectedQubit] = useState(0)

  // Calculate Bloch vector (X, Y, Z) for the selected qubit
  const blochVector = useMemo(() => {
    const stateVector = isAnimating ? intermediateStateVector : latestResult?.stateVector
    if (!stateVector) return null
    
    const numQubits = Math.log2(stateVector.length)
    if (selectedQubit >= numQubits) return null

    let expX = 0, expY = 0, expZ = 0

    const dim = stateVector.length
    for (let i = 0; i < dim; i++) {
      const bit = (i >> selectedQubit) & 1
      const partner = i ^ (1 << selectedQubit)
      
      const realI = stateVector[i].real
      const imagI = stateVector[i].imag
      
      const prob = realI * realI + imagI * imagI
      expZ += bit === 0 ? prob : -prob

      if (bit === 0) {
        const realP = stateVector[partner].real
        const imagP = stateVector[partner].imag
        
        const prodReal = realI * realP + imagI * imagP
        const prodImag = imagI * realP - realI * imagP
        
        expX += 2 * prodReal
        expY += -2 * prodImag // Correct sign for Y expectation
      }
    }

    return { x: expX, y: expY, z: expZ }
  }, [latestResult, isAnimating, intermediateStateVector, selectedQubit])

  const stateVector = isAnimating ? intermediateStateVector : latestResult?.stateVector

  if (!stateVector) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded bg-card/30 text-muted-foreground p-6 text-center">
        Bloch sphere requires full state vector data.
      </div>
    )
  }

  const numQubits = Math.log2(stateVector.length)

  const radius = 80
  const cx = 100
  const cy = 100
  
  const projX = blochVector ? cx + radius * (blochVector.y * 0.866 - blochVector.x * 0.866) : cx
  const projY = blochVector ? cy + radius * (-blochVector.z + blochVector.x * 0.5 + blochVector.y * 0.5) : cy

  let theta = 0
  let phi = 0
  if (blochVector) {
    // Clamp z to [-1, 1] to avoid NaN from floating point precision
    const clampZ = Math.max(-1, Math.min(1, blochVector.z))
    theta = Math.acos(clampZ) * (180 / Math.PI)
    phi = Math.atan2(blochVector.y, blochVector.x) * (180 / Math.PI)
    if (phi < 0) phi += 360
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
        <h4 className="font-headline-md text-foreground">Bloch Sphere</h4>
        
        <select 
          value={selectedQubit}
          onChange={(e) => setSelectedQubit(Number(e.target.value))}
          className="bg-card border border-border text-xs rounded p-1 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          {Array.from({ length: numQubits }).map((_, i) => (
            <option key={i} value={i}>Qubit q[{i}]</option>
          ))}
        </select>
      </div>
      
      {numQubits > 1 && (
        <div className="text-[10px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded p-2 mb-4 leading-tight">
          <strong>Note:</strong> Showing reduced state for Qubit q[{selectedQubit}]. A single Bloch sphere cannot fully represent entangled multi-qubit states.
        </div>
      )}

      <div className="flex items-center justify-center bg-card/20 rounded-lg p-4 border border-border/50">
        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-md">
          {/* Sphere Outline */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />
          
          {/* Equator */}
          <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 0.3} fill="none" stroke="currentColor" className="text-border/50" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Axes */}
          <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke="currentColor" className="text-border/50" strokeWidth="1" />
          <text x={cx - 4} y={cy - radius - 5} className="text-[10px] fill-muted-foreground font-code-sm">|0⟩</text>
          <text x={cx - 4} y={cy + radius + 12} className="text-[10px] fill-muted-foreground font-code-sm">|1⟩</text>
          
          <line x1={cx} y1={cy} x2={cx - radius * 0.866} y2={cy + radius * 0.5} stroke="currentColor" className="text-border/50" strokeWidth="1" />
          <text x={cx - radius * 0.866 - 15} y={cy + radius * 0.5 + 5} className="text-[10px] fill-muted-foreground font-code-sm">x</text>
          
          <line x1={cx} y1={cy} x2={cx + radius * 0.866} y2={cy + radius * 0.5} stroke="currentColor" className="text-border/50" strokeWidth="1" />
          <text x={cx + radius * 0.866 + 5} y={cy + radius * 0.5 + 5} className="text-[10px] fill-muted-foreground font-code-sm">y</text>
          
          {/* State Vector */}
          {blochVector && (
            <>
              <line 
                x1={cx} y1={cy} x2={projX} y2={projY} 
                stroke="currentColor" 
                className="text-primary" 
                strokeWidth="2" 
                style={{ transition: !settings.prefersReducedMotion ? 'all 0.3s ease-in-out' : 'none' }}
              />
              <circle 
                cx={projX} cy={projY} r="4" 
                fill="currentColor" 
                className="text-primary" 
                style={{ transition: !settings.prefersReducedMotion ? 'all 0.3s ease-in-out' : 'none' }}
              />
            </>
          )}
        </svg>
      </div>

      {blochVector && (
        <div className="grid grid-cols-2 gap-2 text-[10px] font-code-sm text-muted-foreground bg-muted/20 p-2 rounded border border-border/50">
          <div>
            <div className="mb-1"><span className="text-foreground/80 font-medium">⟨X⟩:</span> {blochVector.x.toFixed(3)}</div>
            <div className="mb-1"><span className="text-foreground/80 font-medium">⟨Y⟩:</span> {blochVector.y.toFixed(3)}</div>
            <div><span className="text-foreground/80 font-medium">⟨Z⟩:</span> {blochVector.z.toFixed(3)}</div>
          </div>
          <div>
            <div className="mb-1"><span className="text-foreground/80 font-medium">θ:</span> {theta.toFixed(1)}°</div>
            <div><span className="text-foreground/80 font-medium">φ:</span> {blochVector.x === 0 && blochVector.y === 0 ? '-' : `${phi.toFixed(1)}°`}</div>
          </div>
        </div>
      )}
    </div>
  )
}
