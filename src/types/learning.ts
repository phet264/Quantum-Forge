import type { AssessmentAttempt } from './assessment'

export type LessonBlock =
  | { type: 'theory'; content: string }
  | { type: 'equation'; content: string }
  | { type: 'conceptComparison'; items: { title: string; description: string }[] }
  | { type: 'interactiveCircuit'; title: string; qasm: string; description: string }
  | { type: 'probabilityVisualization'; state?: string }
  | { type: 'stateVectorVisualization'; state?: string }
  | { type: 'blochSphere'; state?: string }
  | { type: 'quickCheck'; question: string; options: string[]; correctAnswerIndex: number; explanation: string }
  | { type: 'circuitPractice'; title: string; targetCircuit: string; buttonText: string }
  | { type: 'keyTakeaways'; points: string[] }
  | { type: 'whyItMatters'; content: string }

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  objective?: string
  content?: string // legacy
  blocks?: LessonBlock[]
  interactiveType?: 'quiz' | 'circuit' | 'bloch' // legacy
}

export interface LearningModule {
  id: string
  courseId: string
  title: string
  description: string
  lessons: Lesson[]
  prerequisites?: string[] // Module IDs
}

export interface Course {
  id: string
  title: string
  description: string
  modules: LearningModule[]
}

export interface QuantumAlgorithm {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  theory: string
  circuitOverview?: string
  canonicalCircuitQasm?: string
  prerequisites?: string[] // Module IDs or Lesson IDs
}

export interface UserProgress {
  completedLessons: string[]
  completedModules: string[]
  completedAlgorithms: string[]
  completedAssessments: string[]
  assessmentScores: Record<string, number> // assessmentId -> score
  assessmentAttempts: AssessmentAttempt[]
  recentActivity: ActivityLog[]
}

export interface ActivityLog {
  id: string
  type: 'lesson_completed' | 'module_completed' | 'algorithm_completed' | 'started' | 'assessment_completed' | 'challenge_completed' | 'challenge_failed'
  itemId: string
  itemTitle: string
  timestamp: string
}

export interface Recommendation {
  type: 'lesson' | 'module' | 'algorithm'
  id: string
  title: string
  reason: string
}
