import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAssessment } from '@/state/AssessmentContext'
import { useSimulation } from '@/state/SimulationContext'
import { useAnimation } from '@/state/AnimationContext'
import { useCircuit } from '@/state/CircuitContext'
import { Button } from '@/components/ui/button'
import { CircuitWorkspace } from '@/components/circuit/CircuitWorkspace'
import { GateLibrary } from '@/components/circuit/GateLibrary'
import { CircuitToolbar } from '@/components/circuit/CircuitToolbar'
import { ArrowLeft, Bot, Check, CheckCircle2, Lightbulb, Play, XCircle } from 'lucide-react'
import { generateQASM } from '@/lib/quantum/qasm'
import type { CircuitChallenge } from '@/types/assessment'
import { validateChallengeCircuit } from '@/lib/quantum/challengeValidation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ChallengeView() {
  const { assessmentId, challengeId } = useParams<{ assessmentId: string, challengeId: string }>()
  const navigate = useNavigate()
  
  const { activeAssessment, startAssessment, submitQuestionAttempt } = useAssessment()
  const { isRunning: isSimulating, latestResult, runSimulation: simulate } = useSimulation()
  const { playAnimation, stopAnimation, isPlaying, settings } = useAnimation()
  const { circuitState, updateFromCode } = useCircuit()
  
  const [evaluationResult, setEvaluationResult] = useState<{ passed: boolean; feedback: string } | null>(null)
  const [structuralErrors, setStructuralErrors] = useState<string[]>([])
  
  // Hint & Solution states
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  
  const [showBuildCorrectConfirm, setShowBuildCorrectConfirm] = useState(false)
  const [showSolutionLoaded, setShowSolutionLoaded] = useState(false)

  useEffect(() => {
    if (assessmentId && (!activeAssessment || activeAssessment.id !== assessmentId)) {
      startAssessment(assessmentId)
    }
  }, [assessmentId, activeAssessment, startAssessment])

  const challenge = activeAssessment?.questions.find(q => q.id === challengeId) as CircuitChallenge | undefined

  // Auto-evaluate when simulation result arrives and animation finishes
  useEffect(() => {
    if (isSimulating || isPlaying || !latestResult || !challenge) return

    let passed = false
    let feedback = ""

    if (latestResult.status === 'SUCCESS' && challenge.criteria?.targetProbabilities) {
      // First, check structural constraints using validateChallengeCircuit
      const { valid, errors } = validateChallengeCircuit(challenge, circuitState)
      if (!valid) {
        passed = false
        feedback = `Challenge Requirement Not Met: ${errors.join(' ')}`
      } else {
        passed = true
        feedback = 'Challenge Requirement Met'
        
        const targetProbs = challenge.criteria.targetProbabilities
        const actualProbs = latestResult.probabilities
        
        // Find the maximum probability state the student got to show in feedback if it fails
        let maxActualState = ""
        let maxActualProb = 0
        for (const [state, prob] of Object.entries(actualProbs)) {
          if (prob > maxActualProb) {
            maxActualProb = prob
            maxActualState = state
          }
        }
        
        for (const [state, expectedProb] of Object.entries(targetProbs)) {
          // In case the target is "00" but the actual produces "0010"
          // We look for exact match in actualProbs keys.
          const actualProb = actualProbs[state] || 0
          if (Math.abs(actualProb - expectedProb) > 0.05) {
            passed = false
            feedback = `Challenge Requirement Not Met: Expected approximately |${state}⟩ ≈ ${(expectedProb*100).toFixed(1)}%. Your circuit produced ${maxActualState ? `|${maxActualState}⟩ = ${(maxActualProb*100).toFixed(1)}%` : 'an unexpected distribution'}. This does not satisfy the requirement.`
            break
          }
        }
      }
    } else if (latestResult.status === 'ERROR') {
      passed = false
      feedback = `Simulation failed: ${latestResult.errorMessage || 'Unknown error'}`
    }

    setEvaluationResult({ passed, feedback })
  }, [latestResult, isSimulating, isPlaying, challenge, circuitState])

  const handleRunCircuit = async () => {
    setEvaluationResult(null)
    setStructuralErrors([])
    
    // Execute actual simulation first
    await simulate()
    
    // Then animate timeline if enabled
    if (settings.enabled) {
      await playAnimation(circuitState)
    }
  }

  const handleBuildCorrectCircuit = () => {
    if (!challenge?.solution?.expectedCircuitQasm) return
    
    updateFromCode(challenge.solution.expectedCircuitQasm)
    setStructuralErrors([])
    setEvaluationResult(null)
    setShowBuildCorrectConfirm(false)
    setShowSolutionLoaded(true)
    
    // Hide the loaded message after a few seconds
    setTimeout(() => {
      setShowSolutionLoaded(false)
    }, 5000)
  }

  const handleSubmitChallenge = () => {
    if (!challenge) return

    if (!evaluationResult) {
      alert("Please run the circuit first before submitting.")
      return
    }

    submitQuestionAttempt(challenge.id, {
      isCorrect: evaluationResult.passed,
      pointsEarned: evaluationResult.passed ? challenge.points : 0,
      submittedAnswer: 'Circuit Submission',
      feedback: evaluationResult.feedback,
      hintUsed: hintUsed,
      solutionRevealed: solutionRevealed
    })
    
    // Navigate away after successful submission
    navigate(`/assessment/${assessmentId}`)
  }

  const handleAIExplain = () => {
    if (!challenge) return;

    let userMistakeContext = ""
    
    if (structuralErrors.length > 0) {
      userMistakeContext = `The student's circuit failed structural validation: ${structuralErrors.join(' ')}`
    } else {
      userMistakeContext = `The student's circuit result did not meet the target probability distribution: ${evaluationResult?.feedback || 'Unexpected distribution'}`
    }

    const challengeQuestion = `Explain my mistake: ${challenge.title}`

    navigate('/tutor', {
      state: {
        autoPrompt: challengeQuestion,
        tutorLaunchContext: {
          source: 'challenge',
          challenge: {
            question: challenge.title + ' - ' + challenge.description,
            expected_result: JSON.stringify(challenge.criteria.targetProbabilities || {}),
            actual_result: latestResult?.probabilities ? JSON.stringify(latestResult.probabilities) : 'None',
            student_circuit: generateQASM(circuitState),
            mismatch_detected: userMistakeContext
          }
        }
      }
    })
  }

  if (!activeAssessment || activeAssessment.id !== assessmentId) {
    return <div className="p-8 text-center text-muted-foreground">Loading challenge...</div>
  }

  if (!challenge) {
    return <div className="p-8 text-center text-destructive">Challenge not found.</div>
  }

  return (
    <div className="space-y-4 lg:h-[calc(100vh-8rem)] flex flex-col h-auto">
      <div className="flex justify-between items-start shrink-0">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/assessment/${assessmentId}`)} className="mb-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assessment
          </Button>
          <h2 className="font-headline-lg text-headline-lg mb-1">{challenge.title}</h2>
          <p className="text-muted-foreground font-body-md max-w-3xl">{challenge.description}</p>
          
          {/* Inline Hint / Solution Content */}
          {showHint && challenge.hint && (
            <div className="mt-4 p-4 bg-muted/30 border border-primary/20 rounded-lg max-w-3xl text-sm">
              <strong className="text-primary mr-2">Hint:</strong> {challenge.hint}
            </div>
          )}
          {showSolution && challenge.solution && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg max-w-3xl text-sm">
              <strong className="block text-primary mb-2">Solution Revealed</strong>
              <p><strong>Circuit:</strong> {challenge.solution.circuitDescription}</p>
              {challenge.solution.expectedResultDescription && (
                <p className="mt-2"><strong>Result:</strong> {challenge.solution.expectedResultDescription}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3 items-center">
          
          <TooltipProvider>
            {challenge.hint && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showHint ? "secondary" : "outline"} 
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Provides a clue</p>
                </TooltipContent>
              </Tooltip>
            )}

            {challenge.solution && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showSolution ? "secondary" : "outline"}
                    onClick={() => {
                      if (!showSolution) setShowSolutionConfirm(true)
                    }}
                    disabled={showSolution}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Solution
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reveal the solution</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>

          <Button onClick={handleRunCircuit} disabled={isSimulating || isPlaying} variant="default">
            <Play className="h-4 w-4 mr-2" />
            {isSimulating || isPlaying ? 'Running...' : 'Run Circuit'}
          </Button>
          
          {settings.enabled && (isPlaying || isSimulating) && (
            <Button variant="outline" onClick={stopAnimation}>
              Stop
            </Button>
          )}
        </div>
      </div>
      
      {/* Simulation Result Area */}
      {latestResult && !isSimulating && !isPlaying && (
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center">
              {latestResult.status === 'SUCCESS' ? <CheckCircle2 className="h-5 w-5 text-primary mr-2" /> : <XCircle className="h-5 w-5 text-destructive mr-2" />}
              {latestResult.status === 'SUCCESS' ? '✓ Circuit Executed' : 'Simulation Failed'}
            </h3>
            {latestResult.status === 'SUCCESS' && (
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>Backend: <strong className="text-foreground">{latestResult.backend}</strong></span>
                <span>Shots: <strong className="text-foreground">{latestResult.shots}</strong></span>
              </div>
            )}
          </div>
          
          {latestResult.status === 'SUCCESS' && latestResult.probabilities && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Measurement Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(latestResult.probabilities).map(([state, prob]) => (
                  <div key={state} className="flex justify-between items-center bg-card p-2 rounded border border-border">
                    <span className="font-mono text-primary">|{state}⟩</span>
                    <span className="font-mono">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {latestResult.status === 'ERROR' && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded text-sm font-mono">
              {latestResult.errorMessage || 'Unknown simulation error occurred.'}
            </div>
          )}
        </div>
      )}
      
      {evaluationResult && !isSimulating && !isPlaying && (
        <div className={`p-4 rounded-lg border flex flex-col gap-4 ${evaluationResult.passed ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
          <div className="flex items-start gap-3">
            {evaluationResult.passed ? <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> : <XCircle className="h-5 w-5 text-destructive mt-0.5" />}
            <div>
              <h3 className={`font-bold mb-1 ${evaluationResult.passed ? 'text-primary' : 'text-destructive'}`}>
                {evaluationResult.passed ? '✓ Challenge Requirement Met' : '❌ Challenge Requirement Not Met'}
              </h3>
              <p className={evaluationResult.passed ? 'text-primary/90' : 'text-destructive/90'}>
                {evaluationResult.feedback}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 flex-wrap border-t border-border/50 pt-3 mt-1">
            {!evaluationResult.passed && challenge.solution?.expectedCircuitQasm && (
              <Button variant="secondary" size="sm" onClick={() => setShowBuildCorrectConfirm(true)}>
                🔧 Build Correct Circuit
              </Button>
            )}
            {!evaluationResult.passed && (
              <Button variant="outline" size="sm" onClick={handleAIExplain}>
                <Bot className="h-4 w-4 mr-2" /> Explain My Mistake
              </Button>
            )}
            {evaluationResult.passed && (
              <Button onClick={handleSubmitChallenge} variant="default">
                Submit Challenge
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Challenge Solution Loaded Indicator */}
      {showSolutionLoaded && (
        <div className="bg-primary/20 text-primary border border-primary/30 rounded-lg p-2 text-center text-sm font-medium animate-in fade-in">
          ✓ Challenge Solution Loaded
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col glass-card rounded-lg border border-border p-4 gap-4">
        <CircuitToolbar />
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          <div className="w-full lg:w-64 shrink-0 bg-card border border-border rounded-lg p-2 min-h-0 overflow-y-auto">
            <GateLibrary />
          </div>
          <div className="flex-1 min-w-0 flex flex-col min-h-[400px]">
            <CircuitWorkspace />
          </div>
        </div>
      </div>

      <Dialog open={showSolutionConfirm} onOpenChange={setShowSolutionConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal Solution?</DialogTitle>
            <DialogDescription>
              This will show you the exact circuit operations needed to complete the challenge. You will not earn points for this challenge if the solution is revealed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSolutionConfirm(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowSolutionConfirm(false)
              setShowSolution(true)
              setSolutionRevealed(true)
            }}>Show Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBuildCorrectConfirm} onOpenChange={setShowBuildCorrectConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Build the Correct Circuit?</DialogTitle>
            <DialogDescription>
              This will replace the circuit currently in the builder with the challenge solution. Your original attempt will be preserved in your attempt history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowBuildCorrectConfirm(false)}>Cancel</Button>
            <Button onClick={handleBuildCorrectCircuit}>Build Correct Circuit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
