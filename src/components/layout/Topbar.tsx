import { Menu, Search, Moon, Sun, Bell, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Sidebar } from '@/components/layout/Sidebar'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '@/state/UserContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setRole } = useUser()

  // Close sheet on navigation
  useEffect(() => {
    // eslint-disable-next-line
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b border-border backdrop-blur-md flex justify-between items-center h-16 px-margin-desktop w-full">
      <div className="flex items-center flex-1">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="text-muted-foreground mr-4 p-2 hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-r border-border bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Access application sections</SheetDescription>
              <Sidebar mobile />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="hidden md:block">
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-10 bg-muted border-border hover:border-primary/50 transition-colors focus-visible:ring-primary/30" 
              placeholder="Search experiments, docs..." 
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="text-muted-foreground hover:text-primary transition-colors relative active:scale-95 p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1 rounded hover:bg-accent">
              <img 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-border object-cover" 
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAUpTNFyTtX-ykkJM1IBInvASQl47LfGBd4633afYz-AUtbS0pOMsiBf5r6mVjy9dMFRckzM9vxlGw3itD0CAqqXgOp912SGynd2Xxrr7cvJM8-MpDxxZUd1ay-pytzfH6HF33ulNB4bAPtONL7045sbL3BdGZhA_xm8xj1ooTBOfXJiKRTmy4FXInkBtQdGyvwVuQOZHVk63DGCLpn0d_J7lMnu1RL6972bYU8ZivOXP9mv5vXiyVg"} 
              />
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role === 'instructor' ? 'Instructor' : 'Student'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Current Role (Dev)
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem 
              checked={user?.role === 'student'} 
              onCheckedChange={() => {
                setRole('student')
                navigate('/')
              }}
            >
              Student
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={user?.role === 'instructor'} 
              onCheckedChange={() => {
                setRole('instructor')
                navigate('/instructor')
              }}
            >
              Instructor
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
