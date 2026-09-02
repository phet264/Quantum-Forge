/**
 * Boundary interface for the AI Tutor / Assistant.
 * Keeps UI components decoupled from OpenAI/Anthropic SDKs.
 */

export interface AiContext {
  currentRoute: string
  circuitId?: string
  studentProgress?: any // To be typed
  lastError?: string
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface AiTutorService {
  sendMessage: (message: string, context: AiContext) => Promise<AiMessage>
  getConversationHistory: (sessionId: string) => Promise<AiMessage[]>
}

export class MockAiTutor implements AiTutorService {
  async sendMessage(_message: string): Promise<AiMessage> {
    return {
      id: 'mock-1',
      role: 'assistant',
      content: 'AI features will be enabled in Phase 3.',
      timestamp: new Date().toISOString()
    }
  }

  async getConversationHistory(): Promise<AiMessage[]> {
    return []
  }
}
