export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TutorContext {
  circuit?: {
    numQubits: number
    depth: number
    operations: {
      type: string
      targets: number[]
      controls: number[]
      param?: string
      timeStep: number
    }[]
    qasm?: string
  }
  simulation?: {
    backend: string
    shots: number
    counts: Record<string, number>
    probabilities: Record<string, number>
    stateVector?: { real: number; imag: number }[]
  }
  assessment?: {
    assessment_title: string
    difficulty: string
    question_title: string
    question_type: string
    question_description: string
    student_answer: string
    correct_answer: string
    explanation: string
  }
  challenge?: {
    title: string
    description: string
    expected_result?: string
    student_result?: string
    score?: number
    mistakes?: string[]
  }
  learning_context?: string
  selected_qubit?: number
}

export interface TutorRequest {
  messages: TutorMessage[]
  context: TutorContext
}

export async function sendTutorMessage(req: TutorRequest): Promise<string> {
  const response = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })

  if (!response.ok) {
    let errDetail = `HTTP error! status: ${response.status}`
    try {
      const errData = await response.json()
      if (errData.detail) errDetail = errData.detail
    } catch (_) {}
    throw new Error(errDetail)
  }

  const data = await response.json()
  return data.reply
}
