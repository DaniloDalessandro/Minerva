// /lib/api/directions.ts

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
  if (!res.ok) throw new Error("Erro ao buscar direções");
  const json = await res.json();
  return json; // espera {results: [...], count: total, ...}
}

export async function createDirection(data: { name: string }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar direção");
  return res.json();
}


export async function updateDirection(data: { id: number; name: string }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: data.name }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar direção");
  return res.json();
}

export async function deleteDirection(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${API_BASE_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar direção");
  return true;
}
