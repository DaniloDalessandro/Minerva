import { authFetch } from "./authFetch"

// Interfaces for contracts
export interface Contract {
  id: number
  protocol_number: string
  budget_line: {
    id: number
    name: string
  }
  main_inspector: {
    id: number
    full_name: string
    employee_id?: string
  }
  substitute_inspector: {
    id: number
    full_name: string
    employee_id?: string
  }
  payment_nature: 'PAGAMENTO ÚNICO' | 'PAGAMENTO ANUAL' | 'PAGAMENTO SEMANAL' | 'PAGAMENTO MENSAL' | 'PAGAMENTO QUINZENAL' | 'PAGAMENTO TRIMESTRAL' | 'PAGAMENTO SEMESTRAL' | 'PAGAMENTO SOB DEMANDA'
  description: string
  original_value: string
  current_value: string
  start_date: string
  end_date?: string
  signing_date?: string
  expiration_date?: string
  status: 'ATIVO' | 'ENCERRADO'
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

export interface CreateContractData {
  id?: number
  budget_line: number
  main_inspector: number
  substitute_inspector: number
  payment_nature: 'PAGAMENTO ÚNICO' | 'PAGAMENTO ANUAL' | 'PAGAMENTO SEMANAL' | 'PAGAMENTO MENSAL' | 'PAGAMENTO QUINZENAL' | 'PAGAMENTO TRIMESTRAL' | 'PAGAMENTO SEMESTRAL' | 'PAGAMENTO SOB DEMANDA'
  description: string
  original_value: string
  current_value: string
  start_date: string
  end_date?: string
  signing_date?: string
  expiration_date?: string
  status: 'ATIVO' | 'ENCERRADO'
}

export interface ContractsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Contract[]
}

// Contract Installment interface
export interface ContractInstallment {
  id: number
  contract: number
  number: number
  value: string
  due_date: string
  payment_date?: string
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO'
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
}

// Contract Amendment interface
export interface ContractAmendment {
  id: number
  contract: number
  description: string
  type: 'Acréscimo de Valor' | 'Redução de Valor' | 'Prorrogação de Prazo'
  value: string
  additional_term?: string
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
}

// Main Contract API functions
export async function fetchContracts(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = ""
): Promise<ContractsResponse> {
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

  const response = await authFetch(`http://localhost:8000/api/v1/contract/contracts/?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch contracts')
  }
  return response.json()
}

export async function fetchContractById(id: number): Promise<Contract> {
  const response = await authFetch(`http://localhost:8000/api/v1/contract/contracts/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch contract')
  }
  return response.json()
}

export async function createContract(data: CreateContractData) {
  const response = await authFetch('http://localhost:8000/api/v1/contract/contracts/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create contract')
  }
  return response.json()
}

export async function updateContract(data: CreateContractData) {
  const response = await authFetch(`http://localhost:8000/api/v1/contract/contracts/${data.id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update contract')
  }
  return response.json()
}

export async function deleteContract(id: number) {
  const response = await authFetch(`http://localhost:8000/api/v1/contract/contracts/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete contract')
  }
  return response.json()
}

// Function to fetch employees for dropdowns
export async function fetchEmployees(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/employee/employees/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch employees')
  }
  const data = await response.json()
  return data.results || data
}

// Function to fetch budget lines for dropdowns
export async function fetchBudgetLines(): Promise<any[]> {
  const response = await authFetch('http://localhost:8000/api/v1/budgetline/budgetlines/?page_size=1000')
  if (!response.ok) {
    throw new Error('Failed to fetch budget lines')
  }
  const data = await response.json()
  return data.results || data
}

// Legacy functions for compatibility
export async function getContracts() {
  return fetchContracts()
}

export async function getContract(id: number) {
  return fetchContractById(id)
}