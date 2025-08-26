import { authFetch } from "./authFetch"

export interface Assistance {
  id: number
  employee: number
  budget_line: number
  type?: 'GRADUACAO' | 'POS_GRADUACAO' | 'AUXILIO_CHECHE_ESCOLA' | 'LINGUA_ESTRANGEIRA'
  total_amount: string
  installment_count?: number
  amount_per_installment?: string
  start_date: string
  end_date?: string
  notes?: string
  status: 'AGUARDANDO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO'
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface CreateAssistanceData {
  employee: number
  budget_line: number
  type?: 'GRADUACAO' | 'POS_GRADUACAO' | 'AUXILIO_CHECHE_ESCOLA' | 'LINGUA_ESTRANGEIRA'
  total_amount: string
  installment_count?: number
  amount_per_installment?: string
  start_date: string
  end_date?: string
  notes?: string
  status: 'AGUARDANDO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO'
}

export async function getAssistances() {
  const response = await authFetch('/api/v1/aid/aid/')
  if (!response.ok) {
    throw new Error('Failed to fetch assistances')
  }
  return response.json()
}

export async function getAssistance(id: number) {
  const response = await authFetch(`/api/v1/aid/aid/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch assistance')
  }
  return response.json()
}

export async function createAssistance(data: CreateAssistanceData) {
  const response = await authFetch('/api/v1/aid/aid/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create assistance')
  }
  return response.json()
}

export async function updateAssistance(id: number, data: Partial<CreateAssistanceData>) {
  const response = await authFetch(`/api/v1/aid/aid/update/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update assistance')
  }
  return response.json()
}

export async function deleteAssistance(id: number) {
  const response = await authFetch(`/api/v1/aid/aid/delete/${id}/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete assistance')
  }
  return response.json()
}