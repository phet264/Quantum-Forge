export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface BaseQuestion {
  id: string
  type: 'multiple_choice' | 'circuit_challenge'
  title: string
  description: string
  points: number
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice'
  options: string[]
  correctOptionIndex: number
  explanation: string
}

export type ChallengeValidationRule = 
  | { type: 'must_not_be_empty'; errorMessage: string }
  | { type: 'must_have_gate'; gate: string; errorMessage: string }
  | { type: 'must_entangle'; errorMessage: string }
  | { type: 'banned_gate'; gate: string; errorMessage: string }

export interface CircuitChallengeCriteria {
  targetStateVector?: number[] // Array of probabilities or amplitudes to match roughly
  targetProbabilities?: Record<string, number> // e.g. {"00": 0.5, "11": 0.5}
  targetDepth?: number // Optional efficiency constraint
  requiredGates?: string[] // e.g. ['H', 'CX']
  rules?: ChallengeValidationRule[]
}

export interface CircuitChallenge extends BaseQuestion {
  type: 'circuit_challenge'
  initialQubits: number
  criteria: CircuitChallengeCriteria
  explanation: string // Shown after completion
  hint?: string
  solution?: {
    circuitDescription: string
    expectedResultDescription?: string
    expectedCircuitQasm?: string
  }
}

export type Question = MultipleChoiceQuestion | CircuitChallenge

export interface Assessment {
  id: string
  moduleId: string
  title: string
  description: string
  difficulty: DifficultyLevel
  questions: Question[]
  passingScore: number // percentage 0-100
}

export interface QuestionAttempt {
  questionId: string
  isCorrect: boolean
  pointsEarned: number
  submittedAnswer?: number | string | any // Index for MC, circuit state for Challenge
  feedback?: string
  hintUsed?: boolean
  solutionRevealed?: boolean
}

export interface AssessmentAttempt {
  id: string
  assessmentId: string
  userId: string
  startTime: string
  endTime?: string
  score?: number // Percentage 0-100
  passed?: boolean
  questionAttempts: QuestionAttempt[]
}

// Instructor Analytics Types
export interface StudentAnalytics {
  userId: string
  name: string
  activeStatus: 'Active' | 'Inactive' | 'Needs attention'
  lastActive: string
  overallProgress: number
  averageScore: number
  completedAssessments: number
  strugglingTopics: string[]
}

export interface CohortAnalytics {
  totalStudents: number
  activeStudents: number
  needsAttentionCount: number
  averageProgress: number
  averageScore: number
  strugglingTopics: { topic: string; averageScore: number }[]
  recentActivity: ActivityEvent[]
}

export interface ActivityEvent {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
}
