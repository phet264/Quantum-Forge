import { useState, useMemo } from 'react'
import { useInstructor } from '@/state/InstructorContext'
import { ChevronRight, AlertTriangle, Users, BookOpen, BrainCircuit, Activity, Clock, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import type { StudentAnalytics } from '@/types/assessment'
import { useNavigate } from 'react-router-dom'

export function InstructorStudents() {
  const { students, isLoading } = useInstructor()
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalytics | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const navigate = useNavigate()

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || s.activeStatus === statusFilter
      return matchSearch && matchStatus
    })
  }, [students, search, statusFilter])

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading students...</div>
  }

  const getStatusBadge = (status: string) => {
    if (status === 'On Track') return <Badge variant="default">{status}</Badge>
    if (status === 'Needs Help') return <Badge variant="destructive">{status}</Badge>
    if (status === 'At Risk') return <Badge variant="secondary">{status}</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        Students
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Input 
          placeholder="Search students..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {['All', 'On Track', 'At Risk', 'Needs Help', 'Inactive'].map(filter => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 font-label-caps text-muted-foreground">Name</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Status</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Progress</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Score</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Weak Topic</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr 
                  key={student.userId} 
                  className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="py-4 font-medium flex items-center pr-4 gap-2">
                    {student.name}
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                  </td>
                  <td className="py-4">
                    {getStatusBadge(student.activeStatus)}
                  </td>
                  <td className="py-4">{student.overallProgress}%</td>
                  <td className="py-4 font-code-sm">{student.averageScore}%</td>
                  <td className="py-4 text-muted-foreground text-sm truncate max-w-[150px]">
                    {student.strugglingTopics.length > 0 ? student.strugglingTopics[0].topic : '—'}
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {Math.floor((Date.now() - new Date(student.lastActive).getTime()) / (1000 * 60 * 60 * 24))}d ago
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">No students found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <Sheet open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-headline-lg flex items-center justify-between">
                {selectedStudent.name}
                {getStatusBadge(selectedStudent.activeStatus)}
              </SheetTitle>
              <SheetDescription>Student Performance Detail</SheetDescription>
            </SheetHeader>

            <div className="space-y-8 pb-10">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground uppercase block mb-1">Overall Progress</span>
                  <span className="text-2xl font-bold">{selectedStudent.overallProgress}%</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground uppercase block mb-1">Average Score</span>
                  <span className="text-2xl font-bold">{selectedStudent.averageScore}%</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground uppercase block mb-1">Completed Lessons</span>
                  <span className="text-2xl font-bold">{selectedStudent.progressState?.completedLessons?.length || 0}</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <span className="font-label-caps text-xs text-muted-foreground uppercase block mb-1">Assessments Done</span>
                  <span className="text-2xl font-bold">{selectedStudent.completedAssessments}</span>
                </div>
              </div>

              {/* Weak Topics */}
              {selectedStudent.strugglingTopics.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Weak Topics Identified
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.strugglingTopics.map((topic, i) => (
                      <div key={i} className="flex justify-between items-center bg-destructive/5 border border-destructive/20 p-3 rounded-lg">
                        <div>
                          <span className="font-medium block">{topic.topic}</span>
                          <span className="text-xs text-muted-foreground">{topic.failedAttempts} failed attempts</span>
                        </div>
                        <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent text-xs py-0 h-5">
                          {topic.averageScore}% Avg
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Intervention */}
              {selectedStudent.strugglingTopics.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
                    <BrainCircuit className="h-4 w-4" />
                    Recommended Intervention
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on {selectedStudent.name}'s performance, they are struggling primarily with <strong>{selectedStudent.strugglingTopics[0].topic}</strong>. 
                  </p>
                  <div className="flex flex-col gap-2">
                    {selectedStudent.strugglingTopics[0].topic.toLowerCase().includes('measurement') ? (
                      <Button variant="outline" className="justify-start border-primary/30 text-primary hover:bg-primary/10" onClick={() => navigate('/research/lesson/l-measurement-prob')}>
                        <BookOpen className="mr-2 w-4 h-4" /> Direct to Measurement Lesson
                      </Button>
                    ) : selectedStudent.strugglingTopics[0].topic.toLowerCase().includes('superposition') ? (
                      <Button variant="outline" className="justify-start border-primary/30 text-primary hover:bg-primary/10" onClick={() => navigate('/research/lesson/l-superposition-basics')}>
                        <BookOpen className="mr-2 w-4 h-4" /> Direct to Superposition Lesson
                      </Button>
                    ) : (
                      <Button variant="outline" className="justify-start border-primary/30 text-primary hover:bg-primary/10" onClick={() => navigate('/research')}>
                        <BookOpen className="mr-2 w-4 h-4" /> Direct to Relevant Curriculum
                      </Button>
                    )}
                    <Button variant="outline" className="justify-start" onClick={() => navigate('/circuit-builder')}>
                      <Activity className="mr-2 w-4 h-4" /> Prescribe Circuit Practice
                    </Button>
                  </div>
                </div>
              )}

              {/* Assessment History */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Assessment History
                </h3>
                {selectedStudent.progressState?.assessmentAttempts?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.progressState.assessmentAttempts.map((attempt: any) => (
                      <div key={attempt.attemptId} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border">
                        <div>
                          <span className="font-medium block">{attempt.assessmentId}</span>
                          <span className="text-xs text-muted-foreground">{new Date(attempt.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold block ${attempt.passed ? 'text-primary' : 'text-destructive'}`}>{attempt.score}%</span>
                          <span className="text-xs text-muted-foreground">{attempt.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No assessments taken yet.</p>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </h3>
                {selectedStudent.progressState?.recentActivity?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.progressState.recentActivity.slice(0, 5).map((act: any) => (
                      <div key={act.id} className="p-3 bg-muted/20 rounded-lg border border-border/50 text-sm flex justify-between items-center">
                        <span>
                          <strong className="block">{act.itemTitle}</strong>
                          <span className="text-xs text-muted-foreground">{act.type.replace('_', ' ')}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(act.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                )}
              </div>

            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
