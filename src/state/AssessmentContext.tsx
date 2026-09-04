import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Assessment, AssessmentAttempt, QuestionAttempt } from '../types/assessment'
import { useProgress } from './ProgressContext'
import { useUser } from './UserContext'
import { ASSESSMENTS } from '../data/assessmentContent'

interface AssessmentContextType {
  activeAssessment: Assessment | null
  activeAttempt: AssessmentAttempt | null
  startAssessment: (assessmentId: string) => void
  submitQuestionAttempt: (questionId: string, attempt: Omit<QuestionAttempt, 'questionId'>) => void
  finishAssessment: () => void
  clearAssessment: () => void
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null)
  const [activeAttempt, setActiveAttempt] = useState<AssessmentAttempt | null>(null)
  const { recordAssessmentAttempt } = useProgress()
  const { user } = useUser()

  const startAssessment = (assessmentId: string) => {
    const assessment = ASSESSMENTS.find(a => a.id === assessmentId)
    if (!assessment) {
      console.error(`Assessment ${assessmentId} not found`)
      return
    }

    setActiveAssessment(assessment)
    setActiveAttempt({
      id: `attempt-${Date.now()}`,
      assessmentId: assessment.id,
      userId: user?.id || 'unknown',
      startTime: new Date().toISOString(),
      questionAttempts: []
    })
  }

  const submitQuestionAttempt = (questionId: string, attempt: Omit<QuestionAttempt, 'questionId'>) => {
    if (!activeAttempt) return

    setActiveAttempt(prev => {
      if (!prev) return prev
      
      // Remove existing attempt for this question if any
      const existingFiltered = prev.questionAttempts.filter(q => q.questionId !== questionId)
      
      return {
        ...prev,
        questionAttempts: [...existingFiltered, { ...attempt, questionId }]
      }
    })
  }

  const finishAssessment = () => {
    if (!activeAssessment || !activeAttempt) return

    const totalPointsPossible = activeAssessment.questions.reduce((sum, q) => sum + q.points, 0)
    const pointsEarned = activeAttempt.questionAttempts.reduce((sum, q) => sum + q.pointsEarned, 0)
    
    const scorePercentage = totalPointsPossible > 0 
      ? Math.round((pointsEarned / totalPointsPossible) * 100) 
      : 0
    
    const passed = scorePercentage >= activeAssessment.passingScore

    const finalAttempt: AssessmentAttempt = {
      ...activeAttempt,
      endTime: new Date().toISOString(),
      score: scorePercentage,
      passed
    }

    setActiveAttempt(finalAttempt)
    recordAssessmentAttempt(finalAttempt, activeAssessment.title)
  }

  const clearAssessment = () => {
    setActiveAssessment(null)
    setActiveAttempt(null)
  }

  return (
    <AssessmentContext.Provider value={{ 
      activeAssessment, 
      activeAttempt, 
      startAssessment, 
      submitQuestionAttempt, 
      finishAssessment,
      clearAssessment
    }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider')
  }
  return context
}
