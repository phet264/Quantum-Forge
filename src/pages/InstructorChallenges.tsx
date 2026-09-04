import { useState, useMemo } from 'react'
import { useInstructor } from '@/state/InstructorContext'
import { Network, Trophy, CheckCircle, Users, ChevronRight, X, AlertTriangle } from 'lucide-react'
import { ASSESSMENTS } from '@/data/assessmentContent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function InstructorChallenges() {
  const { students, isLoading } = useInstructor()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)



  // Parse authoritative ASSESSMENTS for circuit_challenge
  const allChallenges = useMemo(() => {
    return ASSESSMENTS.flatMap(a => 
      a.questions.filter(q => q.type === 'circuit_challenge').map(q => ({
        ...q,
        assessmentId: a.id,
        assessmentTitle: a.title
      }))
    )
  }, [])

  const totalChallenges = allChallenges.length

  const getChallengeStats = (challengeId: string, assessmentId: string) => {
    const studentResults: any[] = []
    let totalScore = 0
    let attemptCount = 0

    students.forEach(student => {
      // Find assessment attempt that contains this challenge question attempt
      const assessmentAttempts = student.progressState?.assessmentAttempts?.filter((a: any) => a.assessmentId === assessmentId) || []
      
      let bestQAttempt: any = null
      let totalQAttempts = 0

      assessmentAttempts.forEach((aAttempt: any) => {
        const qAttempts = aAttempt.questionAttempts?.filter((qa: any) => qa.questionId === challengeId) || []
        totalQAttempts += qAttempts.length
        
        qAttempts.forEach((qa: any) => {
          if (!bestQAttempt || qa.pointsEarned > bestQAttempt.pointsEarned) {
            bestQAttempt = { ...qa, date: aAttempt.startTime }
          }
        })
      })

      if (bestQAttempt) {
        studentResults.push({
          studentName: student.name,
          score: bestQAttempt.pointsEarned,
          passed: bestQAttempt.isCorrect,
          attemptsCount: totalQAttempts,
          lastAttemptDate: bestQAttempt.date
        })
        totalScore += bestQAttempt.pointsEarned > 0 ? 100 : 0 // simplify challenge score
        attemptCount++
      }
    })

    return {
      averageScore: attemptCount > 0 ? Math.round(totalScore / attemptCount) : 0,
      totalAttempts: attemptCount,
      completionRate: students.length > 0 ? Math.round((attemptCount / students.length) * 100) : 0,
      studentResults: studentResults.sort((a, b) => b.score - a.score)
    }
  }

  const selectedChallengeDef = allChallenges.find(c => c.id === selectedChallengeId)
  const selectedChallengeStats = selectedChallengeDef ? getChallengeStats(selectedChallengeDef.id, selectedChallengeDef.assessmentId) : null
  
  // Calculate top performer over all challenges
  let topPerformer: any = null
  let maxScore = -1
  students.forEach(student => {
    const score = student.averageScore // proxy for top overall
    if (score > maxScore) {
      maxScore = score
      topPerformer = student
    }
  })

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading challenges...</div>
  }

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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Challenge Database */}
        <div className={`bg-card border border-border rounded-xl p-6 space-y-4 ${selectedChallengeId ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Challenge Database
          </h2>
          {totalChallenges === 0 ? (
            <p className="text-muted-foreground">No circuit challenges found in canonical ASSESSMENTS.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {allChallenges.map((challenge) => (
                <div 
                  key={challenge.id} 
                  className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${selectedChallengeId === challenge.id ? 'bg-primary/10 border-primary' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                  onClick={() => setSelectedChallengeId(challenge.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="max-w-[75%]">
                      <span className="font-medium block">{challenge.title}</span>
                      <span className="text-xs text-muted-foreground truncate block">{challenge.description}</span>
                    </div>
                    <Badge variant="outline" className="bg-background">
                      {challenge.points} pts
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-label-caps text-muted-foreground uppercase">{challenge.assessmentTitle}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Challenge Detail */}
        {selectedChallengeId && selectedChallengeDef && selectedChallengeStats && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.05)] rounded-xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedChallengeId(null)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <div>
                <Badge className="mb-2">{selectedChallengeDef.assessmentTitle}</Badge>
                <h2 className="text-2xl font-headline-lg font-bold text-primary mb-2">
                  {selectedChallengeDef.title}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedChallengeDef.description}</p>
                <div className="mt-4 p-3 bg-muted/50 rounded text-sm font-code-sm">
                  Required State: {JSON.stringify(selectedChallengeDef.criteria?.targetStateVector || selectedChallengeDef.criteria?.targetProbabilities || {})}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Pass Rate</span>
                  <span className="text-2xl font-bold font-code-sm">{selectedChallengeStats.averageScore}%</span>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Total Attempts</span>
                  <span className="text-2xl font-bold">{selectedChallengeStats.totalAttempts}</span>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground block mb-1">Completion Rate</span>
                  <span className="text-2xl font-bold">{selectedChallengeStats.completionRate}%</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Student Results
                </h3>
                {selectedChallengeStats.studentResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border text-xs font-label-caps text-muted-foreground">
                          <th className="pb-2">Student</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Points</th>
                          <th className="pb-2">Attempts</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedChallengeStats.studentResults.map((result: any, i: number) => (
                          <tr key={i} className="border-b border-border/30 last:border-0">
                            <td className="py-3 text-sm font-medium">{result.studentName}</td>
                            <td className="py-3">
                              {result.passed ? (
                                <Badge variant="default" className="bg-primary/20 text-primary border-transparent">Passed</Badge>
                              ) : (
                                <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent">Failed</Badge>
                              )}
                            </td>
                            <td className="py-3 text-sm font-code-sm">{result.score} pts</td>
                            <td className="py-3 text-sm text-muted-foreground">{result.attemptsCount}</td>
                            <td className="py-3 text-sm text-muted-foreground">{new Date(result.lastAttemptDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border/50 text-center flex flex-col items-center">
                    <AlertTriangle className="h-6 w-6 text-muted-foreground mb-2" />
                    No students have attempted this challenge yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
