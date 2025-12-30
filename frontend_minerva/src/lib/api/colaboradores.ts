import { authFetch } from "./authFetch"
import { API_URL } from "./config"

// Interfaces para colaboradores
export interface Colaborador {
  id: number
  full_name: string
  email: string
  cpf: string
  phone?: string
  birth_date?: string
  employee_id?: string
  position?: string
  department?: string
  admission_date?: string
  street?: string
  city?: string
  state?: string
  postal_code?: string
  direction?: {
    id: number
    name: string
  }
  management?: {
    id: number
    name: string
    direction: number
  }
  coordination?: {
    id: number
    name: string
    management: number
  }
  bank_name?: string
  bank_agency?: string
  bank_account?: string
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO'
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

export interface CreateColaboradorData {
  id?: number
  full_name: string
  email: string
  cpf: string
  phone?: string
  birth_date?: string
  employee_id?: string
  position?: string
  department?: string
  admission_date?: string
  street?: string
  city?: string
  state?: string
  postal_code?: string
  direction?: number
  management?: number  
  coordination?: number
  bank_name?: string
  bank_agency?: string
  bank_account?: string
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO'
}

export interface ColaboradoresResponse {
  count: number
  next: string | null
  previous: string | null
  results: Colaborador[]
}

// Interface para contratos do colaborador
export interface ColaboradorContrato {
  id: number
  contract_protocol: string
  role: 'FISCAL_PRINCIPAL' | 'FISCAL_SUBSTITUTO'
  start_date?: string
  end_date?: string
  notes?: string
  status: 'ATIVO' | 'INATIVO'
  created_at: string
  updated_at: string
}

// Interface para auxílios do colaborador
export interface ColaboradorAuxilio {
  id: number
  type: 'GRADUACAO' | 'POS_GRADUACAO' | 'AUXILIO_CRECHE_ESCOLA' | 'LINGUA_ESTRANGEIRA' | 'CAPACITACAO_TECNICA' | 'AUXILIO_ALIMENTACAO' | 'AUXILIO_TRANSPORTE' | 'PLANO_SAUDE' | 'OUTROS'
  description?: string
  total_amount: string
  monthly_amount?: string
  start_date: string
  end_date?: string
  payment_frequency: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'PAGAMENTO_UNICO'
  installment_count?: number
  institution_name?: string
  course_name?: string
  status: 'AGUARDANDO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'SUSPENSO'
  notes?: string
  budget_line?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

// Funções principais da API
export async function fetchColaboradores(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = "",
  status: string = "ATIVO"
): Promise<ColaboradoresResponse> {
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

  if (status) {
    params.append('status', status)
  }

  const url = `${API_URL}/api/v1/employee/?${params}`;
  console.log("👥 Buscando colaboradores:", url);
  
  const response = await authFetch(url)
  console.log("📡 Resposta API colaboradores:", response.status);
  
  if (!response.ok) {
    console.error("❌ Erro na resposta:", response.status, response.statusText);
    throw new Error(`Erro ao buscar colaboradores: ${response.status}`)
  }

  const data = await response.json()
  console.log("📊 Dados colaboradores recebidos:", {
    count: data.count,
    results: data.results?.length || 0,
    firstResult: data.results?.[0] ? {
      id: data.results[0].id,
      name: data.results[0].full_name,
      email: data.results[0].email
    } : null
  });

  return data
}

export async function fetchColaboradorById(id: number): Promise<Colaborador> {
  const response = await authFetch(`${API_URL}/api/v1/employee/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch colaborador')
  }
  return response.json()
}

export async function createColaborador(data: CreateColaboradorData) {
  const response = await authFetch(`${API_URL}/api/v1/employee/create/`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create colaborador')
  }
  return response.json()
}

export async function updateColaborador(data: CreateColaboradorData) {
  const response = await authFetch(`${API_URL}/api/v1/employee/${data.id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update colaborador')
  }
  return response.json()
}

export async function toggleColaboradorStatus(id: number) {
  const response = await authFetch(`${API_URL}/api/v1/employee/${id}/toggle-status/`, {
    method: 'PATCH'
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to toggle colaborador status')
  }
  return response.json()
}



// Funções para contratos do colaborador
export async function fetchColaboradorContratos(colaboradorId: number): Promise<ColaboradorContrato[]> {
  const response = await authFetch(`${API_URL}/api/v1/employee/contracts/?employee=${colaboradorId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch colaborador contracts')
  }
  const data = await response.json()
  return data.results || data
}

// Funções para auxílios do colaborador
export async function fetchColaboradorAuxilios(colaboradorId: number): Promise<ColaboradorAuxilio[]> {
  const response = await authFetch(`${API_URL}/api/v1/employee/aids/?employee=${colaboradorId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch colaborador aids')
  }
  const data = await response.json()
  return data.results || data
}

// Legacy functions para compatibilidade
export async function getColaboradores() {
  return fetchColaboradores()
}

export async function getColaborador(id: number) {
  return fetchColaboradorById(id)
}

// Função para buscar setores para os dropdowns
export async function fetchDirections(): Promise<any[]> {
  console.log("🎯 Buscando direções para colaborador...");
  const url = `${API_URL}/api/v1/sector/directions/?page_size=1000&ordering=name`;
  const response = await authFetch(url)
  console.log("📡 Resposta direções colaborador:", response.status);
  
  if (!response.ok) {
    throw new Error('Failed to fetch directions')
  }
  const data = await response.json()
  console.log("📊 Direções colaborador encontradas:", data.results?.length || 0);
  return data.results || data
}

export async function fetchManagements(): Promise<any[]> {
  console.log("🏢 Buscando gerências para colaborador...");
  const url = `${API_URL}/api/v1/sector/managements/?page_size=1000&ordering=name`;
  const response = await authFetch(url)
  console.log("📡 Resposta gerências colaborador:", response.status);
  
  if (!response.ok) {
    throw new Error('Failed to fetch managements')
  }
  const data = await response.json()
  console.log("📊 Gerências colaborador encontradas:", data.results?.length || 0);
  return data.results || data
}

export async function fetchCoordinations(): Promise<any[]> {
  console.log("🎯 Buscando coordenações para colaborador...");
  const url = `${API_URL}/api/v1/sector/coordinations/?page_size=1000&ordering=name`;
  const response = await authFetch(url)
  console.log("📡 Resposta coordenações colaborador:", response.status);
  
  if (!response.ok) {
    throw new Error('Failed to fetch coordinations')
  }
  const data = await response.json()
  console.log("📊 Coordenações colaborador encontradas:", data.results?.length || 0);
  return data.results || data
}