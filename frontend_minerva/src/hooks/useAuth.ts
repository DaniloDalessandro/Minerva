import { useEffect, useState } from "react"

interface UserData {
  id: string
  email: string
  name: string
}

interface UseAuthReturn {
  isAuthenticated: boolean
  user: UserData | null
  accessToken: string | null
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserData | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("access")
    const userId = localStorage.getItem("user_id")
    const email = localStorage.getItem("user_email")
    const name = localStorage.getItem("user_name")

    if (token && userId && email && name) {
      setAccessToken(token)
      setUser({ id: userId, email, name })
    }
  }, [])

  function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")

    setUser(null)
    setAccessToken(null)
  }

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
    logout,
  }
}
