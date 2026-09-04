import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

interface QuickCheckProps {
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export function QuickCheck({ question, options, correctAnswerIndex, explanation }: QuickCheckProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = submitted && selectedIdx === correctAnswerIndex

  return (
    <div className="my-8 border border-border rounded-lg bg-card/30 overflow-hidden">
      <div className="bg-primary/5 px-6 py-4 border-b border-border">
        <h4 className="font-headline-md text-foreground flex items-center">
          <span className="text-primary mr-2">Quick Check</span>
        </h4>
      </div>
      
      <div className="p-6 space-y-6">
        <p className="font-body-md text-foreground">{question}</p>
        
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !submitted && setSelectedIdx(idx)}
              className={`w-full text-left p-4 rounded-md border transition-all ${
                submitted 
                  ? idx === correctAnswerIndex
                    ? 'border-green-500/50 bg-green-500/10'
                    : idx === selectedIdx 
                      ? 'border-destructive/50 bg-destructive/10'
                      : 'border-border opacity-50 cursor-default'
                  : selectedIdx === idx
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
              }`}
              disabled={submitted}
            >
              <div className="flex items-start">
                <div className={`mt-0.5 mr-3 h-4 w-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                  submitted
                    ? idx === correctAnswerIndex
                      ? 'border-green-500 text-green-500'
                      : idx === selectedIdx
                        ? 'border-destructive text-destructive'
                        : 'border-muted-foreground'
                    : selectedIdx === idx
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                }`}>
                  {submitted && idx === correctAnswerIndex && <CheckCircle2 className="h-4 w-4" />}
                  {submitted && idx === selectedIdx && idx !== correctAnswerIndex && <XCircle className="h-4 w-4" />}
                </div>
                <span className="font-body-md">{opt}</span>
              </div>
            </button>
          ))}
        </div>

        {!submitted ? (
          <Button 
            disabled={selectedIdx === null} 
            onClick={() => setSubmitted(true)}
          >
            Check Answer
          </Button>
        ) : (
          <div className={`p-4 rounded-md mt-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
            <h5 className={`font-headline-sm mb-2 flex items-center ${isCorrect ? 'text-green-500' : 'text-destructive'}`}>
              {isCorrect ? (
                <><CheckCircle2 className="h-5 w-5 mr-2" /> Correct!</>
              ) : (
                <><XCircle className="h-5 w-5 mr-2" /> Not quite.</>
              )}
            </h5>
            <p className="font-body-md text-foreground">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
