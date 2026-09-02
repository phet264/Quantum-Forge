import { useProgress } from '@/state/ProgressContext'
import { getNextRecommendation } from '@/services/learning/recommendationService'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function ContinueLearningCard() {
  const { progress } = useProgress()
  const recommendation = getNextRecommendation(progress)

  if (recommendation.type === 'module' && recommendation.id === 'completed') {
    return (
      <div className="glass-card rounded-lg p-6 border-primary/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-headline-md mb-2">Curriculum Complete!</h3>
          <p className="text-muted-foreground font-body-md mb-6">
            You have mastered all the available fundamentals and algorithms.
          </p>
          <Button asChild>
            <Link to="/research">Review Catalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const linkPath = recommendation.type === 'algorithm' 
    ? `/research/algorithm/${recommendation.id}`
    : `/research/lesson/${recommendation.id}`

  return (
    <div className="glass-card rounded-lg p-6 border-primary/30 hover:border-primary/60 transition-colors relative overflow-hidden group flex flex-col">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10 flex-1">
        <h3 className="font-label-caps text-muted-foreground uppercase tracking-wider mb-4">Continue Learning</h3>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-muted border border-border p-3 rounded shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-headline-md mb-1">{recommendation.title}</h4>
            <p className="text-muted-foreground text-sm">{recommendation.reason}</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-auto pt-4 border-t border-border">
        <Button asChild className="w-full gap-2 group-hover:bg-primary/90">
          <Link to={linkPath}>
            Continue <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
