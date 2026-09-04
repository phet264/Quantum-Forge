import { useState } from 'react'
import { useInstructor } from '@/state/InstructorContext'
import { ChevronRight, AlertTriangle, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { StudentAnalytics } from '@/types/assessment'

export function InstructorStudents() {
  const { students, isLoading } = useInstructor()
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalytics | null>(null)

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading students...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        Students
      </h1>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Student Roster</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 font-label-caps text-muted-foreground">Name</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Status</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Progress</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Score</th>
                <th className="pb-3 font-label-caps text-muted-foreground">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
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
                    <Badge variant={student.activeStatus === 'Active' ? 'default' : student.activeStatus === 'Needs attention' ? 'destructive' : 'secondary'}>
                      {student.activeStatus}
                    </Badge>
                  </td>
                  <td className="py-4">{student.overallProgress}%</td>
                  <td className="py-4 font-code-sm">{student.averageScore}%</td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {new Date(student.lastActive).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <Sheet open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <SheetContent className="sm:max-w-md w-full overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-headline-lg">{selectedStudent.name}</SheetTitle>
              <SheetDescription>Student Performance Detail</SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps uppercase text-sm text-muted-foreground">Status</span>
                  <Badge variant={selectedStudent.activeStatus === 'Active' ? 'default' : selectedStudent.activeStatus === 'Needs attention' ? 'destructive' : 'secondary'}>
                    {selectedStudent.activeStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-caps uppercase text-sm text-muted-foreground">Overall Progress</span>
                  <span className="font-bold">{selectedStudent.overallProgress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-caps uppercase text-sm text-muted-foreground">Average Score</span>
                  <span className="font-bold font-code-sm">{selectedStudent.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-caps uppercase text-sm text-muted-foreground">Assessments Completed</span>
                  <span className="font-bold">{selectedStudent.completedAssessments}</span>
                </div>
              </div>

              {selectedStudent.strugglingTopics.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Needs Improvement
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.strugglingTopics.map((topic, i) => (
                      <Badge key={i} variant="destructive" className="bg-destructive/20 text-destructive border-transparent">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold mb-3">Recent Activity</h3>
                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  Last active: {new Date(selectedStudent.lastActive).toLocaleDateString()}
                  <br />
                  <span className="text-xs opacity-75">Detailed activity log is tracked in student progress.</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
