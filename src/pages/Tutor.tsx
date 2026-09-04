import { useState, useRef, useEffect } from 'react'
import { useSimulation } from '@/state/SimulationContext'
import { useCircuit } from '@/state/CircuitContext'
import { generateQASM } from '@/lib/quantum/qasm'
import type { TutorMessage } from '@/lib/quantum/tutor/tutorApi'
import { sendTutorMessage } from '@/lib/quantum/tutor/tutorApi'
import { Button } from '@/components/ui/button'
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { useLocation, useNavigate } from 'react-router-dom'

const QUICK_ACTIONS = [
  "Explain my circuit",
  "Why these probabilities?",
  "Explain each gate",
  "Find an error",
  "Optimize my circuit",
  "Generate Qiskit code",
  "Give me a hint"
]

export function Tutor() {
  const { circuitState, setHighlightedGateIds } = useCircuit()
  const { latestResult } = useSimulation()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState<TutorMessage[]>([
    { role: 'assistant', content: 'Hello! I am your AI Tutor. I can help explain your circuit, debug issues, or guide you through quantum concepts.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const hasLaunched = useRef(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const handleSend = async (text: string, overrideContext?: any) => {
    if (!text.trim() || isLoading) return

    const newMessages = [...messages, { role: 'user', content: text } as TutorMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const hasCircuit = circuitState.operations.length > 0
      
      // Prevent quick actions that rely on a circuit if none exists
      const circuitRequiredActions = [
        "Explain my circuit",
        "Why these probabilities?",
        "Explain each gate",
        "Find an error",
        "Optimize my circuit",
        "Generate Qiskit code",
        "Explain simply"
      ]
      if (!hasCircuit && circuitRequiredActions.includes(text)) {
        setMessages([...newMessages, { role: 'assistant', content: 'Build a circuit first in Circuit Builder.' }])
        setIsLoading(false)
        return
      }

      let circuitContext = hasCircuit ? {
        numQubits: circuitState.numQubits,
        depth: Math.max(0, ...circuitState.operations.map((op: any) => op.timeStep)) + 1,
        operations: circuitState.operations.map((op: any) => ({
          type: op.type,
          targets: op.targets,
          controls: op.controls,
          param: op.param,
          timeStep: op.timeStep
        })),
        qasm: generateQASM(circuitState)
      } : undefined

      let simulationContext = latestResult?.status === 'SUCCESS' ? {
        backend: latestResult.backend,
        shots: latestResult.shots,
        counts: latestResult.measurements,
        probabilities: latestResult.probabilities,
        stateVector: latestResult.stateVector
      } : undefined

      let challengeContext = undefined
      let assessmentContext = undefined

      if (overrideContext) {
        if (overrideContext.challenge) challengeContext = overrideContext.challenge
        if (overrideContext.assessment) assessmentContext = overrideContext.assessment
        if (overrideContext.circuit) circuitContext = overrideContext.circuit
        if (overrideContext.simulation) simulationContext = overrideContext.simulation
      }

      const reply = await sendTutorMessage({
        messages: newMessages,
        context: {
          circuit: circuitContext,
          simulation: simulationContext,
          challenge: challengeContext,
          assessment: assessmentContext
        }
      })

      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to communicate with AI Tutor.')
      // Do not append fake response
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (location.state?.tutorLaunchContext && !hasLaunched.current) {
      hasLaunched.current = true
      
      const ctx = location.state.tutorLaunchContext
      
      // Clear state so refresh doesn't trigger again
      navigate('.', { replace: true, state: {} })
      
      // Auto-send message
      let prompt = "Explain my mistake: "
      if (ctx.source === 'assessment' && ctx.assessment?.question_title) {
        prompt += ctx.assessment.question_title
      } else if (ctx.source === 'challenge' && ctx.challenge?.title) {
        prompt += ctx.challenge.title
      } else {
        prompt += "Unknown question"
      }
      
      // Use setTimeOut to allow the component to fully mount first if needed, though handleSend works immediately.
      setTimeout(() => {
        handleSend(prompt, ctx)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  return (
    <div className="flex h-[calc(100vh-theme(spacing.20))] gap-6 max-w-7xl mx-auto w-full">
      
      {/* Context Panel */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-headline-md font-bold mb-4 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            Current Context
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-label-caps uppercase text-muted-foreground mb-2">Circuit</h4>
              <div className="text-sm font-code-sm bg-muted/50 p-3 rounded">
                <div>Qubits: {circuitState.numQubits}</div>
                <div>Gates: {circuitState.operations.length}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-label-caps uppercase text-muted-foreground mb-2">Simulation</h4>
              <div className="text-sm font-code-sm bg-muted/50 p-3 rounded">
                {latestResult?.status === 'SUCCESS' ? (
                  <>
                    <div>Backend: {latestResult.backend}</div>
                    <div>Shots: {latestResult.shots}</div>
                    <div>Data: Available</div>
                  </>
                ) : (
                  <span className="text-muted-foreground">No simulation result available.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 flex-1">
          <h4 className="text-xs font-label-caps uppercase text-muted-foreground mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(action => (
              <Badge 
                key={action} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/20 transition-colors py-1.5 px-3"
                onClick={() => handleSend(action)}
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-card border border-border rounded-lg flex flex-col overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className={`max-w-[80%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 border border-border/50'}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none font-body-md">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      a: ({ href, children, ...props }) => {
                        if (href?.startsWith('#gate-')) {
                          const gateId = href.replace('#gate-', '')
                          return (
                            <button
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors ml-1 cursor-pointer"
                              onClick={() => {
                                setHighlightedGateIds([gateId])
                                setTimeout(() => setHighlightedGateIds([]), 3000)
                              }}
                              title="Highlight this gate in the Circuit Builder"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              {children}
                            </button>
                          )
                        }
                        return <a href={href} {...props} className="text-primary hover:underline">{children}</a>
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg">
              {errorMsg}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-muted/20 border-t border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
            className="flex gap-3 relative"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your circuit..."
              className="flex-1 bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-body-md"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading} className="shrink-0 px-6">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}
