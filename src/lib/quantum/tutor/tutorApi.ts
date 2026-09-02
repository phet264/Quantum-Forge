export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TutorContext {
  circuit_qasm?: string
  simulation_summary?: Record<string, any>
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
