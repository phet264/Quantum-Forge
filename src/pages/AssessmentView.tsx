import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAssessment } from '@/state/AssessmentContext'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ArrowRight, BrainCircuit, Play } from 'lucide-react'
import type { MultipleChoiceQuestion } from '@/types/assessment'

export function AssessmentView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    activeAssessment, 
    activeAttempt, 
    startAssessment, 
    submitQuestionAttempt, 
    finishAssessment,
    clearAssessment
  } = useAssessment()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (id && (!activeAssessment || activeAssessment.id !== id)) {
      startAssessment(id)
    }
    // Removed cleanup: return () => clearAssessment()
    // This allows navigating to ChallengeView and back without losing state.
  }, [id, activeAssessment])

  if (!activeAssessment || !activeAttempt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    )
  }

  // If completed, show summary
  if (activeAttempt.endTime) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          {activeAttempt.passed ? (
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          )}
          
          <h2 className="text-3xl font-bold mb-2">
            {activeAttempt.passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h2>
          <p className="text-muted-foreground mb-8">
            You scored {activeAttempt.score}% (Passing score: {activeAssessment.passingScore}%)
          </p>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => startAssessment(activeAssessment.id)}>
              Retry Assessment
            </Button>
            <Button onClick={() => navigate('/research')}>
              Return to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = activeAssessment.questions[currentQuestionIndex]

  // We are handling Multiple Choice here. 
  // If it's a circuit challenge, redirect to the challenge view.
  if (currentQuestion.type === 'circuit_challenge') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <BrainCircuit className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Circuit Challenge</h2>
        <p className="text-muted-foreground mb-8">This question requires you to build a circuit.</p>
        <Button onClick={() => navigate(`/challenge/${activeAssessment.id}/${currentQuestion.id}`)}>
          Open Challenge Builder <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  const mcq = currentQuestion as MultipleChoiceQuestion
  
  const handleCheck = () => {
    if (selectedOption === null) return
    
    const isCorrect = selectedOption === mcq.correctOptionIndex
    const pointsEarned = isCorrect ? mcq.points : 0
    
    submitQuestionAttempt(mcq.id, {
      isCorrect,
      pointsEarned,
      submittedAnswer: selectedOption,
      feedback: mcq.explanation
    })
    
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < activeAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      finishAssessment()
    }
  }

  const handleAIExplain = () => {
    // Navigate to tutor with context of this question
    navigate('/tutor', {
      state: {
        tutorLaunchContext: {
          source: 'assessment',
          assessment: {
            assessment_title: activeAssessment.title,
            difficulty: activeAssessment.difficulty,
            question_title: mcq.title,
            question_type: mcq.type,
            question_description: mcq.description,
            student_answer: mcq.options[selectedOption!],
            correct_answer: mcq.options[mcq.correctOptionIndex],
            explanation: mcq.explanation
          }
        }
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-foreground">{activeAssessment.title}</h1>
          <span className="text-sm font-label-caps text-muted-foreground">
            Question {currentQuestionIndex + 1} of {activeAssessment.questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${((currentQuestionIndex) / activeAssessment.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-6">
        <h2 className="text-xl font-bold mb-4">{mcq.title}</h2>
        <p className="text-muted-foreground font-body-md mb-8">{mcq.description}</p>

        <div className="space-y-3">
          {mcq.options.map((option, idx) => {
            const isSelected = selectedOption === idx
            
            // Visual feedback classes
            let feedbackClass = ''
            if (showFeedback) {
              if (idx === mcq.correctOptionIndex) feedbackClass = 'border-primary bg-primary/10 text-primary'
              else if (isSelected) feedbackClass = 'border-destructive bg-destructive/10 text-destructive'
            } else if (isSelected) {
              feedbackClass = 'border-primary/50 bg-primary/5'
            }

            return (
              <button
                key={idx}
                onClick={() => !showFeedback && setSelectedOption(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  feedbackClass || 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {showFeedback && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className={`font-bold mb-2 flex items-center gap-2 ${selectedOption === mcq.correctOptionIndex ? 'text-primary' : 'text-destructive'}`}>
            {selectedOption === mcq.correctOptionIndex ? (
              <><CheckCircle2 className="h-5 w-5" /> Correct!</>
            ) : (
              <><XCircle className="h-5 w-5" /> Incorrect</>
            )}
          </h3>
          <p className="text-muted-foreground">{mcq.explanation}</p>
          
          {selectedOption !== mcq.correctOptionIndex && (
             <Button variant="outline" size="sm" className="mt-4" onClick={handleAIExplain}>
               Explain My Mistake
             </Button>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4">
        {!showFeedback ? (
          <Button onClick={handleCheck} disabled={selectedOption === null}>
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestionIndex < activeAssessment.questions.length - 1 ? 'Next Question' : 'Submit Assessment'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
