import { authFetch } from "./authFetch";

export interface ManagementCenter {
  id?: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
  updated_by?: any;
}

export interface RequestingCenter {
  id?: number;
  management_center: number;
  management_center_name?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
  updated_by?: any;
}

export interface CentersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ManagementCenter[] | RequestingCenter[];
}

// Management Centers API
export async function fetchManagementCenters(
  page = 1,
  pageSize = 10
): Promise<CentersResponse> {
  const response = await authFetch(
    `/center/management-centers/?page=${page}&page_size=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Erro ao carregar centros gestores");
  }
  return response.json();
}

export async function createManagementCenter(
  center: Omit<ManagementCenter, "id">
): Promise<ManagementCenter> {
  const response = await authFetch("/center/management-centers/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(center),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar centro gestor");
  }

  return response.json();
}

export async function updateManagementCenter(
  center: ManagementCenter
): Promise<ManagementCenter> {
  const response = await authFetch(
    `/center/management-centers/${center.id}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(center),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao atualizar centro gestor");
  }

  return response.json();
}

export async function deleteManagementCenter(id: number): Promise<void> {
  const response = await authFetch(`/center/management-centers/${id}/delete/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao excluir centro gestor");
  }
}

// Requesting Centers API
export async function fetchRequestingCenters(
  page = 1,
  pageSize = 10
): Promise<CentersResponse> {
  const response = await authFetch(
    `/center/requesting-centers/?page=${page}&page_size=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Erro ao carregar centros solicitantes");
  }
  return response.json();
}

export async function createRequestingCenter(
  center: Omit<RequestingCenter, "id">
): Promise<RequestingCenter> {
  const response = await authFetch("/center/requesting-centers/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(center),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar centro solicitante");
  }

  return response.json();
}

export async function updateRequestingCenter(
  center: RequestingCenter
): Promise<RequestingCenter> {
  const response = await authFetch(
    `/center/requesting-centers/${center.id}/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(center),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao atualizar centro solicitante");
  }

  return response.json();
}

export async function deleteRequestingCenter(id: number): Promise<void> {
  const response = await authFetch(`/center/requesting-centers/${id}/delete/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao excluir centro solicitante");
  }
}