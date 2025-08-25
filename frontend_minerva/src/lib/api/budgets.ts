// /lib/api/budgets.ts

export interface Budget {
  id: number;
  year: number;
  category: 'CAPEX' | 'OPEX';
  management_center: {
    id: number;
    name: string;
  };
  total_amount: string;
  available_amount: string;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
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

const API_BASE_URL = "http://localhost:8000/api/v1/budget/budgets/";

export async function fetchBudgets(page = 1, pageSize = 10, search = "", ordering = "") {
  const token = localStorage.getItem("access");
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
  
  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar orçamentos");
  const json = await res.json();
  return json; // espera {results: [...], count: total, ...}
}

export async function fetchBudgetLines(budgetId: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`http://localhost:8000/api/v1/budgetline/budgetlines/?budget=${budgetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar linhas orçamentárias");
  return res.json();
}

export async function fetchContractsByBudgetLine(budgetLineId: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`http://localhost:8000/api/v1/contract/contracts/?budget_line=${budgetLineId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export async function createBudget(data: {
  year: number;
  category: 'CAPEX' | 'OPEX';
  management_center_id: number;
  total_amount: string;
  available_amount: string;
  status: 'ATIVO' | 'INATIVO';
}) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar orçamento");
  return res.json();
}

export async function updateBudget(data: {
  id: number;
  year: number;
  category: 'CAPEX' | 'OPEX';
  management_center_id: number;
  total_amount: string;
  available_amount: string;
  status: 'ATIVO' | 'INATIVO';
}) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      year: data.year,
      category: data.category,
      management_center_id: data.management_center_id,
      total_amount: data.total_amount,
      available_amount: data.available_amount,
      status: data.status,
    }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar orçamento");
  return res.json();
}

export async function deleteBudget(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar orçamento");
  return true;
}