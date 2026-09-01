export function SystemStateCard() {
  return (
    <div className="glass-card rounded-lg p-stack-md relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-transparent pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Visualization Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-headline-md">System State</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 border border-border rounded text-code-sm font-code-sm text-muted-foreground uppercase">32 Qubits</span>
              <span className="px-2 py-1 border border-primary/30 bg-primary/10 rounded text-code-sm font-code-sm text-primary uppercase">Active</span>
            </div>
          </div>
          
          <div className="relative w-full h-64 bg-background border border-border/50 rounded flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen">
               {/* 3D Wireframe Bloch Sphere Placeholder */}
               <img className="w-full h-full object-cover mix-blend-screen opacity-60" alt="Bloch sphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVZ3XAiktKX0rDk7BvNKLTyuE7i2OYZs7JvPeWouIKjI-P_SWOSByv7iO-9udI-cFiJ-rNv58Eh4fDeRyQ0yCMmnp2pp2rXh8SEDcU3uJ_JYvCcrQi3mrQtUY7yOFiXDttIrme_RlJTINJLv2Gmz3rXmu92vHQR4E-4ZKLP774WLd-b2abtkofVQiu1D0dwdtEDXPMkvIw5m-75gDt4uLb4VRi3On6bYAMkEIPKT3FXNk1YXZWrlXr" />
            </div>
            
            {/* Overlay grid lines for technical feel */}
            <div className="absolute inset-0 grid-bg opacity-30"></div>
          </div>
        </div>

        {/* Data Readout */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div>
            <h4 className="font-label-caps text-label-caps text-muted-foreground uppercase mb-2">State Vector | ψ⟩</h4>
            <div className="bg-background border border-border p-3 rounded font-code-sm text-code-sm space-y-1 h-32 overflow-y-auto">
              <div className="flex justify-between"><span className="text-muted-foreground">|0000⟩</span><span>0.707 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|0001⟩</span><span>0.000 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|0010⟩</span><span>0.000 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|0011⟩</span><span>0.000 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|0100⟩</span><span>0.000 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|0101⟩</span><span>0.000 + 0.000i</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">|1111⟩</span><span className="text-primary">0.707 + 0.000i</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border p-2 rounded">
              <div className="font-label-caps text-[10px] text-muted-foreground uppercase">Phase</div>
              <div className="font-code-sm">π/4</div>
            </div>
            <div className="bg-card border border-border p-2 rounded">
              <div className="font-label-caps text-[10px] text-muted-foreground uppercase">Entropy</div>
              <div className="font-code-sm">0.02 bits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
