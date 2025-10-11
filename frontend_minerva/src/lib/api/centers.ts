// /lib/api/centers.ts

import { authFetch } from "./authFetch";

export interface ManagementCenter {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
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
  is_active: boolean;
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
export async function fetchManagementCenters(page = 1, pageSize = 10, search = "", ordering = "", statusFilter = "") {
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

  if (statusFilter === "active") {
    params.append("is_active", "true");
  } else if (statusFilter === "inactive") {
    params.append("is_active", "false");
  }
  // Se statusFilter for "all" ou vazio, não adiciona filtro
  
  const url = `${MANAGEMENT_CENTERS_API_URL}?${params.toString()}`;
  
  try {
    console.log("🌐 Making API call to:", url);
    const res = await authFetch(url);
    console.log("📡 Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
      } catch (e) {
        errorText = "Could not read error response";
      }
      console.error(`❌ Error ${res.status} fetching management centers:`, errorText);
      
      if (res.status === 401) {
        throw new Error("Não autorizado. Faça login novamente.");
      } else if (res.status === 403) {
        throw new Error("Sem permissão para acessar centros gestores.");
      } else if (res.status === 404) {
        throw new Error("Endpoint não encontrado. Verifique se o servidor está executando.");
      } else if (res.status >= 500) {
        throw new Error("Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        throw new Error(`Erro ao buscar centros gestores: ${res.status} - ${errorText}`);
      }
    }
    
    const json = await res.json();
    console.log("📋 Received data structure:", Object.keys(json));
    return json; // espera {results: [...], count: total, ...}
  } catch (error) {
    console.error("🚨 Network/parsing error fetching management centers:", error);
    throw error;
  }
}

export async function createManagementCenter(data: { name: string; description?: string }) {
  const res = await authFetch(`${MANAGEMENT_CENTERS_API_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar centro gestor");
  return res.json();
}

export async function updateManagementCenter(data: { id: number; name: string; description?: string }) {
  const res = await authFetch(`${MANAGEMENT_CENTERS_API_URL}${data.id}/update/`, {
    method: "PUT",
    body: JSON.stringify({ name: data.name, description: data.description }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar centro gestor");
  return res.json();
}

export async function deleteManagementCenter(id: number) {
  const res = await authFetch(`${MANAGEMENT_CENTERS_API_URL}${id}/delete/`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Erro ao inativar centro gestor");
  return res.json();
}

// Requesting Centers API
export async function fetchRequestingCenters(page = 1, pageSize = 10, search = "", ordering = "", statusFilter = "") {
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

  if (statusFilter === "active") {
    params.append("is_active", "true");
  } else if (statusFilter === "inactive") {
    params.append("is_active", "false");
  }
  // Se statusFilter for "all" ou vazio, não adiciona filtro
  
  const res = await authFetch(`${REQUESTING_CENTERS_API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar centros solicitantes");
  const json = await res.json();
  return json;
}

export async function createRequestingCenter(data: { name: string; description?: string; management_center_id: number }) {
  const res = await authFetch(`${REQUESTING_CENTERS_API_URL}create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar centro solicitante");
  return res.json();
}

export async function updateRequestingCenter(data: { id: number; name: string; description?: string; management_center_id: number }) {
  const res = await authFetch(`${REQUESTING_CENTERS_API_URL}${data.id}/update/`, {
    method: "PUT",
    body: JSON.stringify({ name: data.name, description: data.description, management_center_id: data.management_center_id }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar centro solicitante");
  return res.json();
}

export async function deleteRequestingCenter(id: number) {
  const res = await authFetch(`${REQUESTING_CENTERS_API_URL}${id}/delete/`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Erro ao inativar centro solicitante");
  return res.json();
}