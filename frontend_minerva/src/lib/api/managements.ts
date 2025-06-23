export interface Management {
  id: string;
  name: string;
  direction: string; // ID da direção
}

const BASE_URL = "/managements/";

export async function fetchManagements(): Promise<Management[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao buscar gerências");
  return res.json();
}

export async function createManagement(data: Management): Promise<Management> {
  const res = await fetch(`${BASE_URL}create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar gerência");
  return res.json();
}

export async function updateManagement(data: Management): Promise<Management> {
  const res = await fetch(`${BASE_URL}${data.id}/update/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar gerência");
  return res.json();
}

export async function deleteManagement(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${id}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar gerência");
}
