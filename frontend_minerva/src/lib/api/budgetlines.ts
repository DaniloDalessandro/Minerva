import { authFetch } from "./authFetch"

// Interfaces para linhas orçamentárias
export interface BudgetLine {
  id: number
  budget: {
    id: number
    name: string
  }
  category: 'CAPEX' | 'OPEX'
  expense_type: 'Base Principal' | 'Serviços Especializados' | 'Despesas Compartilhadas'
  management_center: {
    id: number
    name: string
  }
  requesting_center: {
    id: number
    name: string
  }
  summary_description: string
  object: string
  budget_classification: 'NOVO' | 'RENOVAÇÃO' | 'CARY OVER' | 'REPLANEJAMENTO' | 'N/A'
  main_fiscal: {
    id: number
    full_name: string
    employee_id?: string
  } | null
  secondary_fiscal: {
    id: number
    full_name: string
    employee_id?: string
  } | null
  contract_type: 'SERVIÇO' | 'FORNECIMENTO' | 'ASSINATURA' | 'FORNECIMENTO/SERVIÇO'
  probable_procurement_type: 'LICITAÇÃO' | 'DISPENSA EM RAZÃO DO VALOR' | 'CONVÊNIO' | 'FUNDO FIXO' | 'INEXIGIBILIDADE' | 'ATA DE REGISTRO DE PREÇO' | 'ACORDO DE COOPERAÇÃO' | 'APOSTILAMENTO'
  budgeted_amount: string
  process_status: 'VENCIDO' | 'DENTRO DO PRAZO' | 'ELABORADO COM ATRASO' | 'ELABORADO NO PRAZO' | null
  contract_status: 'DENTRO DO PRAZO' | 'CONTRATADO NO PRAZO' | 'CONTRATADO COM ATRASO' | 'PRAZO VENCIDO' | 'LINHA TOTALMENTE REMANEJADA' | 'LINHA TOTALMENTE EXECUTADA' | 'LINHA DE PAGAMENTO' | 'LINHA PARCIALMENTE REMANEJADA' | 'LINHA PARCIALMENTE EXECUTADA' | 'N/A' | null
  contract_notes?: string
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

export interface BudgetLineMovement {
  id: number
  source_line?: number
  destination_line?: number
  movement_amount: number
  movement_notes?: string
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
}

export interface CreateBudgetLineData {
  id?: number
  budget: number
  category: 'CAPEX' | 'OPEX'
  expense_type: 'Base Principal' | 'Serviços Especializados' | 'Despesas Compartilhadas'
  management_center: number
  requesting_center: number
  summary_description: string
  object: string
  budget_classification: 'NOVO' | 'RENOVAÇÃO' | 'CARY OVER' | 'REPLANEJAMENTO' | 'N/A'
  main_fiscal?: number | null
  secondary_fiscal?: number | null
  contract_type: 'SERVIÇO' | 'FORNECIMENTO' | 'ASSINATURA' | 'FORNECIMENTO/SERVIÇO'
  probable_procurement_type: 'LICITAÇÃO' | 'DISPENSA EM RAZÃO DO VALOR' | 'CONVÊNIO' | 'FUNDO FIXO' | 'INEXIGIBILIDADE' | 'ATA DE REGISTRO DE PREÇO' | 'ACORDO DE COOPERAÇÃO' | 'APOSTILAMENTO'
  budgeted_amount: string
  process_status?: 'VENCIDO' | 'DENTRO DO PRAZO' | 'ELABORADO COM ATRASO' | 'ELABORADO NO PRAZO' | null
  contract_status?: 'DENTRO DO PRAZO' | 'CONTRATADO NO PRAZO' | 'CONTRATADO COM ATRASO' | 'PRAZO VENCIDO' | 'LINHA TOTALMENTE REMANEJADA' | 'LINHA TOTALMENTE EXECUTADA' | 'LINHA DE PAGAMENTO' | 'LINHA PARCIALMENTE REMANEJADA' | 'LINHA PARCIALMENTE EXECUTADA' | 'N/A' | null
  contract_notes?: string
}

export interface BudgetLinesResponse {
  count: number
  next: string | null
  previous: string | null
  results: BudgetLine[]
}

export interface CreateBudgetLineMovementData {
  source_line?: number
  destination_line?: number
  movement_amount: number
  movement_notes?: string
}

// Funções principais da API
export async function fetchBudgetLines(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = ""
): Promise<BudgetLinesResponse> {
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

  const response = await authFetch(`http://localhost:8000/api/v1/budgetline/budgetslines/?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch budget lines')
  }
  return response.json()
}

export async function fetchBudgetLineById(id: number): Promise<BudgetLine> {
  const response = await authFetch(`http://localhost:8000/api/v1/budgetline/budgetslines/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch budget line')
  }
  return response.json()
}

export async function createBudgetLine(data: CreateBudgetLineData) {
  const response = await authFetch('http://localhost:8000/api/v1/budgetline/budgetslines/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create budget line')
  }
  return response.json()
}

export async function updateBudgetLine(data: CreateBudgetLineData) {
  const response = await authFetch(`http://localhost:8000/api/v1/budgetline/budgetslines/${data.id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update budget line')
  }
  return response.json()
}

export async function deleteBudgetLine(id: number) {
  const response = await authFetch(`http://localhost:8000/api/v1/budgetline/budgetslines/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete budget line')
  }
  return response.json()
}

// Função para buscar orçamentos para o dropdown
export async function fetchBudgets(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/budget/budgets/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch budgets')
  }
  const data = await response.json()
  return data.results || data
}

// Função para buscar centros de gestão para o dropdown
export async function fetchManagementCenters(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/center/management-centers/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch management centers')
  }
  const data = await response.json()
  return data.results || data
}

// Função para buscar centros solicitantes para o dropdown
export async function fetchRequestingCenters(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/center/requesting-centers/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch requesting centers')
  }
  const data = await response.json()
  return data.results || data
}

// Função para buscar funcionários para o dropdown
export async function fetchEmployees(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/employee/employees/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch employees')
  }
  const data = await response.json()
  return data.results || data
}

// Legacy functions para compatibilidade
export async function getBudgetLines() {
  return fetchBudgetLines()
}

export async function getBudgetLine(id: number) {
  return fetchBudgetLineById(id)
}

// Budget Line Movements
export async function getBudgetLineMovements() {
  const response = await authFetch('/api/v1/budgetline/budgetlinemovements/')
  if (!response.ok) {
    throw new Error('Failed to fetch budget line movements')
  }
  return response.json()
}

export async function getBudgetLineMovement(id: number) {
  const response = await authFetch(`/api/v1/budgetline/budgetlinemovements/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch budget line movement')
  }
  return response.json()
}

export async function createBudgetLineMovement(data: CreateBudgetLineMovementData) {
  const response = await authFetch('/api/v1/budgetline/budgetlinemovements/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create budget line movement')
  }
  return response.json()
}

export async function updateBudgetLineMovement(id: number, data: Partial<CreateBudgetLineMovementData>) {
  const response = await authFetch(`/api/v1/budgetline/budgetlinemovements/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update budget line movement')
  }
  return response.json()
}

export async function deleteBudgetLineMovement(id: number) {
  const response = await authFetch(`/api/v1/budgetline/budgetlinemovements/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete budget line movement')
  }
  return response.json()
}