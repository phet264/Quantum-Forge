import { useParams, useNavigate } from 'react-router-dom'
import { COURSES } from '@/data/learningContent'
import { useProgress } from '@/state/ProgressContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

export function LessonViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, markLessonComplete } = useProgress()

  // Find the lesson in the curriculum
  let currentLesson = null
  let currentModule = null
  let nextLesson = null
  let prevLesson = null

  // Flatten logic to find adjacent lessons
  const allLessons = COURSES.flatMap(c => c.modules).flatMap(m => m.lessons)
  const currentIndex = allLessons.findIndex(l => l.id === id)

  if (currentIndex !== -1) {
    currentLesson = allLessons[currentIndex]
    currentModule = COURSES.flatMap(c => c.modules).find(m => m.lessons.some(l => l.id === id))
    if (currentIndex < allLessons.length - 1) nextLesson = allLessons[currentIndex + 1]
    if (currentIndex > 0) prevLesson = allLessons[currentIndex - 1]
  }

  if (!currentLesson || !currentModule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="font-headline-lg text-headline-lg text-foreground">Lesson Not Found</h2>
        <p className="text-muted-foreground">The requested learning content could not be located.</p>
        <Button onClick={() => navigate('/research')} variant="outline">Back to Catalog</Button>
      </div>
    )
  }

  const isCompleted = progress.completedLessons.includes(currentLesson.id)

  const handleComplete = () => {
    markLessonComplete(currentLesson!.id, currentModule!.id, currentLesson!.title)
    if (nextLesson) {
      navigate(`/research/lesson/${nextLesson.id}`)
    } else {
      navigate('/research')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-stack-xl">
      <button 
        onClick={() => navigate('/research')}
        className="flex items-center text-sm font-code-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Catalog
      </button>

      <div className="space-y-2 border-b border-border pb-6">
        <div className="flex justify-between items-center">
          <span className="font-label-caps uppercase text-primary tracking-wider">{currentModule.title}</span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-label-caps text-primary border border-primary/50 px-2 py-0.5 rounded uppercase">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </span>
          )}
        </div>
        <h1 className="font-display-lg-mobile md:font-display-lg m-0 text-foreground">{currentLesson.title}</h1>
        <p className="text-muted-foreground font-body-md text-lg">{currentLesson.description}</p>
      </div>

      <div className="prose prose-invert max-w-none font-body-md leading-relaxed">
        {/* Simulating Markdown rendering. In Phase 2, we would use a real markdown parser like react-markdown */}
        {currentLesson.content.split('\\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return null
          // Naive bolding parsing for demonstration
          const boldParsed = paragraph.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
          return <p key={idx} dangerouslySetInnerHTML={{ __html: boldParsed }} />
        })}
      </div>

      {/* Interactive Element Placeholder */}
      <div className="glass-card rounded-lg p-8 my-8 text-center border-dashed">
        <h4 className="font-headline-md mb-2">Practice in Circuit Builder</h4>
        <p className="text-muted-foreground font-body-sm mb-4">Put this theory into practice by constructing it in the Circuit Builder.</p>
        <Button onClick={() => navigate('/circuit-builder')} variant="default">
          Open Circuit Builder
        </Button>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-border">
        {prevLesson ? (
          <Button variant="outline" onClick={() => navigate(`/research/lesson/${prevLesson!.id}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
        ) : <div />}

        <Button 
          onClick={handleComplete} 
          className={`${isCompleted ? 'bg-muted text-muted-foreground hover:bg-muted' : ''}`}
        >
          {isCompleted ? 'Re-read Lesson' : 'Mark Complete'} 
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
