// /lib/api/coordinations.ts

export interface Coordination {
  id: number;
  name: string;
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

export async function fetchCoordinations(page = 1, pageSize = 10, search = "", ordering = "") {
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
  if (!res.ok) throw new Error("Erro ao buscar coordenações");
  const json = await res.json();
  return json;
}

export async function createCoordination(data: { name: string, management: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar coordenação");
  return res.json();
}


export async function updateCoordination(data: { id: number; name: string, management: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: data.name, management: data.management }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar coordenação");
  return res.json();
}

export async function deleteCoordination(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar coordenação");
  return true;
}