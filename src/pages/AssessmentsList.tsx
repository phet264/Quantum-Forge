import { ASSESSMENTS } from '@/data/assessmentContent'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function AssessmentsList() {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-headline-lg font-bold">Assessments</h1>
        <p className="text-muted-foreground mt-2">Test your quantum computing knowledge and earn points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSESSMENTS.map(assessment => (
          <div key={assessment.id} className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold">{assessment.title}</h2>
              <Badge variant="secondary">{assessment.difficulty}</Badge>
            </div>
            <p className="text-muted-foreground text-sm flex-1 mb-6">{assessment.description}</p>
            <Button className="w-full" onClick={() => navigate(`/assessment/${assessment.id}`)}>
              Start Assessment
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
