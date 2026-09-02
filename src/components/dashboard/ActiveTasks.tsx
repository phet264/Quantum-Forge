import { Microscope, Search } from 'lucide-react'
import { MOCK_ACTIVE_TASKS } from '@/data/mockData'

export function ActiveTasks() {
  return (
    <div>
      <h3 className="font-headline-md text-headline-md mb-4 flex items-center gap-2">
        <Microscope className="text-primary h-5 w-5" />
        Active Tasks
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ACTIVE_TASKS.map(task => (
          <div key={task.id} className="glass-card rounded-lg p-5 hover:border-primary/40 transition-colors duration-300 group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="bg-muted/50 border border-border p-2 rounded">
                {task.id === 'task-1' ? <Microscope className="h-4 w-4 text-foreground" /> : <Search className="h-4 w-4 text-foreground" />}
              </div>
              <span className={`px-2 py-1 border font-label-caps text-[10px] rounded uppercase tracking-wider ${
                task.type === 'Advanced' 
                  ? 'border-primary/50 text-primary bg-primary/10' 
                  : 'border-border text-muted-foreground'
              }`}>
                {task.type}
              </span>
            </div>
            
            <h4 className="font-body-lg text-body-lg font-semibold mb-1 relative z-10">{task.title}</h4>
            <p className="font-body-md text-body-md text-muted-foreground mb-6 relative z-10">{task.description}</p>
            
            <div className="relative z-10">
              <div className="flex justify-between font-code-sm text-[12px] text-muted-foreground mb-2">
                <span>Progress</span>
                <span className="text-primary">{task.progress}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary relative" style={{ width: `${task.progress}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
