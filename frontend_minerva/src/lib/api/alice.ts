import { authFetch } from './authFetch'

export interface ChatMessage {
  message: string
  session_id?: string
  create_new_session?: boolean
}

export interface ChatResponse {
  success: boolean
  session_id: string
  response: string
  sql_query?: string
  data?: any[]
  execution_time_ms?: number
  result_count?: number
  error?: string
  metadata?: any
}

export interface QuickQuestionRequest {
  question: string
}

export interface SessionStats {
  total_sessions: number
  active_sessions: number
  total_messages: number
  total_queries: number
  successful_queries: number
  average_response_time: number
  most_active_user: string
  popular_questions: Array<{
    user_question: string
    count: number
  }>
}

export interface ConversationSession {
  id: number
  session_id: string
  title: string
  created_at: string
  updated_at: string
  is_active: boolean
  message_count: number
}

export const aliceAPI = {
  // Envia mensagem para o chat
  sendMessage: async (data: ChatMessage): Promise<ChatResponse> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to send message')
    }
    return response.json()
  },

  // Pergunta rápida sem sessão
  quickQuestion: async (data: QuickQuestionRequest): Promise<Omit<ChatResponse, 'session_id'>> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/quick/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to send quick question')
    }
    return response.json()
  },

  // Obtém estatísticas do uso do Alice
  getStats: async (): Promise<SessionStats> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/stats/')
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    return response.json()
  },

  // Lista sessões de conversa do usuário
  getSessions: async (): Promise<{ results: ConversationSession[] }> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/sessions/')
    if (!response.ok) {
      throw new Error('Failed to fetch sessions')
    }
    return response.json()
  },

  // Obtém detalhes de uma sessão específica
  getSessionDetail: async (sessionId: number): Promise<ConversationSession & { messages: any[] }> => {
    const response = await authFetch(`http://localhost:8000/api/v1/alice/sessions/${sessionId}/`)
    if (!response.ok) {
      throw new Error('Failed to fetch session detail')
    }
    return response.json()
  },

  // Envia mensagem para uma sessão específica
  sendMessageToSession: async (sessionId: number, message: string): Promise<ChatResponse> => {
    const response = await authFetch(`http://localhost:8000/api/v1/alice/sessions/${sessionId}/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    if (!response.ok) {
      throw new Error('Failed to send message to session')
    }
    return response.json()
  },

  // Limpa mensagens de uma sessão
  clearSession: async (sessionId: number): Promise<{ success: boolean; message: string }> => {
    const response = await authFetch(`http://localhost:8000/api/v1/alice/sessions/${sessionId}/clear/`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to clear session')
    }
    return response.json()
  },

  // Lista tabelas disponíveis no banco
  getAvailableTables: async (): Promise<string[]> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/schema/tables/')
    if (!response.ok) {
      throw new Error('Failed to fetch available tables')
    }
    return response.json()
  },

  // Obtém esquema completo do banco
  getDatabaseSchema: async (): Promise<any[]> => {
    const response = await authFetch('http://localhost:8000/api/v1/alice/schema/')
    if (!response.ok) {
      throw new Error('Failed to fetch database schema')
    }
    return response.json()
  }
}