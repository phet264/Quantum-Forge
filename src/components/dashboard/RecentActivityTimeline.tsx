import { useProgress } from '@/state/ProgressContext'
import { CheckCircle2, Award, Zap } from 'lucide-react'

export function RecentActivityTimeline() {
  const { progress } = useProgress()
  const activities = progress.recentActivity

  return (
    <div className="glass-card rounded-lg p-6 flex-1 flex flex-col min-h-[400px]">
      <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase tracking-wider mb-6">Recent Activity</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 relative">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 opacity-50" />
            </div>
            <p>No recent activity.</p>
            <p>Start a lesson to see your progress here.</p>
          </div>
        ) : (
          <div className="space-y-0 relative">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-border z-0"></div>
            
            {activities.map(activity => (
              <div key={activity.id} className="relative z-10 flex gap-4 pb-6 last:pb-0">
                <div className="w-6 h-6 rounded-full bg-background border border-primary flex items-center justify-center mt-0.5 shrink-0 z-10">
                  {activity.type === 'lesson_completed' && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                  {activity.type === 'module_completed' && <Award className="h-3.5 w-3.5 text-yellow-500" />}
                  {activity.type === 'algorithm_completed' && <Zap className="h-3.5 w-3.5 text-primary" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-code-sm text-[12px] text-foreground">
                      {activity.type === 'lesson_completed' ? 'Lesson Completed' : 
                       activity.type === 'module_completed' ? 'Module Mastered' : 'Algorithm Studied'}
                    </span>
                    <span className="font-code-sm text-[10px] text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-body-md text-sm text-muted-foreground">{activity.itemTitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
