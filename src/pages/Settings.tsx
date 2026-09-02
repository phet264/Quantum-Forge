import { Settings as SettingsIcon } from 'lucide-react'

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-1">Settings</h2>
          <p className="text-muted-foreground font-body-md">Manage your account, appearance, and application preferences.</p>
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-headline-md">Application Settings</h3>
            <p className="text-sm text-muted-foreground">Configuration options will be available here.</p>
          </div>
        </div>
        
        <div className="space-y-4 opacity-50">
          {/* Placeholder for future forms */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-10 w-full bg-muted rounded border border-border"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-10 w-full bg-muted rounded border border-border"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
