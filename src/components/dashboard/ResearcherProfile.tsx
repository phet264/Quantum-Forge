import { Award, Bug, Activity } from 'lucide-react'

export function ResearcherProfile() {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-4 tracking-wider">Researcher Profile</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg border border-primary/50 bg-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.4)_50%,transparent_75%)] bg-[length:200%_200%] animate-shimmer"></div>
          <Award className="text-primary h-6 w-6 relative z-10" />
        </div>
        <div>
          <div className="font-body-lg font-semibold">Level 42</div>
          <div className="font-code-sm text-[12px] text-muted-foreground">Senior Analyst</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted/50 border border-border flex items-center justify-center">
              <Bug className="h-3 w-3 text-foreground" />
            </div>
            <span className="font-body-md text-sm">Errors Resolved</span>
          </div>
          <span className="font-code-sm">1,204</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted/50 border border-border flex items-center justify-center">
              <Activity className="h-3 w-3 text-foreground" />
            </div>
            <span className="font-body-md text-sm">Compute Hours</span>
          </div>
          <span className="font-code-sm">842h</span>
        </div>
      </div>
    </div>
  )
}
