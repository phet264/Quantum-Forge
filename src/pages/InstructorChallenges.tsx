import { useInstructor } from '@/state/InstructorContext'
import { Network, Trophy, CheckCircle } from 'lucide-react'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { Badge } from '@/components/ui/badge'

export function InstructorChallenges() {
  const { students, isLoading } = useInstructor()

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading challenges...</div>
  }

  // Calculate some simple aggregated challenge metrics
  const totalChallenges = ASSESSMENTS.reduce((sum, a) => sum + a.questions.filter(q => q.type === 'circuit-challenge').length, 0)
  const topPerformer = students.length > 0 ? students.sort((a,b) => b.averageScore - a.averageScore)[0] : null

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-3">
        <Network className="h-8 w-8 text-primary" />
        Challenges Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-label-caps uppercase text-xs">Top Performer</h3>
          </div>
          <p className="text-xl font-bold">{topPerformer ? topPerformer.name : 'N/A'}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Network className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Total Challenges Configured</h3>
          </div>
          <p className="text-xl font-bold">{totalChallenges}</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Challenge Database
        </h2>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {ASSESSMENTS.flatMap(a => a.questions)
            .filter(q => q.type === 'circuit-challenge')
            .map((challenge) => (
              <div key={challenge.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                <div className="max-w-[70%]">
                  <span className="font-medium block">{challenge.title}</span>
                  <span className="text-xs text-muted-foreground truncate block">{challenge.description}</span>
                </div>
                <Badge variant="outline" className="bg-background">
                  {challenge.points} Points
                </Badge>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}
