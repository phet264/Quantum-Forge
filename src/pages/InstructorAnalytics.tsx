import { useInstructor } from '@/state/InstructorContext'
import { Activity, AlertTriangle, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InstructorAnalytics() {
  const { cohortAnalytics, students, isLoading } = useInstructor()

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading analytics...</div>
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <h1 className="text-3xl font-headline-lg font-bold flex items-center gap-3">
        <Activity className="h-8 w-8 text-primary" />
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-muted-foreground">Average Class Score</span>
              <span className="font-bold text-lg">{cohortAnalytics.averageScore}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-muted-foreground">Average Module Progress</span>
              <span className="font-bold text-lg">{cohortAnalytics.averageProgress}%</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Weak Topics (Class Wide)
          </h2>
          <div className="space-y-3">
            {cohortAnalytics.strugglingTopics.map((topic, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">{topic.topic}</span>
                <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent">
                  {topic.averageScore}% Avg
                </Badge>
              </div>
            ))}
            {cohortAnalytics.strugglingTopics.length === 0 && (
              <p className="text-muted-foreground text-sm">No significant weak topics identified.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Activity Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-muted-foreground">Active Students</span>
              <span className="font-bold text-lg text-primary">{cohortAnalytics.activeStudents}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg border-l-4 border-l-destructive">
              <span className="font-medium text-muted-foreground">Needs Attention (Score)</span>
              <span className="font-bold text-lg text-destructive">{cohortAnalytics.needsAttentionCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg border-l-4 border-l-secondary">
              <span className="font-medium text-muted-foreground">Inactive (more than 7 days)</span>
              <span className="font-bold text-lg">{students.filter(s => s.activeStatus === 'Inactive').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Recent Cohort Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cohortAnalytics.recentActivity.length > 0 ? (
              cohortAnalytics.recentActivity.map(event => (
                <div key={event.id} className="p-3 bg-muted/30 rounded-lg border border-border text-sm flex justify-between items-start">
                  <div>
                    <strong className="text-foreground">{event.userName}</strong>
                    <span className="text-muted-foreground ml-2">{event.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
