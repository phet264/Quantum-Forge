import { AssessmentAttempt } from './assessment'

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: string // Markdown or HTML representation
  interactiveType?: 'quiz' | 'circuit' | 'bloch'
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
