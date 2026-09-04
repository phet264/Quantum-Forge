import { useParams, useNavigate } from 'react-router-dom'
import { ALGORITHMS } from '@/data/learningContent'
import { useProgress } from '@/state/ProgressContext'
import { useCircuit } from '@/state/CircuitContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Play, Code2 } from 'lucide-react'

export function AlgorithmViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, markAlgorithmComplete } = useProgress()
  const { updateFromCode } = useCircuit()

  const algorithm = ALGORITHMS.find(a => a.id === id)

  if (!algorithm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="font-headline-lg text-headline-lg text-foreground">Algorithm Not Found</h2>
        <Button onClick={() => navigate('/research')} variant="outline">Back to Catalog</Button>
      </div>
    )
  }

  const isCompleted = progress.completedAlgorithms.includes(algorithm.id)

  const handleComplete = () => {
    markAlgorithmComplete(algorithm.id, algorithm.title)
    navigate('/research')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-stack-xl">
      <button 
        onClick={() => navigate('/research')}
        className="flex items-center text-sm font-code-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Catalog
      </button>

      <div className="space-y-2 border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <span className="font-label-caps uppercase text-muted-foreground border border-border px-2 py-0.5 rounded tracking-wider">
            {algorithm.difficulty} Algorithm
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-label-caps text-primary border border-primary/50 px-2 py-0.5 rounded uppercase">
              <CheckCircle2 className="h-3 w-3" /> Mastered
            </span>
          )}
        </div>
        <h1 className="font-display-lg-mobile md:font-display-lg m-0 text-foreground">{algorithm.title}</h1>
        <p className="text-muted-foreground font-body-md text-lg">{algorithm.description}</p>
      </div>

      <div className="prose prose-invert max-w-none font-body-md leading-relaxed">
        <h3 className="font-headline-md mt-6 mb-2">Theoretical Overview</h3>
        <p>{algorithm.theory}</p>
      </div>

      <div className="glass-card rounded-lg p-8 my-8 text-center border-dashed">
        <h4 className="font-headline-md mb-2">Circuit Implementation</h4>
        
        {algorithm.canonicalCircuitQasm ? (
          <>
            <p className="text-muted-foreground font-body-sm mb-6">Algorithm circuitry visualization.</p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => {
                updateFromCode(algorithm.canonicalCircuitQasm!)
                navigate('/circuit-builder')
              }} variant="outline" className="gap-2">
                <Code2 className="w-4 h-4" /> Try in Circuit Builder
              </Button>
              <Button onClick={() => {
                updateFromCode(algorithm.canonicalCircuitQasm!)
                navigate('/simulator', { state: { autoRun: true } })
              }} variant="default" className="gap-2">
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-muted-foreground font-body-md mb-4 max-w-lg text-center">
              QuantumForge currently provides the theory and algorithm explanation for {algorithm.title}, but does not yet provide a canonical executable circuit for this algorithm.
            </p>
            <div className="bg-muted p-4 rounded inline-block text-sm text-muted-foreground mb-4">
              Circuit implementation unavailable
            </div>
            <Button onClick={() => {
                // Clear any existing circuit for a fresh builder
                updateFromCode('OPENQASM 2.0;\\ninclude "qelib1.inc";\\nqreg q[1];\\n')
                navigate('/circuit-builder')
              }} variant="outline">
              Open Circuit Builder
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-8 border-t border-border">
        <Button 
          onClick={handleComplete} 
          disabled={isCompleted}
          className={`${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompleted ? 'Algorithm Mastered' : 'Mark as Studied'}
        </Button>
      </div>
    </div>
  )
}
