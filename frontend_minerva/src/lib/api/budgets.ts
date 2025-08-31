// /lib/api/budgets.ts

import { authFetch } from "./authFetch";

export interface Budget {
  id: number;
  year: number;
  category: 'CAPEX' | 'OPEX';
  management_center?: {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    created_by?: {
      id: number;
      email: string;
    };
    updated_by?: {
      id: number;
      email: string;
    };
  };
  management_center_id?: number;
  total_amount: string;
  available_amount: string;
  used_amount?: string;
  calculated_available_amount?: string;
  valor_remanejado_entrada?: string;
  valor_remanejado_saida?: string;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  updated_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  isOptimistic?: boolean; // Flag for optimistic updates
  budget_lines?: BudgetLineListItem[];
  budget_lines_summary?: BudgetLinesSummary;
}

export interface BudgetMovement {
  id: number;
  source: Budget;
  source_id?: number;
  destination: Budget;
  destination_id?: number;
  amount: string;
  movement_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  updated_by?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface CreateBudgetData {
  year: number;
  category: 'CAPEX' | 'OPEX';
  management_center_id: number;
  total_amount: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface CreateBudgetMovementData {
  source: number;
  destination: number;
  amount: string;
  notes?: string;
}

export interface BudgetLine {
  id: number;
  budget: number;
  category?: 'CAPEX' | 'OPEX';
  expense_type: string;
  management_center?: {
    id: number;
    name: string;
  };
  requesting_center?: {
    id: number;
    name: string;
  };
  summary_description?: string;
  object?: string;
  budget_classification?: string;
  main_fiscal?: {
    id: number;
    name: string;
  };
  secondary_fiscal?: {
    id: number;
    name: string;
  };
  contract_type?: string;
  probable_procurement_type: string;
  budgeted_amount: number;
  process_status?: string;
  contract_status?: string;
  contract_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  budget_line: number;
  protocol_number: string;
  signing_date?: string;
  expiration_date?: string;
  main_inspector: {
    id: number;
    name: string;
  };
  substitute_inspector: {
    id: number;
    name: string;
  };
  payment_nature: string;
  description: string;
  original_value: string;
  current_value: string;
  start_date: string;
  end_date?: string;
  status: 'ATIVO' | 'ENCERRADO';
  created_at: string;
  updated_at: string;
}

export interface BudgetLineListItem {
  id: number;
  summary_description: string;
  budgeted_amount: number;
  management_center_name: string;
  main_fiscal_name: string;
  current_version: number;
  total_versions: number;
  expense_type: string;
  contract_status: string;
  process_status: string;
}

export interface BudgetLinesSummary {
  total_lines: number;
  total_budgeted_amount: number;
  utilization_percentage: number;
  process_status_distribution: { [key: string]: number };
  contract_status_distribution: { [key: string]: number };
  expense_type_distribution: { [key: string]: number };
}

const API_BASE_URL = "http://localhost:8000/api/v1/budget/budgets/";
const MOVEMENTS_API_BASE_URL = "http://localhost:8000/api/v1/budget/movements/";

export async function fetchBudgets(page = 1, pageSize = 10, search = "", ordering = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  
  if (search) {
    params.append("search", search);
  }
  
  if (ordering) {
    params.append("ordering", ordering);
  }
  
  const res = await authFetch(`${API_BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar orçamentos");
  const json = await res.json();
  return json; // espera {results: [...], count: total, ...}
}

export async function fetchBudgetLines(budgetId: number) {
  const res = await authFetch(`http://localhost:8000/api/v1/budgetline/budgetlines/?budget=${budgetId}`);
  if (!res.ok) throw new Error("Erro ao buscar linhas orçamentárias");
  return res.json();
}

export async function fetchContractsByBudgetLine(budgetLineId: number) {
  const res = await authFetch(`http://localhost:8000/api/v1/contract/contracts/?budget_line=${budgetLineId}`);
  if (!res.ok) throw new Error("Erro ao buscar contratos");
  return res.json();
}

export async function fetchBudgetContracts(budgetId: number): Promise<Contract[]> {
  try {
    // First, get all budget lines for this budget
    const budgetLinesResponse = await fetchBudgetLines(budgetId);
    const budgetLines: BudgetLine[] = budgetLinesResponse.results || budgetLinesResponse;
    
    if (!budgetLines.length) {
      return [];
    }
    
    // Then, get all contracts for each budget line
    const contractPromises = budgetLines.map(budgetLine => 
      fetchContractsByBudgetLine(budgetLine.id)
    );
    
    const contractsResponses = await Promise.all(contractPromises);
    
    // Flatten all contracts into a single array
    const allContracts: Contract[] = [];
    contractsResponses.forEach(response => {
      const contracts = response.results || response;
      if (Array.isArray(contracts)) {
        allContracts.push(...contracts);
      }
    });
    
    return allContracts;
  } catch (error) {
    console.error("Erro ao buscar contratos do orçamento:", error);
    return [];
  }
}

export async function createBudget(data: CreateBudgetData) {
  const res = await authFetch(`${API_BASE_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar orçamento");
  return res.json();
}

export async function updateBudget(id: number, data: CreateBudgetData) {
  const res = await authFetch(`${API_BASE_URL}${id}/update/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar orçamento");
  return res.json();
}

export async function fetchBudgetById(id: number): Promise<Budget> {
  const res = await authFetch(`${API_BASE_URL}${id}/`);
  if (!res.ok) throw new Error("Erro ao buscar orçamento");
  return res.json();
}

export async function deleteBudget(id: number) {
  const res = await authFetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar orçamento");
  return true;
}

export async function getBudgetMovements() {
  const res = await authFetch(`${MOVEMENTS_API_BASE_URL}`);
  if (!res.ok) throw new Error("Erro ao buscar movimentações");
  return res.json();
}

export async function createBudgetMovement(data: CreateBudgetMovementData) {
  const res = await authFetch(`${MOVEMENTS_API_BASE_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar movimentação");
  return res.json();
}

export async function updateBudgetMovement(id: number, data: CreateBudgetMovementData) {
  const res = await authFetch(`${MOVEMENTS_API_BASE_URL}${id}/update/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar movimentação");
  return res.json();
}

export async function deleteBudgetMovement(id: number) {
  const res = await authFetch(`${MOVEMENTS_API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar movimentação");
  return true;
}

export async function getBudgetMovementsByBudget(budgetId: number) {
  // Get all movements and filter on the frontend for now
  const res = await authFetch(`${MOVEMENTS_API_BASE_URL}`);
  if (!res.ok) throw new Error("Erro ao buscar movimentações do orçamento");
  const data = await res.json();
  const movements = data.results || data;
  
  // Filter movements where this budget is either source or destination
  const filteredMovements = movements.filter((movement: BudgetMovement) => 
    movement.source?.id === budgetId || movement.destination?.id === budgetId
  );
  
  return filteredMovements;
}