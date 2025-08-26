import { authFetch } from "./authFetch"

export interface Employee {
  id: number
  full_name: string
  email: string
  direction?: number
  management?: number
  coordination?: number
  cpf: string
  status: 'ATIVO' | 'INATIVO'
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
}

export interface CreateEmployeeData {
  full_name: string
  email: string
  direction?: number
  management?: number  
  coordination?: number
  cpf: string
  status: 'ATIVO' | 'INATIVO'
}

export async function getEmployees() {
  const response = await authFetch('/api/v1/employee/')
  if (!response.ok) {
    throw new Error('Failed to fetch employees')
  }
  return response.json()
}

export async function getEmployee(id: number) {
  const response = await authFetch(`/api/v1/employee/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch employee')
  }
  return response.json()
}

export async function createEmployee(data: CreateEmployeeData) {
  const response = await authFetch('/api/v1/employee/create/', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create employee')
  }
  return response.json()
}

export async function updateEmployee(id: number, data: Partial<CreateEmployeeData>) {
  const response = await authFetch(`/api/v1/employee/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to update employee')
  }
  return response.json()
}

export async function deleteEmployee(id: number) {
  const response = await authFetch(`/api/v1/employee/${id}/delete/`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete employee')
  }
  return response.json()
}