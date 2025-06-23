// /lib/api/directions.ts

const API_BASE_URL = "http://localhost:8000/api/v1/sector/directions/";

export async function fetchDirections(page = 1, pageSize = 10) {
  const token = localStorage.getItem("access");
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
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
  const res = await fetch(API_BASE_URL, {
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
  const res = await fetch(`${API_BASE_URL}${data.id}/`, {
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
  const res = await fetch(`${API_BASE_URL}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar direção");
  return true;
}
