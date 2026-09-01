import { AlertTriangle } from 'lucide-react'

export function ExperimentLog() {
  return (
    <div className="glass-card rounded-lg p-5 flex-1 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase tracking-wider">Experiment Log</h3>
        <button className="text-primary hover:text-cyan-400 font-code-sm text-[12px]">Export</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-0 relative">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-border z-0"></div>
        
        {/* Log Item 1 */}
        <div className="relative z-10 flex gap-4 pb-4">
          <div className="w-6 h-6 rounded-full bg-background border border-primary flex items-center justify-center mt-0.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="font-code-sm text-[12px] text-primary">SYS_OK [200]</span>
              <span className="font-code-sm text-[10px] text-muted-foreground">14:02:45</span>
            </div>
            <p className="font-body-md text-sm">Circuit compilation completed successfully. 42 gates applied.</p>
          </div>
        </div>
        
        {/* Log Item 2 */}
        <div className="relative z-10 flex gap-4 pb-4">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center mt-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="font-code-sm text-[12px] text-muted-foreground">CAL_INIT [100]</span>
              <span className="font-code-sm text-[10px] text-muted-foreground">13:58:12</span>
            </div>
            <p className="font-body-md text-sm text-muted-foreground">Initiated routine qubit calibration sequence.</p>
          </div>
        </div>
        
        {/* Log Item 3 */}
        <div className="relative z-10 flex gap-4 pb-4">
          <div className="w-6 h-6 rounded-full bg-background border border-destructive flex items-center justify-center mt-0.5 shrink-0">
            <AlertTriangle className="h-3 w-3 text-destructive" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="font-code-sm text-[12px] text-destructive">DECO_WARN [403]</span>
              <span className="font-code-sm text-[10px] text-muted-foreground">13:45:01</span>
            </div>
            <p className="font-body-md text-sm">Slight decoherence detected in Qubit Q-14. Auto-correction applied.</p>
          </div>
        </div>
        
        {/* Log Item 4 */}
        <div className="relative z-10 flex gap-4 pb-4">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center mt-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="font-code-sm text-[12px] text-muted-foreground">JOB_END [201]</span>
              <span className="font-code-sm text-[10px] text-muted-foreground">12:30:00</span>
            </div>
            <p className="font-body-md text-sm text-muted-foreground">VQE simulation finished. Results saved to Datastore.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
