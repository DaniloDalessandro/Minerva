import { authFetch } from './authFetch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ChangePasswordData {
  old_password: string
  new_password: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface ApiError {
  error: string
}

export async function changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
  const response = await authFetch(`${API_URL}/accounts/change-password/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Erro ao alterar senha')
  }

  return response.json()
}

export async function logout(): Promise<void> {
  try {
    await authFetch(`${API_URL}/accounts/logout/`, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    // Sempre limpar dados locais, mesmo se a chamada falhar
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    
    // Remover cookie
    document.cookie = 'access=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }
}