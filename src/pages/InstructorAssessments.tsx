import { useState, useMemo } from 'react'
import { useInstructor } from '@/state/InstructorContext'
import { Target, CheckCircle2, TrendingUp, BookOpen, AlertTriangle, Users, ChevronRight, X } from 'lucide-react'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function InstructorAssessments() {
  const { students, cohortAnalytics, isLoading } = useInstructor()
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null)



  // Derive metrics across all assessments from the student records
  const totalAssessmentsCompleted = students.reduce((sum, s) => sum + s.completedAssessments, 0)
  const averageAssessmentScore = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
    : 0

  const selectedAssessmentDef = useMemo(() => ASSESSMENTS.find(a => a.id === selectedAssessmentId), [selectedAssessmentId])

  const selectedAssessmentStats = useMemo(() => {
    if (!selectedAssessmentId) return null
    const studentResults: any[] = []
    let totalScore = 0
    let attemptCount = 0

    students.forEach(student => {
      const attempts = student.progressState?.assessmentAttempts?.filter((a: any) => a.assessmentId === selectedAssessmentId) || []
      if (attempts.length > 0) {
        // use latest or best
        const bestAttempt = [...attempts].sort((a, b) => b.score - a.score)[0]
        studentResults.push({
          studentName: student.name,
          score: bestAttempt.score,
          passed: bestAttempt.passed,
          attemptsCount: attempts.length,
          lastAttemptDate: bestAttempt.startTime
        })
        totalScore += bestAttempt.score
        attemptCount++
      }
    })

    return {
      averageScore: attemptCount > 0 ? Math.round(totalScore / attemptCount) : 0,
      totalCompletions: attemptCount,
      completionRate: students.length > 0 ? Math.round((attemptCount / students.length) * 100) : 0,
      studentResults: studentResults.sort((a, b) => b.score - a.score)
    }
  }, [selectedAssessmentId, students])

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading assessments...</div>
  }

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
          <p className="text-3xl font-bold">{ASSESSMENTS.filter(a => !a.questions.some(q => q.type === 'circuit_challenge')).length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assessment Catalog */}
        <div className={`bg-card border border-border rounded-xl p-6 space-y-4 ${selectedAssessmentId ? 'lg:col-span-4' : 'lg:col-span-6'}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Assessment Catalog
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {ASSESSMENTS.filter(a => !a.questions.some(q => q.type === 'circuit_challenge')).map(assessment => (
              <div 
                key={assessment.id} 
                className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedAssessmentId === assessment.id ? 'bg-primary/10 border-primary' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                onClick={() => setSelectedAssessmentId(assessment.id)}
              >
                <div>
                  <span className="font-medium block">{assessment.title}</span>
                  <span className="text-xs text-muted-foreground">Module {assessment.moduleId} • {assessment.questions.length} questions</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assessment Detail or Weak Topics */}
        <div className={`space-y-6 ${selectedAssessmentId ? 'lg:col-span-8' : 'lg:col-span-6'}`}>
          
          {selectedAssessmentId && selectedAssessmentDef && selectedAssessmentStats ? (
            <div className="bg-card border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.05)] rounded-xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedAssessmentId(null)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-headline-lg font-bold text-primary mb-2">
                  {selectedAssessmentDef.title}
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">{selectedAssessmentDef.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Average Score</span>
                  <span className="text-2xl font-bold font-code-sm">{selectedAssessmentStats.averageScore}%</span>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Completions</span>
                  <span className="text-2xl font-bold">{selectedAssessmentStats.totalCompletions}</span>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Completion Rate</span>
                  <span className="text-2xl font-bold">{selectedAssessmentStats.completionRate}%</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Student Performance
                </h3>
                {selectedAssessmentStats.studentResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-xs font-label-caps text-muted-foreground">
                          <th className="pb-2">Student</th>
                          <th className="pb-2">Best Score</th>
                          <th className="pb-2">Attempts</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAssessmentStats.studentResults.map((result: any, i: number) => (
                          <tr key={i} className="border-b border-border/30 last:border-0">
                            <td className="py-3 text-sm font-medium">{result.studentName}</td>
                            <td className="py-3">
                              <span className={`font-bold font-code-sm ${result.passed ? 'text-primary' : 'text-destructive'}`}>
                                {result.score}%
                              </span>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">{result.attemptsCount}</td>
                            <td className="py-3 text-sm text-muted-foreground">{new Date(result.lastAttemptDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border/50 text-center">
                    No students have attempted this assessment yet.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 h-full">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Global Weakest Topics
              </h2>
              <div className="space-y-3">
                {cohortAnalytics.strugglingTopics.length > 0 ? (
                  cohortAnalytics.strugglingTopics.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors">
                      <span className="font-medium">{topic.topic}</span>
                      <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent text-xs py-0 h-5">
                        {topic.averageScore}% Avg
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No weak topics tracked yet.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
