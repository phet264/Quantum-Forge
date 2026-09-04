import { useSimulation } from '@/state/SimulationContext'
import { useCircuit } from '@/state/CircuitContext'
import { Info, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ResultExplanation() {
  const { latestResult } = useSimulation()
  const { circuitState } = useCircuit()

  if (!latestResult || latestResult.status !== 'SUCCESS') return null

  // Generate an explanation dynamically based on the gates.
  const getExplanation = () => {
    const lines: string[] = []
    
    // Sort gates by time
    const sortedOps = [...circuitState.operations].sort((a, b) => a.timeStep - b.timeStep)
    
    if (sortedOps.length === 0) {
      lines.push('The circuit is empty. All qubits remain in the initial |0⟩ state.')
    } else {
      let explanationCount = 0
      for (const op of sortedOps) {
        if (op.type === 'I') {
           lines.push(`• q[${op.targets[0]}] remains in its current state (Identity gate).`)
        } else if (op.type === 'X') {
           lines.push(`• X gate applies a bit-flip to q[${op.targets[0]}].`)
        } else if (op.type === 'Y') {
           lines.push(`• Y gate applies a bit-flip and phase-shift to q[${op.targets[0]}].`)
        } else if (op.type === 'Z') {
           lines.push(`• Z gate applies a phase-flip to q[${op.targets[0]}].`)
        } else if (op.type === 'H') {
           lines.push(`• Hadamard (H) gate creates a superposition on q[${op.targets[0]}].`)
        } else if (op.type === 'CX' || op.type === 'CNOT' as any) {
           lines.push(`• CNOT gate flips q[${op.targets[0]}] if control q[${op.controls[0]}] is |1⟩, entangling them.`)
        } else {
           lines.push(`• ${op.type} gate applied to q[${op.targets[0]}].`)
        }
        explanationCount++
        if (explanationCount >= 8) {
          lines.push('• ... (additional operations)')
          break
        }
      }
    }

    lines.push('• Final measurement probabilities are derived from the resulting state vector amplitudes.')
    return lines
  }

  const lines = getExplanation()

  return (
    <div className="glass-card rounded-lg p-5 mt-6 border-l-4 border-l-primary bg-card/40">
      <h4 className="font-headline-sm text-foreground flex items-center mb-3">
        <Info className="w-4 h-4 mr-2 text-primary" />
        Result Explanation
      </h4>
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <p key={idx} className="text-sm font-body-sm text-muted-foreground">{line}</p>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <Link 
          to="/tutor" 
          className="inline-flex items-center text-xs font-label-caps tracking-wider text-primary hover:text-primary/80 transition-colors uppercase"
        >
          Want a deeper explanation? Ask the AI Tutor <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
  )
}
