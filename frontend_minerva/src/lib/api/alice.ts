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
    return authFetch<ChatResponse>('/api/v1/alice/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },

  // Pergunta rápida sem sessão
  quickQuestion: async (data: QuickQuestionRequest): Promise<Omit<ChatResponse, 'session_id'>> => {
    return authFetch('/api/v1/alice/quick/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },

  // Obtém estatísticas do uso do Alice
  getStats: async (): Promise<SessionStats> => {
    return authFetch<SessionStats>('/api/v1/alice/stats/')
  },

  // Lista sessões de conversa do usuário
  getSessions: async (): Promise<{ results: ConversationSession[] }> => {
    return authFetch('/api/v1/alice/sessions/')
  },

  // Obtém detalhes de uma sessão específica
  getSessionDetail: async (sessionId: number): Promise<ConversationSession & { messages: any[] }> => {
    return authFetch(`/api/v1/alice/sessions/${sessionId}/`)
  },

  // Envia mensagem para uma sessão específica
  sendMessageToSession: async (sessionId: number, message: string): Promise<ChatResponse> => {
    return authFetch<ChatResponse>(`/api/v1/alice/sessions/${sessionId}/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
  },

  // Limpa mensagens de uma sessão
  clearSession: async (sessionId: number): Promise<{ success: boolean; message: string }> => {
    return authFetch(`/api/v1/alice/sessions/${sessionId}/clear/`, {
      method: 'POST',
    })
  },

  // Lista tabelas disponíveis no banco
  getAvailableTables: async (): Promise<string[]> => {
    return authFetch('/api/v1/alice/schema/tables/')
  },

  // Obtém esquema completo do banco
  getDatabaseSchema: async (): Promise<any[]> => {
    return authFetch('/api/v1/alice/schema/')
  }
}