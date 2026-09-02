import { FlaskConical, ArrowRight, Download, Copy } from 'lucide-react'
import { SimulationControls } from '@/components/simulator/SimulationControls'
import { CircuitSummary } from '@/components/simulator/CircuitSummary'
import { MeasurementChart } from '@/components/simulator/MeasurementChart'
import { StateVectorView } from '@/components/simulator/StateVectorView'
import { BlochSphere } from '@/components/simulator/BlochSphere'
import { ResultExplanation } from '@/components/simulator/ResultExplanation'
import { useSimulation } from '@/state/SimulationContext'
import { useCircuit } from '@/state/CircuitContext'
import { generateQASM } from '@/lib/quantum/qasm'
import { Button } from '@/components/ui/button'

export function Simulator() {
  const { latestResult, runSimulation } = useSimulation()
  const { circuitState, updateFromCode } = useCircuit()

  const handleCopyQASM = () => {
    const qasm = generateQASM(circuitState)
    navigator.clipboard.writeText(qasm)
  }

  const handleDownloadResults = () => {
    if (!latestResult) return
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(latestResult, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "quantum_results.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="space-y-6 pb-stack-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-1">Quantum Simulator</h2>
          <p className="text-muted-foreground font-body-md">Configure and execute quantum circuits on simulated or real backends.</p>
        </div>
        
        {latestResult && latestResult.status === 'SUCCESS' && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopyQASM} className="font-code-sm text-xs">
              <Copy className="w-3 h-3 mr-2" /> QASM
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadResults} className="font-code-sm text-xs">
              <Download className="w-3 h-3 mr-2" /> Results JSON
            </Button>
          </div>
        )}
      </div>
      
      <CircuitSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workspace (Results) */}
        <div className="lg:col-span-2 space-y-6">
          {circuitState.operations.length === 0 ? (
             <div className="glass-card rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center border-dashed border-border bg-card/30">
               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                 <FlaskConical className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="font-headline-lg mb-2">No Circuit Ready to Simulate</h3>
               <p className="text-muted-foreground font-body-md text-center max-w-md mb-8">
                 Build a quantum circuit first in the Circuit Builder, or start with a quick example below.
               </p>

               <div className="flex flex-wrap items-center justify-center gap-3">
                 <Button 
                   variant="outline"
                   onClick={() => {
                     const qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nid q[0];\n';
                     updateFromCode(qasm);
                   }}
                   className="font-code-sm border-border/50 hover:border-primary/50"
                 >
                   |0⟩ Empty
                 </Button>
                 
                 <Button 
                   variant="outline"
                   onClick={() => {
                     const qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\n';
                     updateFromCode(qasm);
                   }}
                   className="font-code-sm border-border/50 hover:border-primary/50"
                 >
                   [ H ] Superposition
                 </Button>

                 <Button 
                   variant="outline"
                   onClick={() => {
                     const qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0],q[1];\n';
                     updateFromCode(qasm);
                   }}
                   className="font-code-sm border-border/50 hover:border-primary/50"
                 >
                   [ Bell State ] Entanglement
                 </Button>
               </div>
             </div>
          ) : !latestResult ? (
             <div className="glass-card rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center border-dashed border-border">
               <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                 <FlaskConical className="h-8 w-8 text-muted-foreground" />
               </div>
               <h3 className="font-headline-md mb-2">Circuit Loaded</h3>
               <p className="text-muted-foreground font-body-md text-center max-w-md mb-6">
                 Circuit ready for execution. Configure your settings and click Run Simulation.
               </p>
               <Button onClick={() => runSimulation()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                 Run Simulation Now
               </Button>
             </div>
          ) : (
            <>
              {latestResult.status === 'SUCCESS' && (
                <div className="flex items-center justify-center space-x-2 py-4 px-6 glass-card rounded-lg bg-card/20 border border-border/50 overflow-x-auto text-xs font-label-caps uppercase text-muted-foreground">
                  <div className="flex items-center text-primary font-medium bg-primary/10 px-2 py-1 rounded">Circuit</div>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                  <div className="flex items-center">State Vector</div>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                  <div className="flex items-center">Measurement</div>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                  <div className="flex items-center">Probabilities</div>
                </div>
              )}

              <div className="glass-card rounded-lg p-6">
                <MeasurementChart />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-lg p-6">
                  <StateVectorView />
                </div>
                <div className="glass-card rounded-lg p-6">
                  <BlochSphere />
                </div>
              </div>

              <ResultExplanation />
            </>
          )}
        </div>
        
        {/* Side Panel (Controls) */}
        <div className="w-full">
          <SimulationControls />
        </div>
      </div>
    </div>
  )
}
