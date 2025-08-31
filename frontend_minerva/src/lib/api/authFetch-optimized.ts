import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  exp: number
}

// Cache para evitar múltiplas decodificações do mesmo token
const tokenCache = new Map<string, { exp: number; isExpired: boolean; isExpiringSoon: boolean }>()

// Verifica se o token está prestes a expirar
function tokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  if (!token) return true
  
  // Verifica cache primeiro
  const cached = tokenCache.get(token)
  if (cached) return cached.isExpiringSoon
  
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const now = Math.floor(Date.now() / 1000)
    const isExpired = decoded.exp < now
    const isExpiringSoon = decoded.exp - now < thresholdSeconds
    
    // Cache o resultado
    tokenCache.set(token, { exp: decoded.exp, isExpired, isExpiringSoon })
    
    return isExpiringSoon
  } catch {
    // Cache resultado inválido
    tokenCache.set(token, { exp: 0, isExpired: true, isExpiringSoon: true })
    return true
  }
}

// Promise para evitar múltiplas chamadas de refresh simultâneas
let refreshPromise: Promise<string | null> | null = null

async function refreshToken(): Promise<string | null> {
  // Se já existe uma chamada de refresh em andamento, aguarda ela
  if (refreshPromise) {
    return refreshPromise
  }

  const refresh = localStorage.getItem("refresh")
  if (!refresh) {
    return null
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/accounts/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })

      if (!response.ok) {
        throw new Error("Refresh failed")
      }

      const data = await response.json()

      if (data.access) {
        localStorage.setItem("access", data.access)
        // Limpa o cache do token antigo
        tokenCache.clear()
        return data.access
      }
      
      throw new Error("No access token received")
    } catch (error) {
      // Limpa dados de autenticação em caso de erro
      localStorage.clear()
      window.location.href = "/login"
      throw error
    } finally {
      // Limpa a promise para permitir futuras tentativas
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Request queue para requisições que aguardam refresh do token
const requestQueue: Array<{
  url: string
  options: RequestInit
  resolve: (response: Response) => void
  reject: (error: Error) => void
}> = []

let isRefreshing = false

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let access = localStorage.getItem("access")
  
  // Verifica se o token precisa ser renovado
  if (access && tokenExpiringSoon(access)) {
    // Se já está fazendo refresh, adiciona à fila
    if (isRefreshing) {
      return new Promise<Response>((resolve, reject) => {
        requestQueue.push({ url, options, resolve, reject })
      })
    }

    try {
      isRefreshing = true
      const newToken = await refreshToken()
      
      if (newToken) {
        access = newToken
        
        // Processa fila de requisições aguardando
        while (requestQueue.length > 0) {
          const queuedRequest = requestQueue.shift()
          if (queuedRequest) {
            try {
              const response = await authFetch(queuedRequest.url, queuedRequest.options)
              queuedRequest.resolve(response)
            } catch (error) {
              queuedRequest.reject(error as Error)
            }
          }
        }
      }
    } catch (error) {
      // Rejeita todas as requisições na fila
      while (requestQueue.length > 0) {
        const queuedRequest = requestQueue.shift()
        if (queuedRequest) {
          queuedRequest.reject(error as Error)
        }
      }
      throw error
    } finally {
      isRefreshing = false
    }
  }

  // Prepara headers otimizados
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (access) {
    headers.Authorization = `Bearer ${access}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Se recebeu 401, tenta refresh uma vez
    if (response.status === 401 && !isRefreshing) {
      try {
        isRefreshing = true
        const newToken = await refreshToken()
        
        if (newToken) {
          // Tenta novamente com o novo token
          headers.Authorization = `Bearer ${newToken}`
          return fetch(url, { ...options, headers })
        }
      } catch (refreshError) {
        // Se refresh falhou, redireciona para login
        localStorage.clear()
        window.location.href = "/login"
        throw refreshError
      } finally {
        isRefreshing = false
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

// Função para limpar cache de tokens (útil para testes ou logout)
export function clearTokenCache() {
  tokenCache.clear()
}

// Função para pré-validar token sem fazer requisição
export function validateToken(token: string): { isValid: boolean; isExpiringSoon: boolean } {
  if (!token) return { isValid: false, isExpiringSoon: true }
  
  const cached = tokenCache.get(token)
  if (cached) {
    return { isValid: !cached.isExpired, isExpiringSoon: cached.isExpiringSoon }
  }
  
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const now = Math.floor(Date.now() / 1000)
    const isExpired = decoded.exp < now
    const isExpiringSoon = decoded.exp - now < 300 // 5 minutes
    
    tokenCache.set(token, { exp: decoded.exp, isExpired, isExpiringSoon })
    
    return { isValid: !isExpired, isExpiringSoon }
  } catch {
    tokenCache.set(token, { exp: 0, isExpired: true, isExpiringSoon: true })
    return { isValid: false, isExpiringSoon: true }
  }
}