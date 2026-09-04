import { useProgress } from '@/state/ProgressContext'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { BrainCircuit, BookOpen, ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export function RecommendationsCard() {
  const { progress } = useProgress()
  const navigate = useNavigate()

  const completedSet = new Set(progress.completedAssessments || [])
  const available = ASSESSMENTS.filter(a => !completedSet.has(a.id))

  // Find lowest scoring assessment to recommend a re-try or study
  let lowestScore = 100
  let weakestAssessmentId = ''
  Object.entries(progress.assessmentScores || {}).forEach(([id, score]) => {
    if (score < lowestScore) {
      lowestScore = score
      weakestAssessmentId = id
    }
  })

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-headline-md font-bold text-foreground mb-6 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        Recommended for You
      </h2>

      <div className="space-y-4 flex-1">
        {lowestScore < 70 && weakestAssessmentId && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-bold text-sm text-destructive mb-1 font-label-caps uppercase">Needs Review</h4>
            <p className="text-sm font-body-sm mb-3">Your score on {ASSESSMENTS.find(a=>a.id === weakestAssessmentId)?.title} was {lowestScore}%. We recommend reviewing the core concepts.</p>
            <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => navigate(`/assessment/${weakestAssessmentId}`)}>
              Retake Assessment
            </Button>
          </div>
        )}

        {available.slice(0, 2).map(assessment => (
          <div key={assessment.id} className="p-4 bg-muted/30 border border-border/50 rounded-lg group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">{assessment.title}</h3>
              <Badge variant="secondary" className="text-[10px] py-0">{assessment.difficulty}</Badge>
            </div>
            <p className="text-muted-foreground text-xs font-body-sm line-clamp-2 mb-4">{assessment.description}</p>
            <Button size="sm" className="w-full text-xs h-8" onClick={() => navigate(`/assessment/${assessment.id}`)}>
              Start Assessment <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {available.length === 0 && lowestScore >= 70 && (
          <div className="text-center p-6">
            <BrainCircuit className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">You've completed all current assessments!</p>
          </div>
        )}
      </div>
    </div>
  )
}
