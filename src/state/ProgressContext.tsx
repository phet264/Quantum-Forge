import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UserProgress, ActivityLog } from '../types/learning'
import { COURSES } from '../data/learningContent'

interface ProgressContextType {
  progress: UserProgress
  markLessonComplete: (lessonId: string, moduleId: string, title: string) => void
  markAlgorithmComplete: (algorithmId: string, title: string) => void
  getModuleProgress: (moduleId: string) => number // returns percentage 0-100
  getOverallProgress: () => number
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedModules: [],
  completedAlgorithms: [],
  recentActivity: []
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = 'quantumforge_progress_v1'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : defaultProgress
    } catch (e) {
      console.error("Failed to parse progress", e)
      return defaultProgress
    }
  })

  // Persist to local storage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markLessonComplete = (lessonId: string, moduleId: string, title: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev

      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: 'lesson_completed',
        itemId: lessonId,
        itemTitle: title,
        timestamp: new Date().toISOString()
      }

      // Check if module is now complete
      const module = COURSES.flatMap(c => c.modules).find(m => m.id === moduleId)
      let newlyCompletedModules = [...prev.completedModules]
      
      if (module) {
        const allLessonIds = module.lessons.map(l => l.id)
        const newCompletedLessons = [...prev.completedLessons, lessonId]
        const isModuleComplete = allLessonIds.every(id => newCompletedLessons.includes(id))
        
        if (isModuleComplete && !newlyCompletedModules.includes(moduleId)) {
          newlyCompletedModules.push(moduleId)
          newActivity.type = 'module_completed'
          newActivity.itemTitle = module.title
        }
      }

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        completedModules: newlyCompletedModules,
        recentActivity: [newActivity, ...prev.recentActivity].slice(0, 10) // Keep last 10
      }
    })
  }

  const markAlgorithmComplete = (algorithmId: string, title: string) => {
    setProgress(prev => {
      if (prev.completedAlgorithms.includes(algorithmId)) return prev

      const newActivity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: 'algorithm_completed',
        itemId: algorithmId,
        itemTitle: title,
        timestamp: new Date().toISOString()
      }

      return {
        ...prev,
        completedAlgorithms: [...prev.completedAlgorithms, algorithmId],
        recentActivity: [newActivity, ...prev.recentActivity].slice(0, 10)
      }
    })
  }

  const getModuleProgress = (moduleId: string): number => {
    const module = COURSES.flatMap(c => c.modules).find(m => m.id === moduleId)
    if (!module || module.lessons.length === 0) return 0

    const completedInModule = module.lessons.filter(l => progress.completedLessons.includes(l.id)).length
    return Math.round((completedInModule / module.lessons.length) * 100)
  }

  const getOverallProgress = (): number => {
    const totalLessons = COURSES.flatMap(c => c.modules).flatMap(m => m.lessons).length
    if (totalLessons === 0) return 0
    return Math.round((progress.completedLessons.length / totalLessons) * 100)
  }

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      markLessonComplete, 
      markAlgorithmComplete, 
      getModuleProgress, 
      getOverallProgress 
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
