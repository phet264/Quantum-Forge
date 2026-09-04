import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { StudentAnalytics, CohortAnalytics } from '../types/assessment'
import type { UserProgress, ActivityLog } from '../types/learning'
import { useProgress } from './ProgressContext'
import { useUser } from './UserContext'
import { ASSESSMENTS } from '../data/assessmentContent'

interface InstructorContextType {
  cohortAnalytics: CohortAnalytics | null
  students: StudentAnalytics[]
  isLoading: boolean
  refreshAnalytics: () => void
}

const InstructorContext = createContext<InstructorContextType | undefined>(undefined)

const INSTRUCTOR_THRESHOLDS = {
  needsHelpScore: 60,
  atRiskScore: 75,
  inactivityDays: 7
}

// Development Seed Data simulating external users
const SEED_USERS = [
  {
    id: 'u-555', name: 'Sarah Chen',
    progressState: {
      completedLessons: ['l-superposition-basics', 'l-qubit-intro'],
      completedModules: ['m-fundamentals'],
      completedAlgorithms: [],
      completedAssessments: ['a-quantum-basics'],
      assessmentScores: { 'a-quantum-basics': 92 },
      assessmentAttempts: [
        { id: 'a1', userId: 'u-555', assessmentId: 'a-quantum-basics', score: 92, passed: true, startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), questionAttempts: [] }
      ],
      recentActivity: [
        { id: 'act1', type: 'assessment_completed', itemId: 'a-quantum-basics', itemTitle: 'Quantum Basics', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() }
      ]
    } as UserProgress
  },
  {
    id: 'u-777', name: 'Marcus Johnson',
    progressState: {
      completedLessons: ['l-qubit-intro'],
      completedModules: [],
      completedAlgorithms: [],
      completedAssessments: ['a-quantum-measurement'],
      assessmentScores: { 'a-quantum-measurement': 45 },
      assessmentAttempts: [
        { 
          id: 'a2', userId: 'u-777', assessmentId: 'a-quantum-measurement', score: 45, passed: false, 
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), 
          questionAttempts: [
            { questionId: 'q-meas-1', isCorrect: false, pointsEarned: 0, submittedAnswer: 1 },
            { questionId: 'q-meas-2', isCorrect: false, pointsEarned: 0, submittedAnswer: 0 }
          ]
        }
      ],
      recentActivity: [
        { id: 'act2', type: 'assessment_completed', itemId: 'a-quantum-measurement', itemTitle: 'Quantum Measurement', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() }
      ]
    } as UserProgress
  },
  {
    id: 'u-999', name: 'Elena Rodriguez',
    progressState: {
      completedLessons: [],
      completedModules: [],
      completedAlgorithms: [],
      completedAssessments: [],
      assessmentScores: {},
      assessmentAttempts: [],
      recentActivity: [
        { id: 'act3', type: 'started', itemId: 'l-phase-kickback', itemTitle: 'Phase Kickback', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString() }
      ]
    } as UserProgress
  }
]

