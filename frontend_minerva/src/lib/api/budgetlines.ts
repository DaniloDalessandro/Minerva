import { authFetch } from "./authFetch"

export interface BudgetLine {
  id: number
  budget: number
  category?: 'CAPEX' | 'OPEX'
  expense_type: 'Base Principal' | 'Serviços Especializados' | 'Despesas Compartilhadas'
  management_center?: number
  requesting_center?: number
  summary_description?: string
  object?: string
  budget_classification?: 'NOVO' | 'RENOVAÇÃO' | 'CARY OVER' | 'REPLANEJAMENTO' | 'N/A'
  main_fiscal?: number
  secondary_fiscal?: number
  contract_type?: 'SERVIÇO' | 'FORNECIMENTO' | 'ASSINATURA' | 'FORNECIMENTO/SERVIÇO'
  probable_procurement_type: 'LICITAÇÃO' | 'DISPENSA EM RAZÃO DO VALOR' | 'CONVÊNIO' | 'FUNDO FIXO' | 'INEXIGIBILIDADE' | 'ATA DE REGISTRO DE PREÇO' | 'ACORDO DE COOPERAÇÃO' | 'APOSTILAMENTO'
  budgeted_amount: number
  process_status?: 'VENCIDO' | 'DENTRO DO PRAZO' | 'ELABORADO COM ATRASO' | 'ELABORADO NO PRAZO'
  contract_status?: 'DENTRO DO PRAZO' | 'CONTRATADO NO PRAZO' | 'CONTRATADO COM ATRASO' | 'PRAZO VENCIDO' | 'LINHA TOTALMENTE REMANEJADA' | 'LINHA TOTALMENTE EXECUTADA' | 'LINHA DE PAGAMENTO' | 'LINHA PARCIALMENTE REMANEJADA' | 'LINHA PARCIALMENTE EXECUTADA' | 'N/A'
  contract_notes?: string
  created_at: string
  updated_at: string
  created_by?: number
  updated_by?: number
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
  budget: number
  category?: 'CAPEX' | 'OPEX'
  expense_type: 'Base Principal' | 'Serviços Especializados' | 'Despesas Compartilhadas'
  management_center?: number
  requesting_center?: number
  summary_description?: string
  object?: string
  budget_classification?: 'NOVO' | 'RENOVAÇÃO' | 'CARY OVER' | 'REPLANEJAMENTO' | 'N/A'
  main_fiscal?: number
  secondary_fiscal?: number
  contract_type?: 'SERVIÇO' | 'FORNECIMENTO' | 'ASSINATURA' | 'FORNECIMENTO/SERVIÇO'
  probable_procurement_type: 'LICITAÇÃO' | 'DISPENSA EM RAZÃO DO VALOR' | 'CONVÊNIO' | 'FUNDO FIXO' | 'INEXIGIBILIDADE' | 'ATA DE REGISTRO DE PREÇO' | 'ACORDO DE COOPERAÇÃO' | 'APOSTILAMENTO'
  budgeted_amount: number
  process_status?: 'VENCIDO' | 'DENTRO DO PRAZO' | 'ELABORADO COM ATRASO' | 'ELABORADO NO PRAZO'
  contract_status?: 'DENTRO DO PRAZO' | 'CONTRATADO NO PRAZO' | 'CONTRATADO COM ATRASO' | 'PRAZO VENCIDO' | 'LINHA TOTALMENTE REMANEJADA' | 'LINHA TOTALMENTE EXECUTADA' | 'LINHA DE PAGAMENTO' | 'LINHA PARCIALMENTE REMANEJADA' | 'LINHA PARCIALMENTE EXECUTADA' | 'N/A'
  contract_notes?: string
}

export interface CreateBudgetLineMovementData {
  source_line?: number
  destination_line?: number
  movement_amount: number
  movement_notes?: string
}

// Budget Lines
export async function getBudgetLines() {
  const response = await authFetch('/api/v1/budgetline/budgetslines/')
  if (!response.ok) {
    throw new Error('Failed to fetch budget lines')
  }
  return response.json()
}

export async function getBudgetLine(id: number) {
  const response = await authFetch(`/api/v1/budgetline/budgetslines/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch budget line')
  }
  return response.json()
}

export async function createBudgetLine(data: CreateBudgetLineData) {
  const response = await authFetch('/api/v1/budgetline/budgetslines/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create budget line')
  }
  return response.json()
}

export async function updateBudgetLine(id: number, data: Partial<CreateBudgetLineData>) {
  const response = await authFetch(`/api/v1/budgetline/budgetslines/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update budget line')
  }
  return response.json()
}

export async function deleteBudgetLine(id: number) {
  const response = await authFetch(`/api/v1/budgetline/budgetslines/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete budget line')
  }
  return response.json()
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