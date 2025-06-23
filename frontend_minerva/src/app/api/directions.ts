export interface Direction {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

const baseUrl = "http://localhost:8000/api/v1/sector/directions/";

export async function fetchDirections(): Promise<Direction[]> {
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error("Erro ao buscar direções");
  return await res.json();
}

export async function createDirection(data: Direction): Promise<Direction> {
  const { id, ...payload } = data;
  const res = await fetch(`${baseUrl}create/`, {
    method: "POST",
    headers: getAuthHeaders(), // deve retornar { Authorization: "Bearer <token>" }
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao criar direção");
  return await res.json();
}


export async function updateDirection(data: Direction): Promise<Direction> {
  if (!data.id) throw new Error("ID obrigatório para atualizar");
  const res = await fetch(`${baseUrl}${data.id}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar direção");
  return res.json();
}

export async function deleteDirection(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir direção");
}
