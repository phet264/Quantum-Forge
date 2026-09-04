import { useInstructor } from '@/state/InstructorContext'
import { Users, Activity, Target, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InstructorDashboard() {
  const { cohortAnalytics, isLoading } = useInstructor()

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading analytics...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold">Instructor Dashboard</h1>

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

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Struggling Topics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohortAnalytics.strugglingTopics.map((topic, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">{topic.topic}</span>
              <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent hover:bg-destructive/30">
                {topic.averageScore}% Avg
              </Badge>
            </div>
          ))}
          {cohortAnalytics.strugglingTopics.length === 0 && (
             <p className="text-muted-foreground text-sm">No weak topics identified.</p>
          )}
        </div>
      </div>
    </div>
  )
}
