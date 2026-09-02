import type { UserProgress, Recommendation } from '../../types/learning'
import { COURSES, ALGORITHMS } from '../../data/learningContent'

export function getNextRecommendation(progress: UserProgress): Recommendation {
  const completedLessons = progress.completedLessons

  // 1. Iterate through all courses, modules, and lessons in sequence.
  // We use a deterministic approach: the first incomplete lesson in the curriculum is the recommendation.
  for (const course of COURSES) {
    for (const module of course.modules) {
      
      // Check if module has prerequisites and if they are met
      if (module.prerequisites && module.prerequisites.length > 0) {
        const hasMetPrereqs = module.prerequisites.every(prereqId => {
          const prereqModule = COURSES.flatMap(c => c.modules).find(m => m.id === prereqId)
          if (!prereqModule) return true // Invalid prereq, ignore
          return prereqModule.lessons.every(l => completedLessons.includes(l.id))
        })
        
        if (!hasMetPrereqs) {
          // If prereqs are not met, the logic will naturally have stopped at the incomplete prereq lesson earlier
          // in the iteration (assuming prerequisites are defined earlier in the curriculum order). 
          // If it didn't, we just skip this module for recommendations.
          continue
        }
      }

      // Find the first uncompleted lesson in this module
      for (const lesson of module.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return {
            type: 'lesson',
            id: lesson.id,
            title: lesson.title,
            reason: `Continue your progress in ${module.title}`
          }
        }
      }
    }
  }

  // 2. If all lessons are completed, recommend an algorithm
  const uncompletedAlgorithms = ALGORITHMS.filter(a => !progress.completedAlgorithms.includes(a.id))
  
  if (uncompletedAlgorithms.length > 0) {
    const nextAlgo = uncompletedAlgorithms[0]
    return {
      type: 'algorithm',
      id: nextAlgo.id,
      title: nextAlgo.title,
      reason: 'Apply your fundamentals to quantum algorithms.'
    }
  }

  // 3. If everything is done
  return {
    type: 'module',
    id: 'completed',
    title: 'Curriculum Completed',
    reason: 'You have finished all available content!'
  }
}
