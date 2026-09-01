import { SystemStateCard } from '@/components/dashboard/SystemStateCard'
import { ActiveTasks } from '@/components/dashboard/ActiveTasks'
import { ResearcherProfile } from '@/components/dashboard/ResearcherProfile'
import { ExperimentLog } from '@/components/dashboard/ExperimentLog'

export function Dashboard() {
  return (
    <div className="max-w-container-max mx-auto space-y-stack-md pb-stack-xl">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg m-0 tracking-tight text-foreground">
            Lab-OS // <span className="text-primary font-light">Quantum Dashboard</span>
          </h2>
          <p className="font-code-sm text-muted-foreground mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            System Ready | Runtime: 14d 02h 45m
          </p>
        </div>
        
        <div className="bg-card border border-border px-4 py-3 rounded-md flex flex-col items-end min-w-[200px]">
          <span className="font-label-caps text-muted-foreground uppercase tracking-wider">Qubit Fidelity</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display-lg-mobile text-primary">99.8</span>
            <span className="font-body-md text-primary">%</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (8 cols): Visualizations & Cards */}
        <div className="lg:col-span-8 space-y-stack-md">
          <SystemStateCard />
          <ActiveTasks />
        </div>

        {/* Right Column (4 cols): Logs & Rank */}
        <div className="lg:col-span-4 space-y-stack-md flex flex-col h-full">
          <ResearcherProfile />
          <ExperimentLog />
        </div>
      </div>
    </div>
  )
}
