import { useAuthContext } from "@/context/AuthContext"
import jwt_decode from "jwt-decode"

interface JWTPayload {
  exp: number
}

// Verifica se o token está prestes a expirar
function tokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  try {
    const decoded = jwt_decode<JWTPayload>(token)
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp - now < thresholdSeconds
  } catch {
    return false
  }
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const access = localStorage.getItem("access")
  const refresh = localStorage.getItem("refresh")

  // Verifica se o token está para expirar
  if (access && tokenExpiringSoon(access)) {
    try {
      const response = await fetch("http://localhost:8000/api/v1/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })

      const data = await response.json()

      if (response.ok && data.access) {
        localStorage.setItem("access", data.access)
      } else {
        // falha ao renovar token, remover dados
        localStorage.clear()
        window.location.href = "/login"
        return Promise.reject("Refresh token inválido")
      }
    } catch {
      localStorage.clear()
      window.location.href = "/login"
      return Promise.reject("Erro ao atualizar token")
    }
  }

  const updatedAccess = localStorage.getItem("access")

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${updatedAccess}`,
    "Content-Type": "application/json",
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
