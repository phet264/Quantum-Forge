import { useSimulation } from '@/state/SimulationContext'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

export function StateVectorView() {
  const { latestResult } = useSimulation()
  const [showOnlyNonZero, setShowOnlyNonZero] = useState(true)

  if (!latestResult || latestResult.status !== 'SUCCESS' || !latestResult.stateVector) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-border rounded bg-card/30 text-muted-foreground p-6 text-center">
        State vector data unavailable. Run an exact simulation.
      </div>
    )
  }

  const { stateVector } = latestResult
  const numQubits = Math.log2(stateVector.length)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
        <h4 className="font-headline-md text-foreground">State Vector Amplitudes</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Show non-zero only</span>
          <Switch 
            checked={showOnlyNonZero} 
            onCheckedChange={setShowOnlyNonZero} 
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-[10px] font-label-caps uppercase text-muted-foreground">
              <th className="py-2 px-2 font-medium">State</th>
              <th className="py-2 px-2 font-medium">Amplitude (a + bi)</th>
              <th className="py-2 px-2 font-medium">Magnitude (r)</th>
              <th className="py-2 px-2 font-medium">Phase (θ)</th>
              <th className="py-2 px-2 font-medium text-right">Prob</th>
            </tr>
          </thead>
          <tbody className="font-code-sm text-sm">
            {stateVector.map((amplitude, index) => {
              const binStr = index.toString(2).padStart(numQubits, '0')
              const prob = amplitude.real * amplitude.real + amplitude.imag * amplitude.imag
              
              if (showOnlyNonZero && prob < 0.0001) return null

              const realStr = amplitude.real.toFixed(3)
              const imagStr = amplitude.imag >= 0 ? `+${amplitude.imag.toFixed(3)}i` : `${amplitude.imag.toFixed(3)}i`
              const magnitude = Math.sqrt(prob).toFixed(3)
              
              // Calculate phase in degrees
              let phaseDeg = 0
              if (prob >= 0.0001) {
                 phaseDeg = (Math.atan2(amplitude.imag, amplitude.real) * 180 / Math.PI)
                 if (phaseDeg < 0) phaseDeg += 360
              }

              return (
                <tr key={index} className={`border-b border-border/20 hover:bg-muted/30 ${prob < 0.0001 ? 'opacity-40' : ''}`}>
                  <td className="py-2 px-2 font-bold text-primary">|{binStr}⟩</td>
                  <td className="py-2 px-2 text-muted-foreground">
                    {realStr} {imagStr}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">{magnitude}</td>
                  <td className="py-2 px-2 text-muted-foreground">{prob >= 0.0001 ? `${phaseDeg.toFixed(1)}°` : '-'}</td>
                  <td className="py-2 px-2 text-right">
                    {(prob * 100).toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
