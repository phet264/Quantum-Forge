import { useInstructor } from '@/state/InstructorContext'
import { Activity, AlertTriangle, Target, TrendingUp, BarChart2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InstructorAnalytics() {
  const { cohortAnalytics, students, isLoading } = useInstructor()

  if (isLoading || !cohortAnalytics) {
    return <div className="p-8 text-muted-foreground">Loading analytics...</div>
  }

  // Calculate simple trend bars for recent activity if available
  const hasHistoricalData = cohortAnalytics.recentActivity.length > 5

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
            
            {/* CSS Trend Chart */}
            <div className="pt-4 mt-4 border-t border-border/50">
               <h3 className="text-sm font-label-caps text-muted-foreground mb-4 flex items-center gap-2">
                 <BarChart2 className="h-4 w-4" /> Score Distribution
               </h3>
               {students.length > 0 ? (
                 <div className="flex items-end gap-2 h-32 px-2">
                   {/* Generate bins */}
                   {[
                     { label: '<60', count: students.filter(s => s.averageScore < 60).length },
                     { label: '60-75', count: students.filter(s => s.averageScore >= 60 && s.averageScore < 75).length },
                     { label: '75-90', count: students.filter(s => s.averageScore >= 75 && s.averageScore < 90).length },
                     { label: '90+', count: students.filter(s => s.averageScore >= 90).length }
                   ].map(bin => (
                     <div key={bin.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                       <span className="text-xs font-bold">{bin.count > 0 ? bin.count : ''}</span>
                       <div 
                         className="w-full bg-primary/60 rounded-t transition-all" 
                         style={{ height: `${Math.max((bin.count / students.length) * 100, 5)}%` }}
                       />
                       <span className="text-xs text-muted-foreground">{bin.label}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground">Not enough data to render chart.</p>
               )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Class-Wide Weak Topics
          </h2>
          <div className="space-y-3">
            {cohortAnalytics.strugglingTopics.map((topic, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{topic.topic}</span>
                  <Badge variant="destructive" className="bg-destructive/20 text-destructive border-transparent text-xs py-0 h-5">
                    {topic.averageScore}% Avg
                  </Badge>
                </div>
                {/* Horizontal CSS Bar */}
                <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-destructive h-full rounded-full" style={{ width: `${topic.averageScore}%` }} />
                </div>
              </div>
            ))}
            {cohortAnalytics.strugglingTopics.length === 0 && (
              <p className="text-muted-foreground text-sm">No significant weak topics identified.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium text-muted-foreground">Active Students</span>
              <span className="font-bold text-lg text-primary">{cohortAnalytics.activeStudents}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg border-l-4 border-l-destructive">
              <span className="font-medium text-muted-foreground">Needs Attention</span>
              <span className="font-bold text-lg text-destructive">{cohortAnalytics.needsAttentionCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg border-l-4 border-l-secondary">
              <span className="font-medium text-muted-foreground">Inactive ({'>'} 7 days)</span>
              <span className="font-bold text-lg">{students.filter(s => s.activeStatus === 'Inactive').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Cohort Activity
          </h2>
          {hasHistoricalData ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cohortAnalytics.recentActivity.map(event => (
                <div key={event.id} className="p-3 bg-muted/30 rounded-lg border border-border text-sm flex justify-between items-start">
                  <div>
                    <strong className="text-foreground">{event.userName}</strong>
                    <span className="text-muted-foreground ml-2 capitalize">{event.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 border border-dashed border-border/50 rounded-lg bg-muted/10">
              <TrendingUp className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">Not enough historical data yet.</p>
              <p className="text-xs text-muted-foreground mt-1 text-center max-w-[250px]">
                As students complete lessons and assessments, their activity will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
