import { Microscope, Search } from 'lucide-react'

export function ActiveTasks() {
  return (
    <div>
      <h3 className="font-headline-md text-headline-md mb-4 flex items-center gap-2">
        <Microscope className="text-primary h-5 w-5" />
        Active Tasks
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task 1 */}
        <div className="glass-card rounded-lg p-5 hover:border-primary transition-colors group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-background border border-border p-2 rounded">
              <Microscope className="h-4 w-4 text-foreground" />
            </div>
            <span className="px-2 py-1 border border-primary/50 text-primary font-label-caps text-[10px] rounded uppercase tracking-wider bg-primary/10">Advanced</span>
          </div>
          
          <h4 className="font-body-lg text-body-lg font-semibold mb-1 relative z-10">Shor's Algorithm</h4>
          <p className="font-body-md text-body-md text-muted-foreground mb-6 relative z-10">Prime Factorization 2048-bit</p>
          
          <div className="relative z-10">
            <div className="flex justify-between font-code-sm text-[12px] text-muted-foreground mb-2">
              <span>Progress</span>
              <span className="text-primary">78%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[78%] relative">
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Task 2 */}
        <div className="glass-card rounded-lg p-5 hover:border-primary transition-colors group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-background border border-border p-2 rounded">
              <Search className="h-4 w-4 text-foreground" />
            </div>
            <span className="px-2 py-1 border border-border text-muted-foreground font-label-caps text-[10px] rounded uppercase tracking-wider">Intermediate</span>
          </div>
          
          <h4 className="font-body-lg text-body-lg font-semibold mb-1 relative z-10">Grover's Search</h4>
          <p className="font-body-md text-body-md text-muted-foreground mb-6 relative z-10">Database Acceleration T-1</p>
          
          <div className="relative z-10">
            <div className="flex justify-between font-code-sm text-[12px] text-muted-foreground mb-2">
              <span>Progress</span>
              <span className="text-primary">34%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[34%] relative">
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
