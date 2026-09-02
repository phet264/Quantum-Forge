import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

import { SimulationProvider } from '@/state/SimulationContext'

export function DashboardLayout() {
  return (
    <div className="bg-background text-foreground font-body-md h-screen overflow-hidden flex selection:bg-primary/30 selection:text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 h-screen relative">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none z-0"></div>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop relative z-10">
          <SimulationProvider>
            <Outlet />
          </SimulationProvider>
        </main>
      </div>
    </div>
  )
}
