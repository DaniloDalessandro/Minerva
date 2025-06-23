// api/budgets.ts

export interface Budget {
  id: string;
  orcamento: string;
  centro_custo: string;
  classe: "OPEX" | "CAPEX";
  valor_total: number;
  valor_utilizado: number;
  valor_restante: number;
  ano: number;
  status: "ATIVO" | "AGUARDANDO" | "FINALIZADO";
}

const BASE_URL = "http://localhost:8000"; // ajuste se estiver em prod

export async function fetchBudgets(): Promise<Budget[]> {
  const res = await fetch(`${BASE_URL}/budgets/`);
  if (!res.ok) throw new Error("Erro ao buscar orçamentos");
  return res.json();
}

export async function createBudget(data: Partial<Budget>): Promise<Budget> {
  const res = await fetch(`${BASE_URL}/budgets/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar orçamento");
  return res.json();
}

export async function updateBudget(id: string, data: Partial<Budget>): Promise<Budget> {
  const res = await fetch(`${BASE_URL}/budgets/${id}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar orçamento");
  return res.json();
}

export async function deleteBudget(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/budgets/${id}/delete/`, {
    method: "DELETE",
  });
  return res.ok;
}
