export interface Coordination {
  id?: number;
  name: string;
  management: number; // ID da gerência vinculada
  management_name?: string; // opcional para exibir no frontend
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

const baseUrl = "/api/coordinations";

export async function fetchCoordinations(): Promise<Coordination[]> {
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error("Erro ao buscar coordenações");
  return res.json();
}

export async function createCoordination(data: Coordination): Promise<Coordination> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar coordenação");
  return res.json();
}

export async function updateCoordination(data: Coordination): Promise<Coordination> {
  if (!data.id) throw new Error("ID obrigatório para atualizar");
  const res = await fetch(`${baseUrl}/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar coordenação");
  return res.json();
}

export async function deleteCoordination(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir coordenação");
}
