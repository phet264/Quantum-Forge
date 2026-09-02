import { AlertTriangle } from 'lucide-react'
import { MOCK_EXPERIMENT_LOGS } from '@/data/mockData'

export function ExperimentLog() {
  return (
    <div className="glass-card rounded-lg p-5 flex-1 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase tracking-wider">Experiment Log</h3>
        <button className="text-primary hover:text-primary/80 transition-colors font-code-sm text-[12px]">Export</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-0 relative">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-border z-0"></div>
        
        {MOCK_EXPERIMENT_LOGS.map(log => (
          <div key={log.id} className="relative z-10 flex gap-4 pb-4">
            <div className={`w-6 h-6 rounded-full bg-muted/50 border flex items-center justify-center mt-0.5 shrink-0 ${
              log.type === 'success' ? 'border-primary' : log.type === 'warning' ? 'border-destructive' : 'border-border'
            }`}>
              {log.type === 'success' && <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"></span>}
              {log.type === 'warning' && <AlertTriangle className="h-3 w-3 text-destructive" />}
              {log.type === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className={`font-code-sm text-[12px] ${
                  log.type === 'success' ? 'text-primary' : log.type === 'warning' ? 'text-destructive' : 'text-muted-foreground'
                }`}>{log.code}</span>
                <span className="font-code-sm text-[10px] text-muted-foreground">{log.time}</span>
              </div>
              <p className={`font-body-md text-sm ${log.type === 'info' ? 'text-muted-foreground' : ''}`}>{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
