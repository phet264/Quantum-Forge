import { WelcomeOverview } from '@/components/dashboard/WelcomeOverview'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { LearningStats } from '@/components/dashboard/LearningStats'
import { RecentActivityTimeline } from '@/components/dashboard/RecentActivityTimeline'

export function Dashboard() {
  return (
    <div className="max-w-container-max mx-auto space-y-stack-md pb-stack-xl">
      {/* Hero Header */}
      <WelcomeOverview />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column (8 cols): Progress & Continuing */}
        <div className="lg:col-span-8 space-y-stack-md flex flex-col">
          <ContinueLearningCard />
          <LearningStats />
        </div>

        {/* Right Column (4 cols): Activity */}
        <div className="lg:col-span-4 space-y-stack-md flex flex-col h-full">
          <RecentActivityTimeline />
        </div>
      </div>
    </div>
  )
}
