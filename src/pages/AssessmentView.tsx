import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAssessment } from '@/state/AssessmentContext'
import { useProgress } from '@/state/ProgressContext'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react'
import type { MultipleChoiceQuestion } from '@/types/assessment'
export function AssessmentView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    activeAssessment, 
    activeAttempt, 
    startAssessment, 
    submitQuestionAttempt, 
    finishAssessment
  } = useAssessment()

  const { progress } = useProgress()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const isReviewMode = location.state?.reviewMode === true
  const isReattempt = location.state?.reattempt === true

  useEffect(() => {
    if (id) {
      if (isReviewMode) {
        // Find best attempt to review
        const attempts = progress.assessmentAttempts?.filter(a => a.assessmentId === id && a.endTime) || []
        const bestAttempt = attempts.reduce((best, curr) => (curr.score || 0) > (best.score || 0) ? curr : best, attempts[0])
        if (bestAttempt) {
          // In a real app we might want to populate the active context with this historical attempt,
          // but for now, we will handle review UI implicitly. (This is a simplified read-only state).
        }
      } else if (!activeAssessment || activeAssessment.id !== id || isReattempt) {
        startAssessment(id)
      } else if (activeAttempt && !activeAttempt.endTime && !isReattempt) {
        // "In Progress" - restore state
        const answeredCount = activeAttempt.questionAttempts.length
        if (answeredCount < activeAssessment.questions.length) {
          setCurrentQuestionIndex(answeredCount)
        }
      }
    }
  }, [id, activeAssessment, isReviewMode, isReattempt, startAssessment])

  // Derive weak topics based on incorrect question attempts
  const { weakTopic, practicePath, reviewPath } = useMemo(() => {
    if (!activeAssessment || !activeAttempt || !activeAttempt.endTime || activeAttempt.passed) {
      return { weakTopic: null, practicePath: null, reviewPath: null }
    }

    const incorrectTopicCounts: Record<string, number> = {}
    
    activeAttempt.questionAttempts.forEach(qa => {
      if (!qa.isCorrect) {
        const q = activeAssessment.questions.find(q => q.id === qa.questionId)
        if (q?.weakTopic) {
          incorrectTopicCounts[q.weakTopic] = (incorrectTopicCounts[q.weakTopic] || 0) + 1
        }
      }
    })

    const topics = Object.entries(incorrectTopicCounts)
    if (topics.length === 0) return { weakTopic: 'General Concepts', practicePath: '/circuit-builder', reviewPath: '/research' }
    
    topics.sort((a, b) => b[1] - a[1]) // highest count first
    const primaryWeakTopic = topics[0][0]

    // Determine paths based on topic
    let rPath = '/research'
    let pPath = '/circuit-builder'

    if (primaryWeakTopic.toLowerCase().includes('measurement')) {
      rPath = '/research/lesson/l-measurement-prob'
    } else if (primaryWeakTopic.toLowerCase().includes('superposition')) {
      rPath = '/research/lesson/l-superposition-basics'
    } else if (primaryWeakTopic.toLowerCase().includes('entanglement')) {
      rPath = '/research/lesson/l-entanglement-intro'
    } else if (primaryWeakTopic.toLowerCase().includes('gates')) {
      rPath = '/research/lesson/l-quantum-gates'
    } else if (primaryWeakTopic.toLowerCase().includes('qubit')) {
      rPath = '/research/lesson/l-qubit-intro'
    }

    return { weakTopic: primaryWeakTopic, practicePath: pPath, reviewPath: rPath }
  }, [activeAssessment, activeAttempt])


  if (!activeAssessment || !activeAttempt) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    )
  }

  // If completed, show summary
  if (activeAttempt.endTime && !isReviewMode) {
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
            {activeAttempt.passed ? (
              <Button onClick={() => navigate('/assessments')}>
                Return to Assessment Center
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                {weakTopic && (
                  <div className="w-full p-4 bg-muted/30 border border-primary/20 rounded-lg text-left mb-2 shadow-sm">
                    <h4 className="font-headline-sm flex items-center text-primary mb-2">
                      <BrainCircuit className="w-4 h-4 mr-2" /> Needs Practice
                    </h4>
                    <p className="font-bold text-foreground mb-1">Weak Topic: <span className="text-destructive">{weakTopic}</span></p>
                    <p className="text-sm font-body-sm text-muted-foreground mb-4">
                      Based on your incorrect answers, we recommend reviewing this topic and practicing.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" 
                        variant="outline"
                        onClick={() => navigate(reviewPath!)}
                      >
                        Review Topic
                      </Button>
                      <Button 
                        className="flex-1 border-primary/20" 
                        variant="outline"
                        onClick={() => navigate(practicePath!)}
                      >
                        Practice Now
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => navigate('/assessment/'+activeAssessment.id, { state: { reattempt: true }})}>
                    Retry Assessment
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => navigate('/assessments')}>
                    Assessment Center
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Handle Review Mode
  let activeQuestionIndex = currentQuestionIndex
  let currentQuestion = activeAssessment.questions[activeQuestionIndex]
  let activeQuestionAttempt = activeAttempt.questionAttempts.find(qa => qa.questionId === currentQuestion.id)

  if (isReviewMode) {
    // We override local state with review data
    // Usually we would pull this from history
    activeQuestionAttempt = activeAttempt.questionAttempts.find(qa => qa.questionId === currentQuestion.id)
  } else {
     activeQuestionAttempt = undefined // don't pre-fill in real time until submitted
  }

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
      if (!isReviewMode) finishAssessment()
      else navigate('/assessments')
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

  const renderFeedback = isReviewMode || showFeedback
  const displaySelectedOption = isReviewMode && activeQuestionAttempt ? (activeQuestionAttempt.submittedAnswer as number) : selectedOption

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 pb-32">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isReviewMode && <span className="text-primary mr-2">Review:</span>}
            {activeAssessment.title}
          </h1>
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
            const isSelected = displaySelectedOption === idx
            
            // Visual feedback classes
            let feedbackClass = ''
            if (renderFeedback) {
              if (idx === mcq.correctOptionIndex) feedbackClass = 'border-primary bg-primary/10 text-primary'
              else if (isSelected) feedbackClass = 'border-destructive bg-destructive/10 text-destructive'
            } else if (isSelected) {
              feedbackClass = 'border-primary/50 bg-primary/5'
            }

            return (
              <button
                key={idx}
                onClick={() => !renderFeedback && setSelectedOption(idx)}
                disabled={renderFeedback}
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

      {renderFeedback && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className={`font-bold mb-2 flex items-center gap-2 ${displaySelectedOption === mcq.correctOptionIndex ? 'text-primary' : 'text-destructive'}`}>
            {displaySelectedOption === mcq.correctOptionIndex ? (
              <><CheckCircle2 className="h-5 w-5" /> Correct!</>
            ) : (
              <><XCircle className="h-5 w-5" /> Incorrect</>
            )}
          </h3>
          <p className="text-muted-foreground">{mcq.explanation}</p>
          
          {displaySelectedOption !== mcq.correctOptionIndex && !isReviewMode && (
             <Button variant="outline" size="sm" className="mt-4" onClick={handleAIExplain}>
               Explain My Mistake
             </Button>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4">
        {!renderFeedback ? (
          <Button onClick={handleCheck} disabled={displaySelectedOption === null}>
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestionIndex < activeAssessment.questions.length - 1 ? 'Next Question' : (isReviewMode ? 'Close Review' : 'Submit Assessment')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
