import { useInstructor } from '@/state/InstructorContext'
import { Target, CheckCircle2, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { Badge } from '@/components/ui/badge'

export function InstructorAssessments() {
  const { students, cohortAnalytics, isLoading } = useInstructor()

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading assessments...</div>
  }

  const totalAssessmentsCompleted = students.reduce((sum, s) => sum + s.completedAssessments, 0)
  const averageAssessmentScore = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
    : 0

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-3">
        <Target className="h-8 w-8 text-primary" />
        Assessments Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Total Completions</h3>
          </div>
          <p className="text-3xl font-bold">{totalAssessmentsCompleted}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Average Score</h3>
          </div>
          <p className="text-3xl font-bold">{averageAssessmentScore}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Available Assessments</h3>
          </div>
          <p className="text-3xl font-bold">{ASSESSMENTS.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Weakest Topics
          </h2>
          <div className="space-y-3">
            {cohortAnalytics.strugglingTopics.length > 0 ? (
              cohortAnalytics.strugglingTopics.map((topic, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{topic.topic}</span>
                  <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent">
                    {topic.averageScore}% Avg
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No weak topics tracked yet.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Assessment Catalog
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {ASSESSMENTS.map(assessment => (
              <div key={assessment.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                <div>
                  <span className="font-medium block">{assessment.title}</span>
                  <span className="text-xs text-muted-foreground">Module {assessment.moduleId} • {assessment.questions.length} questions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
