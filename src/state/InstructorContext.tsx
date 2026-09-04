import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { StudentAnalytics, CohortAnalytics } from '../types/assessment'
import { useProgress } from './ProgressContext'
import { useUser } from './UserContext'

interface InstructorContextType {
  cohortAnalytics: CohortAnalytics | null
  students: StudentAnalytics[]
  isLoading: boolean
  refreshAnalytics: () => void
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined)

// Seed data for the development environment.
// In a real application, this would come from a backend database (e.g. PostgreSQL via FastAPI).
const SEED_STUDENTS: StudentAnalytics[] = [
  {
    userId: 'u-555',
    name: 'Sarah Chen',
    activeStatus: 'Active',
    lastActive: new Date().toISOString(),
    overallProgress: 65,
    averageScore: 92,
    completedAssessments: 4,
    strugglingTopics: []
  },
  {
    userId: 'u-777',
    name: 'Marcus Johnson',
    activeStatus: 'Needs attention',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    overallProgress: 15,
    averageScore: 45,
    completedAssessments: 1,
    strugglingTopics: ['Quantum Measurement', 'Entanglement']
  },
  {
    userId: 'u-999',
    name: 'Elena Rodriguez',
    activeStatus: 'Inactive',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
    overallProgress: 40,
    averageScore: 78,
    completedAssessments: 2,
    strugglingTopics: ['Phase Kickback']
  }
]

export function InstructorProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentAnalytics[]>([])
  const [cohortAnalytics, setCohortAnalytics] = useState<CohortAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { progress, getOverallProgress } = useProgress()
  const { user } = useUser()

  const refreshAnalytics = () => {
    setIsLoading(true)
    
    // Calculate current user's analytics dynamically from local progress
    let currentUserAnalytics: StudentAnalytics | null = null
    if (user && user.role === 'student') { // Actually include them even if instructor for testing, but let's just add them
      
      const scores = Object.values(progress.assessmentScores || {})
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      
      // Determine struggling topics dynamically (scores < 70)
      const struggling: string[] = []
      // We don't have titles in assessmentScores dict easily, so we just add a generic one if avg is low
      if (scores.length > 0 && avgScore < 70) {
        struggling.push('Recent Assessments')
      }

      const lastActiveTime = progress.recentActivity.length > 0 
        ? progress.recentActivity[0].timestamp 
        : new Date().toISOString()
      
      const daysSinceActive = (Date.now() - new Date(lastActiveTime).getTime()) / (1000 * 60 * 60 * 24)
      let activeStatus: 'Active' | 'Inactive' | 'Needs attention' = 'Active'
      if (daysSinceActive > 7) {
        activeStatus = 'Inactive'
      } else if (scores.length > 0 && avgScore < 60) {
        activeStatus = 'Needs attention'
      }

      currentUserAnalytics = {
        userId: user.id,
        name: `${user.name} (You)`,
        activeStatus,
        lastActive: lastActiveTime,
        overallProgress: getOverallProgress(),
        averageScore: Math.round(avgScore),
        completedAssessments: (progress.completedAssessments || []).length,
        strugglingTopics: struggling
      }
    }

    const allStudents = [...SEED_STUDENTS]
    if (currentUserAnalytics) {
      allStudents.push(currentUserAnalytics)
    }

    // Aggregate cohort analytics
    const totalStudents = allStudents.length
    const activeStudents = allStudents.filter(s => s.activeStatus === 'Active').length
    const needsAttentionCount = allStudents.filter(s => s.activeStatus === 'Needs attention').length
    const averageProgress = Math.round(allStudents.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
    const averageScore = Math.round(allStudents.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents)

    // Aggregate struggling topics (mock aggregation for demo)
    const strugglingMap: Record<string, { count: number; totalScore: number }> = {}
    // Seed some base topics to match requirements: Measurement — 38%, Entanglement — 52%
    strugglingMap['Quantum Measurement'] = { count: 3, totalScore: 38 * 3 }
    strugglingMap['Entanglement'] = { count: 2, totalScore: 52 * 2 }
    strugglingMap['Quantum Gates'] = { count: 5, totalScore: 81 * 5 }

    const cohortTopics = Object.entries(strugglingMap).map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.totalScore / data.count)
    })).sort((a, b) => a.averageScore - b.averageScore) // Sort lowest score first

    setStudents(allStudents)
    setCohortAnalytics({
      totalStudents,
      activeStudents,
      needsAttentionCount,
      averageProgress,
      averageScore,
      strugglingTopics: cohortTopics,
      recentActivity: [] // Could be populated from real DB
    })
    
    setIsLoading(false)
  }

  // Load analytics when context mounts or progress changes
  useEffect(() => {
    refreshAnalytics()
  }, [progress, user])

  return (
    <InstructorContext.Provider value={{ cohortAnalytics, students, isLoading, refreshAnalytics }}>
      {children}
    </InstructorContext.Provider>
  )
}

export function useInstructor() {
  const context = useContext(InstructorContext)
  if (context === undefined) {
    throw new Error('useInstructor must be used within an InstructorProvider')
  }
  return context
}
