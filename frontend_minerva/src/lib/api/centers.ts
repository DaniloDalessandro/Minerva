// /lib/api/centers.ts

export interface ManagementCenter {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
}

export interface RequestingCenter {
  id: number;
  name: string;
  description?: string;
  management_center: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  created_by?: {
    email: string;
  };
  updated_by?: {
    email: string;
  };
}

const MANAGEMENT_CENTERS_API_URL = "http://localhost:8000/api/v1/center/management-centers/";
const REQUESTING_CENTERS_API_URL = "http://localhost:8000/api/v1/center/requesting-centers/";

// Management Centers API
export async function fetchManagementCenters(page = 1, pageSize = 10, search = "", ordering = "") {
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
  
  const res = await fetch(`${MANAGEMENT_CENTERS_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar centros gestores");
  const json = await res.json();
  return json; // espera {results: [...], count: total, ...}
}

export async function createManagementCenter(data: { name: string; description?: string }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${MANAGEMENT_CENTERS_API_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar centro gestor");
  return res.json();
}

export async function updateManagementCenter(data: { id: number; name: string; description?: string }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${MANAGEMENT_CENTERS_API_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: data.name, description: data.description }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar centro gestor");
  return res.json();
}

export async function deleteManagementCenter(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${MANAGEMENT_CENTERS_API_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar centro gestor");
  return true;
}

// Requesting Centers API
export async function fetchRequestingCenters(page = 1, pageSize = 10, search = "", ordering = "") {
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
  
  const res = await fetch(`${REQUESTING_CENTERS_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar centros solicitantes");
  const json = await res.json();
  return json;
}

export async function createRequestingCenter(data: { name: string; description?: string; management_center_id: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${REQUESTING_CENTERS_API_URL}create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar centro solicitante");
  return res.json();
}

export async function updateRequestingCenter(data: { id: number; name: string; description?: string; management_center_id: number }) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${REQUESTING_CENTERS_API_URL}${data.id}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: data.name, description: data.description, management_center_id: data.management_center_id }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar centro solicitante");
  return res.json();
}

export async function deleteRequestingCenter(id: number) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${REQUESTING_CENTERS_API_URL}${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao deletar centro solicitante");
  return true;
}