"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface UserData {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: UserData | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: { access: string; refresh: string; user: UserData }) => void
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock auth for testing
  useEffect(() => {
    // Simular usuário logado para testes
    setUser({
      id: "1",
      email: "test@example.com", 
      name: "Usuário Teste"
    })
    setAccessToken("mock_token")
  }, [])

  const login = (data: { access: string; refresh: string; user: UserData }) => {
    setUser(data.user)
    setAccessToken(data.access)
    setError(null)
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
  }

  const refreshAccessToken = async () => {
    return true
  }

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}