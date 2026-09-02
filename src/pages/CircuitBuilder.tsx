import { GateLibrary } from '@/components/circuit/GateLibrary'
import { CircuitWorkspace } from '@/components/circuit/CircuitWorkspace'
import { GateInspector } from '@/components/circuit/GateInspector'
import { CodeEditor } from '@/components/circuit/CodeEditor'
import { CircuitToolbar } from '@/components/circuit/CircuitToolbar'

export function CircuitBuilder() {
  return (
    <div className="space-y-4 lg:h-[calc(100vh-8rem)] flex flex-col h-auto">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-1">Circuit Builder</h2>
          <p className="text-muted-foreground font-body-md">Design quantum circuits using drag-and-drop gates or QASM code.</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col glass-card rounded-lg border border-border p-4 gap-4">
        <CircuitToolbar />
        
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Left Panel: Library & Inspector */}
          <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0 h-[500px] lg:h-auto">
            <div className="flex-1 bg-card border border-border rounded-lg p-2 min-h-0 overflow-y-auto">
              <GateLibrary />
            </div>
            <div className="h-64 bg-card border border-border rounded-lg p-4 shrink-0 overflow-y-auto">
              <GateInspector />
            </div>
          </div>
          
          {/* Center Panel: Circuit Workspace */}
          <div className="flex-1 min-w-0 flex flex-col min-h-[400px]">
            <CircuitWorkspace />
          </div>

          {/* Right Panel: Code Editor */}
          <div className="w-full lg:w-80 shrink-0 h-[400px] lg:h-auto">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  )
}
