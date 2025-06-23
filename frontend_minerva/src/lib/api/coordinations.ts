export interface Coordination {
  id: string;
  name: string;
  management: string; // ID da gerência
}

const BASE_URL = "/coordinations/";

export async function fetchCoordinations(): Promise<Coordination[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao buscar coordenações");
  return res.json();
}

export async function createCoordination(data: Coordination): Promise<Coordination> {
  const res = await fetch(`${BASE_URL}create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar coordenação");
  return res.json();
}

export async function updateCoordination(data: Coordination): Promise<Coordination> {
  const res = await fetch(`${BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar coordenação");
  return res.json();
}

export async function deleteCoordination(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar coordenação");
}
