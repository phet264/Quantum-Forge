import { useCircuit } from '@/state/CircuitContext'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Undo, Redo, Trash2, Play, Plus, Minus, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { useSharedCircuits } from '@/state/SharedCircuitsContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export function CircuitToolbar() {
  const { 
    circuitState, setQubitCount, clearCircuit, loadCircuit,
    undo, redo, canUndo, canRedo 
  } = useCircuit()
  
  const { shareCircuit, sharedCircuits } = useSharedCircuits()
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isLoadOpen, setIsLoadOpen] = useState(false)
  const [shareTitle, setShareTitle] = useState('My Circuit')

  const navigate = useNavigate()

  const handleClear = () => {
    if (circuitState.operations.length === 0) return
    if (window.confirm('Are you sure you want to clear the entire circuit?')) {
      clearCircuit()
      toast.success('Circuit cleared')
    }
  }

  const { assessmentId, challengeId } = useParams()

  const handleRun = () => {
    if (circuitState.operations.length === 0) {
      toast.error('Cannot simulate an empty circuit. Add some gates first.')
      return
    }
    
    if (assessmentId && challengeId) {
      navigate('/simulator', {
        state: { returnToChallenge: `/challenge/${assessmentId}/${challengeId}` }
      })
    } else {
      navigate('/simulator')
    }
  }

  const handleShare = (target: 'Instructor' | 'Collaborator' | 'Class') => {
    if (circuitState.operations.length === 0) {
      toast.error('Cannot share an empty circuit.')
      return
    }
    shareCircuit(
      shareTitle, 
      circuitState, 
      target, 
      (assessmentId && challengeId) ? { assessmentId, challengeId } : undefined
    )
    setIsShareOpen(false)
    toast.success(`Circuit shared with ${target}`)
  }

  return (
    <div className="flex items-center justify-between p-2 bg-card border-b border-border mb-4 rounded-t-lg">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded">
          <span className="text-xs font-label-caps uppercase text-muted-foreground ml-2">Qubits</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setQubitCount(circuitState.numQubits - 1)}
            disabled={circuitState.numQubits <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-code-sm font-bold min-w-[1ch] text-center">{circuitState.numQubits}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setQubitCount(circuitState.numQubits + 1)}
            disabled={circuitState.numQubits >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border mx-2"></div>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleClear} title="Clear Circuit" disabled={circuitState.operations.length === 0}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-4 text-xs font-code-sm text-muted-foreground mr-4">
          <span>Gates: {circuitState.operations.length}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsLoadOpen(true)} className="mr-2">
          Load
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)} className="mr-4">
          <Share2 className="h-4 w-4 mr-2" /> Share
        </Button>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90" 
          onClick={handleRun}
        >
          <Play className="h-4 w-4 mr-2" /> Run Simulation
        </Button>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Circuit</DialogTitle>
            <DialogDescription>
              Share your current circuit with your instructor, collaborators, or the class.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Circuit Title</label>
              <input 
                type="text"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {challengeId && (
              <Badge variant="outline" className="mt-2">Linked to Challenge: {challengeId}</Badge>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => handleShare('Instructor')}>Instructor</Button>
            <Button variant="outline" onClick={() => handleShare('Collaborator')}>Collaborator</Button>
            <Button variant="outline" onClick={() => handleShare('Class')}>Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load Shared Circuit</DialogTitle>
            <DialogDescription>
              Open a circuit shared by an instructor or peer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {sharedCircuits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shared circuits available.</p>
            ) : (
              <div className="space-y-2">
                {sharedCircuits.map(sc => (
                  <div key={sc.id} className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                    <div>
                      <h4 className="font-bold text-sm">{sc.title}</h4>
                      <p className="text-xs text-muted-foreground">From: {sc.ownerName} | Shared with: {sc.sharedWith}</p>
                    </div>
                    <Button size="sm" onClick={() => {
                      loadCircuit(sc.circuitState);
                      toast.success(`Loaded ${sc.title}`);
                      setIsLoadOpen(false);
                    }}>
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
