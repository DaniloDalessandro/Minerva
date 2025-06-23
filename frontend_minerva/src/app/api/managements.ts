export interface Management {
  id?: number;
  name: string;
  direction: number; // ID da direção vinculada
  direction_name?: string; // opcional para exibir no frontend
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

const baseUrl = "/api/managements";

export async function fetchManagements(): Promise<Management[]> {
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error("Erro ao buscar gerências");
  return res.json();
}

export async function createManagement(data: Management): Promise<Management> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar gerência");
  return res.json();
}

export async function updateManagement(data: Management): Promise<Management> {
  if (!data.id) throw new Error("ID obrigatório para atualizar");
  const res = await fetch(`${baseUrl}/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar gerência");
  return res.json();
}

export async function deleteManagement(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir gerência");
}
