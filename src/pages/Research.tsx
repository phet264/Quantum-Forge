import { COURSES, ALGORITHMS } from '@/data/learningContent'
import { useProgress } from '@/state/ProgressContext'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react'

export function Research() {
  const { progress, getModuleProgress } = useProgress()

  // Helper to check if prereqs are met
  const arePrereqsMet = (prereqs?: string[]) => {
    if (!prereqs || prereqs.length === 0) return true
    return prereqs.every(id => {
      // Is it a module prereq?
      if (progress.completedModules.includes(id)) return true
      // Is it a course prereq? (simplification: if any module in course is completed, or if we define course completion)
      // For now, let's assume it checks module or algorithm completion
      if (progress.completedAlgorithms.includes(id)) return true
      
      // Let's implement a strict check: if the prereq string matches a module ID, check if all lessons in that module are done
      const prereqModule = COURSES.flatMap(c => c.modules).find(m => m.id === id)
      if (prereqModule) {
        return prereqModule.lessons.every(l => progress.completedLessons.includes(l.id))
      }
      return false
    })
  }

  return (
    <div className="space-y-12 pb-stack-xl max-w-container-max mx-auto">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg m-0 tracking-tight text-foreground">
            Research <span className="text-primary font-light">& Learning</span>
          </h2>
          <p className="font-code-sm text-muted-foreground mt-2">
            Explore quantum algorithms, theory, and educational modules.
          </p>
        </div>
      </div>
      
      {/* COURSES */}
      {COURSES.map(course => (
        <div key={course.id} className="space-y-6">
          <h3 className="font-headline-lg text-headline-lg border-l-4 border-primary pl-4">{course.title}</h3>
          <p className="text-muted-foreground font-body-md max-w-2xl">{course.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.modules.map(module => {
              const unlocked = arePrereqsMet(module.prerequisites)
              const modProgress = getModuleProgress(module.id)
              const isComplete = modProgress === 100

              return (
                <Link 
                  key={module.id} 
                  to={unlocked ? `/research/lesson/${module.lessons[0]?.id}` : '#'}
                  className={`glass-card rounded-lg p-6 flex flex-col group relative overflow-hidden transition-all duration-300 ${
                    unlocked ? 'hover:border-primary/50 cursor-pointer' : 'opacity-60 cursor-not-allowed grayscale'
                  }`}
                >
                  {unlocked && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {isComplete ? <CheckCircle2 className="h-5 w-5" /> : unlocked ? <BookOpen className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    {isComplete && <span className="text-xs font-label-caps uppercase text-primary border border-primary/50 px-2 py-0.5 rounded">Mastered</span>}
                  </div>
                  
                  <h4 className="font-headline-md mb-2 relative z-10">{module.title}</h4>
                  <p className="text-muted-foreground font-body-sm mb-6 flex-1 relative z-10">
                    {module.description}
                  </p>
                  
                  {unlocked && !isComplete && (
                    <div className="relative z-10">
                      <div className="flex justify-between text-xs font-code-sm mb-1 text-muted-foreground">
                        <span>Progress</span>
                        <span>{modProgress}%</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${modProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {/* ALGORITHMS */}
      <div className="space-y-6 pt-8 border-t border-border">
        <h3 className="font-headline-lg text-headline-lg border-l-4 border-primary pl-4">Quantum Algorithms</h3>
        <p className="text-muted-foreground font-body-md max-w-2xl">Advanced standard algorithms requiring fundamental prerequisites.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALGORITHMS.map(algo => {
            const unlocked = arePrereqsMet(algo.prerequisites)
            const isComplete = progress.completedAlgorithms.includes(algo.id)

            return (
              <Link 
                key={algo.id} 
                to={unlocked ? `/research/algorithm/${algo.id}` : '#'}
                className={`glass-card rounded-lg p-6 flex flex-col group relative overflow-hidden transition-all duration-300 ${
                  unlocked ? 'hover:border-primary/50 cursor-pointer' : 'opacity-60 cursor-not-allowed grayscale'
                }`}
              >
                {unlocked && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : unlocked ? <Zap className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <span className="text-[10px] font-label-caps uppercase text-muted-foreground border border-border px-2 py-0.5 rounded">{algo.difficulty}</span>
                </div>
                
                <h4 className="font-headline-md mb-2 relative z-10">{algo.title}</h4>
                <p className="text-muted-foreground font-body-sm mb-6 flex-1 relative z-10">
                  {algo.description}
                </p>
                
                <div className="relative z-10 flex items-center text-xs font-code-sm text-primary group-hover:translate-x-1 transition-transform">
                  {unlocked ? (
                    <>Study Algorithm <ArrowRight className="ml-1 h-3 w-3" /></>
                  ) : (
                    <span className="text-muted-foreground">Prerequisites not met</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}
