import { useParams, useNavigate } from 'react-router-dom'
import { COURSES } from '@/data/learningContent'
import { useProgress } from '@/state/ProgressContext'
import { useCircuit } from '@/state/CircuitContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Bot } from 'lucide-react'
import { InteractiveMicroLab } from '@/components/learning/InteractiveMicroLab'
import { QuickCheck } from '@/components/learning/QuickCheck'
import type { LessonBlock, LearningModule, Lesson } from '@/types/learning'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export function LessonViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, markLessonComplete } = useProgress()
  const { updateFromCode } = useCircuit()

  let currentLesson: Lesson | null = null
  let currentModule: LearningModule | null = null
  let nextLesson: Lesson | null = null
  let prevLesson: Lesson | null = null
  let lessonIndex = 0
  let totalLessonsInCourse = 0

  const allLessons = COURSES.flatMap(c => c.modules).flatMap(m => m.lessons)
  const currentIndex = allLessons.findIndex(l => l.id === id)

  if (currentIndex !== -1) {
    currentLesson = allLessons[currentIndex]
    currentModule = COURSES.flatMap(c => c.modules).find(m => m.lessons.some(l => l.id === id)) || null
    if (currentIndex < allLessons.length - 1) nextLesson = allLessons[currentIndex + 1]
    if (currentIndex > 0) prevLesson = allLessons[currentIndex - 1]
    
    // Calculate lesson index within the course (flattening modules)
    const course = COURSES.find(c => c.modules.some(m => m.id === currentModule?.id))
    if (course) {
      const courseLessons = course.modules.flatMap(m => m.lessons)
      lessonIndex = courseLessons.findIndex(l => l.id === id) + 1
      totalLessonsInCourse = courseLessons.length
    }
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

  const handleAskTutor = () => {
    navigate('/tutor', {
      state: {
        context: {
          learning_context: `The student is currently learning about "${currentLesson!.title}" in the module "${currentModule!.title}". Lesson objective: ${currentLesson!.objective || currentLesson!.description}`
        }
      }
    })
  }

  const renderBlock = (block: LessonBlock, index: number) => {
    switch (block.type) {
      case 'theory':
        return (
          <div key={index} className="prose prose-invert max-w-none font-body-md leading-relaxed my-4 text-foreground">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {block.content}
            </ReactMarkdown>
          </div>
        )
      case 'equation':
        return (
          <div key={index} className="my-6 p-4 rounded-lg bg-card/30 border border-border flex justify-center text-xl text-primary overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {`$$${block.content}$$`}
            </ReactMarkdown>
          </div>
        )
      case 'conceptComparison':
        return (
          <div key={index} className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.items.map((item, i) => (
              <div key={i} className="p-4 border border-border rounded-lg bg-card/10 hover:bg-card/30 transition-colors">
                <h5 className="font-headline-sm text-primary mb-2">{item.title}</h5>
                <p className="font-body-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        )
      case 'interactiveCircuit':
        return (
          <InteractiveMicroLab
            key={index}
            title={block.title}
            description={block.description}
            initialQasm={block.qasm}
          />
        )
      case 'quickCheck':
        return (
          <QuickCheck
            key={index}
            question={block.question}
            options={block.options}
            correctAnswerIndex={block.correctAnswerIndex}
            explanation={block.explanation}
          />
        )
      case 'circuitPractice':
        return (
          <div key={index} className="glass-card rounded-lg p-8 my-8 text-center border-dashed border-primary/50 bg-primary/5">
            <h4 className="font-headline-md mb-2 text-foreground">{block.title}</h4>
            <p className="text-muted-foreground font-body-sm mb-6">Build the target circuit in the Circuit Builder.</p>
            <Button onClick={() => {
              updateFromCode(block.targetCircuit)
              navigate('/circuit-builder')
            }} variant="default" className="w-full sm:w-auto">
              {block.buttonText} <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )
      case 'keyTakeaways':
        return (
          <div key={index} className="my-8 p-6 rounded-lg bg-card border border-border">
            <h4 className="font-headline-md text-foreground mb-4">Key Takeaways</h4>
            <ul className="space-y-2">
              {block.points.map((pt, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-body-md text-foreground">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      case 'whyItMatters':
        return (
          <div key={index} className="my-8 p-6 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-headline-md text-primary mb-2">Why This Matters</h4>
            <p className="font-body-md text-foreground">{block.content}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-stack-xl px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <button 
          onClick={() => navigate('/research')}
          className="flex items-center text-sm font-code-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Learning
        </button>
        <Button variant="outline" size="sm" onClick={handleAskTutor} className="hidden sm:flex">
          <Bot className="h-4 w-4 mr-2 text-primary" /> Ask AI Tutor
        </Button>
      </div>

      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-label-caps uppercase text-primary tracking-wider">{currentModule.title}</span>
            <h1 className="font-display-lg-mobile md:font-display-lg m-0 mt-1 text-foreground">{currentLesson.title}</h1>
          </div>
          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-label-caps text-green-500 border border-green-500/50 px-2 py-0.5 rounded uppercase flex-shrink-0">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </span>
          )}
        </div>
        
        {currentLesson.objective && (
          <div className="bg-card/50 p-4 rounded-md border border-border">
            <p className="text-foreground font-body-md italic">{currentLesson.objective}</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <span className="text-sm font-label-caps text-muted-foreground">Lesson {lessonIndex} of {totalLessonsInCourse}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${(lessonIndex / totalLessonsInCourse) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {currentLesson.blocks ? (
          currentLesson.blocks.map((block, idx) => renderBlock(block, idx))
        ) : (
          <div className="prose prose-invert max-w-none font-body-md leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {currentLesson.content || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-border gap-4">
        {prevLesson ? (
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(`/research/lesson/${prevLesson!.id}`)}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
        ) : <div className="hidden sm:block" />}

        <Button 
          variant="outline" 
          onClick={handleAskTutor} 
          className="w-full sm:hidden"
        >
          <Bot className="h-4 w-4 mr-2 text-primary" /> Ask AI Tutor
        </Button>

        <Button 
          onClick={handleComplete} 
          className={`w-full sm:w-auto ${isCompleted ? 'bg-muted text-muted-foreground hover:bg-muted' : ''}`}
        >
          {isCompleted ? 'Review Lesson' : 'Mark Complete'} 
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
