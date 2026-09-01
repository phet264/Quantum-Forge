import { Link } from 'react-router-dom'
import {
  Microscope,
  LayoutDashboard,
  FlaskConical,
  Network,
  BookOpen,
  Settings,
  HelpCircle,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  return (
    <nav className="hidden md:flex bg-background border-r border-border flex-col h-full py-stack-md z-50 w-64 fixed left-0 top-0">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-card flex items-center justify-center border border-border">
            <Microscope className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-none">QuantumForge</h1>
            <p className="font-code-sm text-code-sm text-muted-foreground mt-1">Lab-OS v2.4.0</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 mb-8">
        <Button className="w-full font-label-caps uppercase py-3 flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          New Experiment
        </Button>
      </div>
      
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <Link to="/" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-primary font-bold border-l-2 border-primary pl-4 bg-[linear-gradient(90deg,hsl(var(--primary)/0.1)_0%,transparent_100%)]">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link to="/simulator" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-muted-foreground font-medium pl-4 hover:text-primary hover:bg-accent transition-colors rounded-r">
          <FlaskConical className="h-5 w-5" />
          Simulator
        </Link>
        <Link to="/circuit" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-muted-foreground font-medium pl-4 hover:text-primary hover:bg-accent transition-colors rounded-r">
          <Network className="h-5 w-5" />
          Circuit Builder
        </Link>
        <Link to="/research" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-muted-foreground font-medium pl-4 hover:text-primary hover:bg-accent transition-colors rounded-r">
          <BookOpen className="h-5 w-5" />
          Research
        </Link>
      </div>
      
      <div className="px-4 mt-auto space-y-2 border-t border-border pt-4 mx-4">
        <Link to="/settings" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-muted-foreground font-medium pl-2 hover:text-primary hover:bg-accent transition-colors rounded">
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <Link to="/support" className="flex items-center gap-3 py-3 font-body-md duration-200 ease-in-out text-muted-foreground font-medium pl-2 hover:text-primary hover:bg-accent transition-colors rounded">
          <HelpCircle className="h-5 w-5" />
          Support
        </Link>
      </div>
    </nav>
  )
}
