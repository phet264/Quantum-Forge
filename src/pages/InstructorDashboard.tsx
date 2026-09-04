import { useInstructor } from '@/state/InstructorContext'
import { Target, Users, AlertTriangle, ChevronRight, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function InstructorDashboard() {
  const { cohortAnalytics, students, isLoading } = useInstructor()
  const navigate = useNavigate()

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading analytics...</div>
  }

  const needsAttentionStudents = students.filter(s => s.activeStatus === 'Needs Help')
  const onTrackCount = students.filter(s => s.activeStatus === 'On Track').length
  const atRiskCount = students.filter(s => s.activeStatus === 'At Risk').length

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline-lg font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm font-label-caps">
            <Badge variant="outline" className="mr-2">Demo Cohort</Badge> 
            Displaying sample learner data combined with your local progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Total Students</h3>
          </div>
          <p className="text-3xl font-bold">{cohortAnalytics.totalStudents}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Activity className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Active Students</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{cohortAnalytics.activeStudents}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-label-caps uppercase text-xs">Needs Attention</h3>
          </div>
          <p className="text-3xl font-bold text-destructive">{cohortAnalytics.needsAttentionCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Target className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Avg Progress</h3>
          </div>
          <p className="text-3xl font-bold">{cohortAnalytics.averageProgress}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Target className="h-5 w-5" />
            <h3 className="font-label-caps uppercase text-xs">Avg Score</h3>
          </div>
          <p className="text-3xl font-bold">{cohortAnalytics.averageScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Needs Attention (High Priority) & Class Health */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Students Needing Attention
            </h2>
            
            {needsAttentionStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">All active students are currently on track.</p>
            ) : (
              <div className="space-y-4">
                {needsAttentionStudents.map(student => (
                  <div key={student.userId} className="bg-card border border-destructive/20 p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {student.name}
                        <Badge variant="destructive" className="text-xs py-0 h-5">Action Required</Badge>
                      </h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Progress: <strong className="text-foreground">{student.overallProgress}%</strong></span>
                        <span>Avg Score: <strong className="text-foreground">{student.averageScore}%</strong></span>
                        <span>Last Active: {new Date(student.lastActive).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-xs font-label-caps text-muted-foreground uppercase">Reasons for attention:</span>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                          {student.needsAttentionReasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {student.strugglingTopics.length > 0 && (
                        <div className="mt-3">
                           <span className="text-xs font-label-caps text-muted-foreground uppercase block mb-1">Primary Evidence:</span>
                           <span className="text-sm bg-muted px-2 py-1 rounded">
                             {student.strugglingTopics[0].topic} average: {student.strugglingTopics[0].averageScore}% 
                             ({student.strugglingTopics[0].failedAttempts} failed attempts)
                           </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 justify-end">
                      <Button variant="outline" className="border-destructive/30 hover:bg-destructive/10 text-destructive" onClick={() => navigate('/instructor/students')}>
                        View Performance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Student Performance Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Student</th>
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Progress</th>
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Avg Score</th>
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Weak Topic</th>
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Last Active</th>
                    <th className="pb-3 font-label-caps text-muted-foreground text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map(student => (
                    <tr key={student.userId} className="border-b border-border/50">
                      <td className="py-3 font-medium text-sm">{student.name}</td>
                      <td className="py-3 text-sm">{student.overallProgress}%</td>
                      <td className="py-3 font-code-sm">{student.averageScore}%</td>
                      <td className="py-3 text-sm text-muted-foreground truncate max-w-[120px]">
                        {student.strugglingTopics[0] ? student.strugglingTopics[0].topic : '—'}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {Math.floor((Date.now() - new Date(student.lastActive).getTime()) / (1000 * 60 * 60 * 24))}d ago
                      </td>
                      <td className="py-3 text-sm">
                        <Badge variant={
                          student.activeStatus === 'On Track' ? 'default' : 
                          student.activeStatus === 'Needs Help' ? 'destructive' : 
                          student.activeStatus === 'At Risk' ? 'secondary' : 'outline'
                        }>
                          {student.activeStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" size="sm" onClick={() => navigate('/instructor/students')}>View All Students <ChevronRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </div>

        </div>

        {/* Right Column: Class Health & Topics */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Class Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">On Track</span>
                </div>
                <span className="font-bold">{onTrackCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">At Risk</span>
                </div>
                <span className="font-bold">{atRiskCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Needs Help</span>
                </div>
                <span className="font-bold">{cohortAnalytics.needsAttentionCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Struggling Topics
            </h2>
            <div className="space-y-3">
              {cohortAnalytics.strugglingTopics.slice(0, 4).map((topic, i) => (
                <div key={i} className="flex flex-col p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{topic.topic}</span>
                    <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent text-xs py-0 h-5">
                      {topic.averageScore}% Avg
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{topic.averageScore < 50 ? '↓ declining' : 'stable'}</span>
                </div>
              ))}
              {cohortAnalytics.strugglingTopics.length === 0 && (
                <p className="text-muted-foreground text-sm">No weak topics identified.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
