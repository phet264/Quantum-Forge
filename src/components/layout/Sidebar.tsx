import { NavLink } from 'react-router-dom'
import {
  Microscope,
  LayoutDashboard,
  FlaskConical,
  Network,
  BookOpen,
  Settings,
  HelpCircle,
  Plus,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Shared active class logic
const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
  `flex items-center gap-3 py-2.5 font-body-md transition-colors duration-200 rounded-r border-l-2 pl-4 ` + 
  (isActive 
    ? 'text-primary font-bold border-primary bg-primary/10' 
    : 'text-muted-foreground font-medium border-transparent hover:text-primary hover:bg-accent')

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const containerClasses = mobile 
    ? "flex flex-col h-full py-stack-md w-full"
    : "hidden md:flex bg-background border-r border-border flex-col h-full py-stack-md z-50 w-64 fixed left-0 top-0"

  return (
    <nav className={containerClasses}>
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
      
      <div className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <NavLink to="/" end className={navLinkClasses}>
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/simulator" className={navLinkClasses}>
          <FlaskConical className="h-5 w-5" />
          Simulator
        </NavLink>
        <NavLink to="/circuit-builder" className={navLinkClasses}>
          <Network className="h-5 w-5" />
          Circuit Builder
        </NavLink>
        <NavLink to="/tutor" className={navLinkClasses}>
          <Bot className="h-5 w-5" />
          AI Tutor
        </NavLink>
        <NavLink to="/research" className={navLinkClasses}>
          <BookOpen className="h-5 w-5" />
          Research
        </NavLink>
      </div>
      
      <div className="px-4 mt-auto space-y-1.5 border-t border-border pt-4 mx-4">
        <NavLink to="/settings" className={navLinkClasses}>
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
        <a href="https://docs.quantumforge.io" target="_blank" rel="noreferrer" className="flex items-center gap-3 py-2.5 font-body-md transition-colors duration-200 text-muted-foreground font-medium pl-4 hover:text-primary hover:bg-accent rounded-r border-l-2 border-transparent">
          <HelpCircle className="h-5 w-5" />
          Support
        </a>
      </div>
    </nav>
  )
}
