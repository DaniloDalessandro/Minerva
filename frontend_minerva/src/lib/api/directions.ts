// /lib/api/directions.ts

import { authFetch } from "./authFetch";

export interface Direction {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
}

const API_BASE_URL = "http://localhost:8000/api/v1/sector/directions/";

export async function fetchDirections(page = 1, pageSize = 10, search = "", ordering = "") {
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
  if (!res.ok) throw new Error("Erro ao buscar direções");
  const json = await res.json();
  return json; // espera {results: [...], count: total, ...}
}

export async function createDirection(data: { name: string }) {
  const res = await authFetch(`${API_BASE_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar direção");
  return res.json();
}


export async function updateDirection(data: { id: number; name: string }) {
  const res = await authFetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    body: JSON.stringify({ name: data.name }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar direção");
  return res.json();
}

export async function deleteDirection(id: number) {
  const res = await authFetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar direção");
  return true;
}
