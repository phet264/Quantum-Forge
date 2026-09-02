import { useUser } from '@/state/UserContext'
import { useProgress } from '@/state/ProgressContext'

export function WelcomeOverview() {
  const { user } = useUser()
  const { getOverallProgress } = useProgress()
  const progress = getOverallProgress()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
      <div>
        <h2 className="font-display-lg-mobile md:font-display-lg m-0 tracking-tight text-foreground">
          Welcome, <span className="text-primary font-light">{user?.name || 'Researcher'}</span>
        </h2>
        <p className="font-code-sm text-muted-foreground mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Learning Profile Active
        </p>
      </div>
      
      <div className="bg-card border border-border px-4 py-3 rounded-md flex flex-col items-end min-w-[200px]">
        <span className="font-label-caps text-muted-foreground uppercase tracking-wider">Overall Progress</span>
        <div className="flex items-baseline gap-1">
          <span className="font-display-lg-mobile text-primary">{progress}</span>
          <span className="font-body-md text-primary">%</span>
        </div>
      </div>
    </div>
  )
}
