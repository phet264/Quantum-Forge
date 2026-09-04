import { ASSESSMENTS } from '@/data/assessmentContent'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProgress } from '@/state/ProgressContext'
import { useAssessment } from '@/state/AssessmentContext'
import { useState } from 'react'
import { Clock, HelpCircle, CheckCircle2, History, Play } from 'lucide-react'

type CategoryFilter = 'All' | 'Fundamentals' | 'Circuits' | 'Algorithms'
type StatusFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed'

export function AssessmentsList() {
  const navigate = useNavigate()
  const { progress, getLatestScore, getBestScore, getAttemptsCount } = useProgress()
  const { activeAttempt } = useAssessment()

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [historyDialogAssessment, setHistoryDialogAssessment] = useState<string | null>(null)

  // Computed Progress Summary
  const totalAssessments = ASSESSMENTS.length
  const completedCount = ASSESSMENTS.filter(a => progress.completedAssessments.includes(a.id)).length
  const allScores = ASSESSMENTS.map(a => getBestScore(a.id)).filter((s): s is number => s !== undefined)
  const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
  const globalBestScore = allScores.length > 0 ? Math.max(...allScores) : 0
  const totalAttempts = progress.assessmentAttempts?.filter(a => a.endTime).length || 0
  const overallProgress = Math.round((completedCount / (totalAssessments || 1)) * 100)

  const getStatus = (assessmentId: string) => {
    if (progress.completedAssessments.includes(assessmentId)) return 'Completed'
    if (activeAttempt?.assessmentId === assessmentId && !activeAttempt.endTime) return 'In Progress'
    
    // Check if there's an unfinished attempt saved in progress
    const savedUnfinished = progress.assessmentAttempts?.find(a => a.assessmentId === assessmentId && !a.endTime)
    if (savedUnfinished) return 'In Progress'

    return 'Not Started'
  }

  const filteredAssessments = ASSESSMENTS.filter(a => {
    const status = getStatus(a.id)
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false
    if (statusFilter !== 'All' && status !== statusFilter) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-headline-lg font-bold">Assessment Center</h1>
        <p className="text-muted-foreground mt-2">Test your quantum computing knowledge and track your progress.</p>
      </div>

      {/* Progress Summary Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-headline-sm mb-4">Assessment Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold">{completedCount} / {totalAssessments}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{globalBestScore}%</div>
            <div className="text-xs text-primary/80 uppercase tracking-wider">Best Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalAttempts}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Attempts</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <div className="text-right text-xs mt-1 text-muted-foreground">{overallProgress}%</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
          {['All', 'Fundamentals', 'Circuits', 'Algorithms'].map(f => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f as CategoryFilter)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${categoryFilter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
          {['All', 'Not Started', 'In Progress', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f as StatusFilter)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${statusFilter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map(assessment => {
          const status = getStatus(assessment.id)
          const bestScore = getBestScore(assessment.id)
          const latestScore = getLatestScore(assessment.id)
          const attempts = getAttemptsCount(assessment.id)

          const isCompleted = status === 'Completed'
          
          return (
            <div key={assessment.id} className={`bg-card border rounded-xl flex flex-col transition-all ${isCompleted ? 'border-primary/50 shadow-sm shadow-primary/5' : 'border-border hover:border-primary/50'}`}>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30" : ""}>
                    {assessment.difficulty}
                  </Badge>
                  {isCompleted && <span className="text-xs font-bold text-primary flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> COMPLETED</span>}
                  {status === 'In Progress' && <span className="text-xs font-bold text-amber-500">◐ IN PROGRESS</span>}
                  {status === 'Not Started' && <span className="text-xs text-muted-foreground">○ NOT STARTED</span>}
                </div>
                
                <h2 className="text-lg font-bold mb-2 leading-tight">{assessment.title}</h2>
                <p className="text-muted-foreground text-sm flex-1 mb-4">{assessment.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center"><HelpCircle className="w-3 h-3 mr-1" /> {assessment.questions.length} Qs</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {assessment.timeEstimate}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {assessment.topics.map(t => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-muted rounded text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-muted/20 border-t border-border/50">
                {isCompleted ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="font-bold text-primary">{bestScore}%</div>
                        <div className="text-xs text-muted-foreground">Best Score</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{latestScore}%</div>
                        <div className="text-xs text-muted-foreground">Latest</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold cursor-pointer hover:text-primary transition-colors flex items-center justify-end" onClick={() => setHistoryDialogAssessment(assessment.id)}>
                          {attempts} <History className="w-3 h-3 ml-1" />
                        </div>
                        <div className="text-xs text-muted-foreground">Attempts</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-xs h-8" onClick={() => navigate(`/assessment/${assessment.id}`, { state: { reviewMode: true } })}>
                        Review Results
                      </Button>
                      <Button variant="secondary" className="flex-1 text-xs h-8" onClick={() => navigate(`/assessment/${assessment.id}`, { state: { reattempt: true } })}>
                        ↻ Re-attempt
                      </Button>
                    </div>
                  </div>
                ) : status === 'In Progress' ? (
                  <Button className="w-full" onClick={() => navigate(`/assessment/${assessment.id}`)}>
                    Continue Assessment
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => navigate(`/assessment/${assessment.id}`)}>
                    <Play className="w-4 h-4 mr-2" /> Start Assessment
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* History Dialog */}
      {historyDialogAssessment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Attempt History</h3>
              <button onClick={() => setHistoryDialogAssessment(null)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {progress.assessmentAttempts?.filter(a => a.assessmentId === historyDialogAssessment && a.endTime).map((attempt, idx) => (
                <div key={attempt.id} className="flex justify-between items-center p-3 bg-muted/30 rounded border border-border/50">
                  <div>
                    <div className="font-bold text-sm">Attempt {idx + 1}</div>
                    <div className="text-xs text-muted-foreground">{new Date(attempt.endTime!).toLocaleString()}</div>
                  </div>
                  <div className={`font-bold ${attempt.score === getBestScore(historyDialogAssessment) ? 'text-primary' : ''}`}>
                    {attempt.score}%
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border bg-muted/20">
              <Button className="w-full" variant="outline" onClick={() => setHistoryDialogAssessment(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
