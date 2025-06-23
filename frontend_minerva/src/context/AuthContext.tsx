"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface UserData {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: UserData | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (data: { access: string; refresh: string; user: UserData }) => void
  logout: () => void
  refreshAccessToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // ✅ Recupera dados do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("access")
    const id = localStorage.getItem("user_id")
    const email = localStorage.getItem("user_email")
    const name = localStorage.getItem("user_name")

    if (token && id && email && name) {
      setAccessToken(token)
      setUser({ id, email, name })
    }
  }, [])

  // ✅ Função de login
  function login(data: { access: string; refresh: string; user: UserData }) {
    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)
    localStorage.setItem("user_id", data.user.id)
    localStorage.setItem("user_email", data.user.email)
    localStorage.setItem("user_name", data.user.name)

    setAccessToken(data.access)
    setUser(data.user)
  }

  // ✅ Função de logout
  function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")

    setAccessToken(null)
    setUser(null)
  }

  // ✅ Decodifica o token e verifica se expira em breve
  function tokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp - now < thresholdSeconds
  } catch {
    return false
  }
}

  // ✅ Função para atualizar o access token com o refresh
  async function refreshAccessToken() {
    const refresh = localStorage.getItem("refresh")
    if (!refresh) {
      logout()
      return
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/accounts/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("access", data.access)
        setAccessToken(data.access)
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  // ✅ Verifica periodicamente se o token vai expirar
  useEffect(() => {
    if (!accessToken) return

    const interval = setInterval(() => {
      if (accessToken && tokenExpiringSoon(accessToken)) {
        refreshAccessToken()
      }
    }, 50 * 1000) // a cada 50 segundos

    return () => clearInterval(interval)
  }, [accessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro do AuthProvider")
  }
  return context
}
