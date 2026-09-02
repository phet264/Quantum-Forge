import { useProgress } from '@/state/ProgressContext'
import { COURSES } from '@/data/learningContent'
import { BrainCircuit, Book, Trophy } from 'lucide-react'

export function LearningStats() {
  const { progress } = useProgress()

  const totalLessons = COURSES.flatMap(c => c.modules).flatMap(m => m.lessons).length
  
  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="font-label-caps text-muted-foreground uppercase tracking-wider mb-6">Learning Statistics</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between font-code-sm text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Book className="h-4 w-4" /> Lessons Completed
            </span>
            <span className="text-primary font-bold">{progress.completedLessons.length} / {totalLessons}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${totalLessons === 0 ? 0 : (progress.completedLessons.length / totalLessons) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between font-code-sm text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" /> Modules Mastered
            </span>
            <span className="text-primary font-bold">{progress.completedModules.length}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between font-code-sm text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Algorithms Studied
            </span>
            <span className="text-primary font-bold">{progress.completedAlgorithms.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
