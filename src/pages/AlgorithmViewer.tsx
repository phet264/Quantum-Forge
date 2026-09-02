import { useParams, useNavigate } from 'react-router-dom'
import { ALGORITHMS } from '@/data/learningContent'
import { useProgress } from '@/state/ProgressContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export function AlgorithmViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, markAlgorithmComplete } = useProgress()

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
        <p className="text-muted-foreground font-body-sm mb-4">Algorithm circuitry visualization.</p>
        <div className="bg-muted p-4 rounded inline-block text-sm text-muted-foreground">
          [ Circuit viewer will load here in Phase 2 ]
        </div>
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