export function InstructorProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentAnalytics[]>([])
  const [cohortAnalytics, setCohortAnalytics] = useState<CohortAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { progress: currentUserProgress, getOverallProgress } = useProgress()
  const { user } = useUser()

  const refreshAnalytics = () => {
    setIsLoading(true)
    
    // Combine Seed Data with Current User Data
    const cohortProfiles = [...SEED_USERS]
    if (user && user.role === 'student') {
      const existingIdx = cohortProfiles.findIndex(p => p.id === user.id)
      const userProfile = { id: user.id, name: `${user.name} (You)`, progressState: currentUserProgress }
      if (existingIdx >= 0) {
        cohortProfiles[existingIdx] = userProfile
      } else {
        cohortProfiles.push(userProfile)
      }
    }

    const allStudents: StudentAnalytics[] = cohortProfiles.map(profile => {
      const p = profile.progressState
      const scores = Object.values(p.assessmentScores || {})
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const overallProgress = p.completedLessons?.length > 0 ? Math.min(100, p.completedLessons.length * 10) : 0 // Simplified progress proxy for demo
      
      const lastActiveTime = p.recentActivity?.length > 0 
        ? p.recentActivity[0].timestamp 
        : new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // Default old
      
      const daysSinceActive = (Date.now() - new Date(lastActiveTime).getTime()) / (1000 * 60 * 60 * 24)
      
      // Derive Weak Topics
      const topicStats: Record<string, { totalQuestions: number, incorrectQuestions: number }> = {}
      p.assessmentAttempts?.forEach(attempt => {
        const assessmentDef = ASSESSMENTS.find(a => a.id === attempt.assessmentId)
        attempt.questionAttempts?.forEach(qa => {
          const qDef = assessmentDef?.questions.find(q => q.id === qa.questionId)
          if (qDef && qDef.weakTopic) {
            if (!topicStats[qDef.weakTopic]) topicStats[qDef.weakTopic] = { totalQuestions: 0, incorrectQuestions: 0 }
            topicStats[qDef.weakTopic].totalQuestions++
            if (!qa.isCorrect) topicStats[qDef.weakTopic].incorrectQuestions++
          }
        })
      })

      const strugglingTopics = Object.entries(topicStats)
        .map(([topic, stats]) => ({
          topic,
          averageScore: Math.round(((stats.totalQuestions - stats.incorrectQuestions) / stats.totalQuestions) * 100),
          failedAttempts: stats.incorrectQuestions
        }))
        .filter(t => t.averageScore < 70) // Only include if score is low
        .sort((a, b) => a.averageScore - b.averageScore)

      // Needs Attention Logic
      const needsAttentionReasons: string[] = []
      if (daysSinceActive > INSTRUCTOR_THRESHOLDS.inactivityDays) needsAttentionReasons.push('Inactivity')
      if (scores.length > 0 && averageScore < INSTRUCTOR_THRESHOLDS.needsHelpScore) needsAttentionReasons.push('Low assessment performance')
      if (strugglingTopics.length > 0) needsAttentionReasons.push(`Struggling with ${strugglingTopics[0].topic}`)
      
      // Status
      let activeStatus: 'On Track' | 'At Risk' | 'Needs Help' | 'Inactive' = 'On Track'
      if (daysSinceActive > INSTRUCTOR_THRESHOLDS.inactivityDays) {
        activeStatus = 'Inactive'
      } else if (needsAttentionReasons.length > 0 || averageScore < INSTRUCTOR_THRESHOLDS.needsHelpScore) {
        activeStatus = 'Needs Help'
      } else if (averageScore < INSTRUCTOR_THRESHOLDS.atRiskScore) {
        activeStatus = 'At Risk'
      }

      return {
        userId: profile.id,
        name: profile.name,
        activeStatus,
        lastActive: lastActiveTime,
        overallProgress: profile.id === user?.id ? getOverallProgress() : overallProgress,
        averageScore,
        completedAssessments: (p.completedAssessments || []).length,
        strugglingTopics,
        progressState: p,
        needsAttentionReasons
      }
    })

    // Aggregate cohort analytics
    const totalStudents = allStudents.length
    const activeStudents = allStudents.filter(s => s.activeStatus !== 'Inactive').length
    const needsAttentionCount = allStudents.filter(s => s.activeStatus === 'Needs Help').length
    const averageProgress = Math.round(allStudents.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents) || 0
    const averageScore = Math.round(allStudents.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents) || 0

    // Cohort Weak Topics
    const globalTopics: Record<string, { totalScores: number, count: number }> = {}
    allStudents.forEach(s => {
      s.strugglingTopics.forEach(t => {
        if (!globalTopics[t.topic]) globalTopics[t.topic] = { totalScores: 0, count: 0 }
        globalTopics[t.topic].totalScores += t.averageScore
        globalTopics[t.topic].count++
      })
    })

    const cohortTopics = Object.entries(globalTopics).map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.totalScores / data.count)
    })).sort((a, b) => a.averageScore - b.averageScore)

    // Aggregate recent activity
    const recentActivity = allStudents.flatMap(s => 
      (s.progressState?.recentActivity || []).map((a: ActivityLog) => ({
        id: `${s.userId}-${a.id}`,
        userId: s.userId,
        userName: s.name,
        action: a.type.replace('_', ' '),
        timestamp: a.timestamp
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    setStudents(allStudents)
    setCohortAnalytics({
      totalStudents,
      activeStudents,
      needsAttentionCount,
      averageProgress,
      averageScore,
      strugglingTopics: cohortTopics,
      recentActivity
    })
    
    setIsLoading(false)
  }

  useEffect(() => {
    refreshAnalytics()
  }, [currentUserProgress, user])

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
