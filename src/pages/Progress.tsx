import { useProgress } from '@/state/ProgressContext'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { COURSES } from '@/data/learningContent'
import { CheckCircle, Target, Award, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Progress() {
  const { progress, getOverallProgress } = useProgress()
  const navigate = useNavigate()

  const overall = getOverallProgress()
  
  // Modules Progress Calculation
  const modules = COURSES.flatMap(c => c.modules)
  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId)
    if (!mod) return 0
    const totalLessons = mod.lessons.length
    if (totalLessons === 0) return 100
    const completed = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length
    return Math.round((completed / totalLessons) * 100)
  }

  // Assessment Stats
  const scores = Object.values(progress.assessmentScores || {})
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const totalAssessments = progress.completedAssessments?.length || 0

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold">Your Progress</h1>
          <p className="text-muted-foreground mt-2">Track your quantum computing journey.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-label-caps uppercase text-muted-foreground mb-1">Overall Course Progress</p>
          <div className="flex items-center gap-4">
            <div className="w-48 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${overall}%` }} />
            </div>
            <span className="text-2xl font-bold">{overall}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Learning Progress */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Learning Modules
            </h2>
            <div className="space-y-6">
              {modules.map(mod => {
                const perc = getModuleProgress(mod.id)
                return (
                  <div key={mod.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-semibold">{mod.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{mod.description}</p>
                      </div>
                      <span className="font-code-sm">{perc}%</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${perc}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Performance & Activity */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Assessment Performance
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-foreground">{totalAssessments}</p>
                <p className="text-xs font-label-caps uppercase text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-primary">{avgScore}%</p>
                <p className="text-xs font-label-caps uppercase text-muted-foreground mt-1">Avg Score</p>
              </div>
            </div>
            <Button className="w-full" variant="outline" onClick={() => navigate('/')}>Take New Assessment</Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            {progress.recentActivity && progress.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {progress.recentActivity.slice(0, 5).map(act => (
                  <div key={act.id} className="flex gap-3 text-sm">
                    <div className="mt-0.5 shrink-0">
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{act.itemTitle}</p>
                      <p className="text-muted-foreground text-xs">{new Date(act.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
