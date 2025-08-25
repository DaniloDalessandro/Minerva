// /lib/api/managements.ts

export interface Management {
  id: number;
  name: string;
  direction: number;
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
}

const API_BASE_URL = "http://localhost:8000/api/v1/sector/managements/";

export async function fetchManagements(page = 1, pageSize = 10, search = "", ordering = "") {
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
  if (!res.ok) throw new Error("Erro ao buscar gerências");
  const json = await res.json();
  return json;
}

export async function createManagement(data: { name: string, direction_id: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar gerência");
  return res.json();
}


export async function updateManagement(data: { id: number; name: string, direction_id: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: data.name, direction_id: data.direction_id }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar gerência");
  return res.json();
}

export async function deleteManagement(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar gerência");
  return true;
}