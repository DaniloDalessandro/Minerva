import { authFetch } from "./authFetch"

export interface Contract {
  id: number
  budget_line: number
  protocol_number: string
  signing_date?: string
  expiration_date?: string
  main_inspector: number
  substitute_inspector: number
  payment_nature: 'PAGAMENTO ÚNICO' | 'PAGAMENTO ANUAL' | 'PAGAMENTO SEMANAL' | 'PAGAMENTO MENSAL' | 'PAGAMENTO QUIZENAL' | 'PAGAMENTO TRIMESTRAL' | 'PAGAMENTO SEMESTRAL' | 'PAGAMENTO SOB DEMANDA'
  description: string
  original_value: string
  current_value: string
  start_date: string
  end_date?: string
  status: 'ATIVO' | 'ENCERRADO'
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

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
  created_by: number
  updated_by: number
}

export interface ContractAmendment {
  id: number
  contract: number
  description: string
  type: 'Acréscimo de Valor' | 'Redução de Valor' | 'Prorrogação de Prazo'
  value: string
  additional_term?: string
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface CreateContractData {
  budget_line: number
  signing_date?: string
  expiration_date?: string
  main_inspector: number
  substitute_inspector: number
  payment_nature: 'PAGAMENTO ÚNICO' | 'PAGAMENTO ANUAL' | 'PAGAMENTO SEMANAL' | 'PAGAMENTO MENSAL' | 'PAGAMENTO QUIZENAL' | 'PAGAMENTO TRIMESTRAL' | 'PAGAMENTO SEMESTRAL' | 'PAGAMENTO SOB DEMANDA'
  description: string
  original_value: string
  current_value: string
  start_date: string
  end_date?: string
  status: 'ATIVO' | 'ENCERRADO'
}

export interface CreateContractInstallmentData {
  contract: number
  number: number
  value: string
  due_date: string
  payment_date?: string
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO'
  notes?: string
}

export interface CreateContractAmendmentData {
  contract: number
  description: string
  type: 'Acréscimo de Valor' | 'Redução de Valor' | 'Prorrogação de Prazo'
  value: string
  additional_term?: string
}

// Contracts
export async function getContracts() {
  const response = await authFetch('/api/v1/contract/contracts/')
  if (!response.ok) {
    throw new Error('Failed to fetch contracts')
  }
  return response.json()
}

export async function getContract(id: number) {
  const response = await authFetch(`/api/v1/contract/contracts/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch contract')
  }
  return response.json()
}

export async function createContract(data: CreateContractData) {
  const response = await authFetch('/api/v1/contract/contracts/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create contract')
  }
  return response.json()
}

export async function updateContract(id: number, data: Partial<CreateContractData>) {
  const response = await authFetch(`/api/v1/contract/contracts/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update contract')
  }
  return response.json()
}

export async function deleteContract(id: number) {
  const response = await authFetch(`/api/v1/contract/contracts/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete contract')
  }
  return response.json()
}

// Contract Installments
export async function getContractInstallments() {
  const response = await authFetch('/api/v1/contract/contract-installments/')
  if (!response.ok) {
    throw new Error('Failed to fetch contract installments')
  }
  return response.json()
}

export async function getContractInstallment(id: number) {
  const response = await authFetch(`/api/v1/contract/contract-installments/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch contract installment')
  }
  return response.json()
}

export async function createContractInstallment(data: CreateContractInstallmentData) {
  const response = await authFetch('/api/v1/contract/contract-installments/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create contract installment')
  }
  return response.json()
}

export async function updateContractInstallment(id: number, data: Partial<CreateContractInstallmentData>) {
  const response = await authFetch(`/api/v1/contract/contract-installments/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update contract installment')
  }
  return response.json()
}

export async function deleteContractInstallment(id: number) {
  const response = await authFetch(`/api/v1/contract/contract-installments/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete contract installment')
  }
  return response.json()
}

// Contract Amendments
export async function getContractAmendments() {
  const response = await authFetch('/api/v1/contract/contract-amendments/')
  if (!response.ok) {
    throw new Error('Failed to fetch contract amendments')
  }
  return response.json()
}

export async function getContractAmendment(id: number) {
  const response = await authFetch(`/api/v1/contract/contract-amendments/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch contract amendment')
  }
  return response.json()
}

export async function createContractAmendment(data: CreateContractAmendmentData) {
  const response = await authFetch('/api/v1/contract/contract-amendments/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create contract amendment')
  }
  return response.json()
}

export async function updateContractAmendment(id: number, data: Partial<CreateContractAmendmentData>) {
  const response = await authFetch(`/api/v1/contract/contract-amendments/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update contract amendment')
  }
  return response.json()
}

export async function deleteContractAmendment(id: number) {
  const response = await authFetch(`/api/v1/contract/contract-amendments/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete contract amendment')
  }
  return response.json()
}