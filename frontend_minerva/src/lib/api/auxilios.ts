import { authFetch } from "./authFetch"

// Interfaces para auxílios
export interface Auxilio {
  id: number
  employee: {
    id: number
    full_name: string
    employee_id?: string
  }
  budget_line: {
    id: number
    name: string
  }
  type: 'GRADUACAO' | 'POS_GRADUACAO' | 'AUXILIO_CRECHE_ESCOLA' | 'LINGUA_ESTRANGEIRA'
  total_amount: string
  installment_count: number
  amount_per_installment: string
  start_date: string
  end_date: string
  status: 'AGUARDANDO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO'
  notes?: string
  created_at: string
  updated_at: string
  created_by: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  } | null
  updated_by: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  } | null
  isOptimistic?: boolean
}

export interface CreateAuxilioData {
  id?: number
  employee: number
  budget_line: number
  type: 'GRADUACAO' | 'POS_GRADUACAO' | 'AUXILIO_CRECHE_ESCOLA' | 'LINGUA_ESTRANGEIRA'
  total_amount: string
  installment_count: number
  amount_per_installment: string
  start_date: string
  end_date: string
  status: 'AGUARDANDO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO'
  notes?: string
}

export interface AuxiliosResponse {
  count: number
  next: string | null
  previous: string | null
  results: Auxilio[]
}

// Funções principais da API
export async function fetchAuxilios(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = ""
): Promise<AuxiliosResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  })
  
  if (search) {
    params.append('search', search)
  }
  
  if (ordering) {
    params.append('ordering', ordering)
  }

  const response = await authFetch(`http://localhost:8000/api/v1/aid/aid/?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch auxilios')
  }
  return response.json()
}

export async function fetchAuxilioById(id: number): Promise<Auxilio> {
  const response = await authFetch(`http://localhost:8000/api/v1/aid/aid/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch auxilio')
  }
  return response.json()
}

export async function createAuxilio(data: CreateAuxilioData) {
  const response = await authFetch('http://localhost:8000/api/v1/aid/aid/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create auxilio')
  }
  return response.json()
}

export async function updateAuxilio(data: CreateAuxilioData) {
  const response = await authFetch(`http://localhost:8000/api/v1/aid/aid/update/${data.id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update auxilio')
  }
  return response.json()
}

export async function deleteAuxilio(id: number) {
  const response = await authFetch(`http://localhost:8000/api/v1/aid/aid/delete/${id}/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete auxilio')
  }
  return response.json()
}

// Função para buscar colaboradores para o dropdown
export async function fetchColaboradores(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/employee/employees/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch colaboradores')
  }
  const data = await response.json()
  return data.results || data
}

// Função para buscar linhas orçamentárias para o dropdown
export async function fetchBudgetLines(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/budgetline/budgetlines/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch budget lines')
  }
  const data = await response.json()
  return data.results || data
}

// Legacy functions para compatibilidade
export async function getAuxilios() {
  return fetchAuxilios()
}

export async function getAuxilio(id: number) {
  return fetchAuxilioById(id)
}