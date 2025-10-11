// /lib/api/coordinations.ts

import { authFetch } from "./authFetch";

export interface Coordination {
  id: number;
  name: string;
  is_active: boolean;
  management: number;
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
}

const API_BASE_URL = "http://localhost:8000/api/v1/sector/coordinations/";

export async function fetchCoordinations(page = 1, pageSize = 10, search = "", ordering = "", statusFilter = "") {
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

  if (statusFilter === "active") {
    params.append("is_active", "true");
  } else if (statusFilter === "inactive") {
    params.append("is_active", "false");
  }  const res = await authFetch(`${API_BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar coordenações");
  const json = await res.json();
  return json;
}

export async function createCoordination(data: { name: string, management_id: number }) {
  const res = await authFetch(`${API_BASE_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar coordenação");
  return res.json();
}


export async function updateCoordination(data: { id: number; name: string, management_id: number }) {
  const res = await authFetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    body: JSON.stringify({ name: data.name, management_id: data.management_id }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar coordenação");
  return res.json();
}

export async function deleteCoordination(id: number) {
  const res = await authFetch(`${API_BASE_URL}${id}/delete/`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Erro ao inativar coordenação");
  return res.json();
}