import { Settings as SettingsIcon } from 'lucide-react'
import { useAnimation } from '@/state/AnimationContext'
import { Switch } from '@/components/ui/switch'

export function Settings() {
  const { settings, updateSettings } = useAnimation()
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
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-foreground">Enable Quantum Animation</h4>
              <p className="text-sm text-muted-foreground">Show step-by-step state evolution during simulation</p>
            </div>
            <Switch 
              checked={settings.enabled} 
              onCheckedChange={(c) => updateSettings({ enabled: c })} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-foreground">Reduced Motion</h4>
              <p className="text-sm text-muted-foreground">Minimize visual effects (respects OS preferences by default)</p>
            </div>
            <Switch 
              checked={settings.prefersReducedMotion} 
              onCheckedChange={(c) => updateSettings({ prefersReducedMotion: c })} 
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-foreground">Animation Speed</h4>
              <p className="text-sm text-muted-foreground">Adjust the delay between execution steps</p>
            </div>
            <div className="flex gap-4 items-center">
              <input 
                type="range" 
                min="0.2" 
                max="3" 
                step="0.1" 
                value={settings.speed}
                onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
                className="w-full max-w-xs"
              />
              <span className="text-sm font-code-sm text-muted-foreground">{settings.speed}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
