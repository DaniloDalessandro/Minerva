import { useEffect, useState, useCallback } from "react";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Centraliza a lógica de recuperação dos dados
  const getAuthData = useCallback((): { token: string | null; userData: UserData | null } => {
    try {
      const token = localStorage.getItem("access");
      const userData = {
        id: localStorage.getItem("user_id") || '',
        email: localStorage.getItem("user_email") || '',
        name: localStorage.getItem("user_name") || '',
      };
      
      return { 
        token,
        userData: token && userData.id ? userData : null 
      };
    } catch (error) {
      console.error("Error reading auth data from localStorage", error);
      return { token: null, userData: null };
    }
  }, []);

  const login = useCallback((token: string, userData: UserData) => {
    localStorage.setItem("access", token);
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_email", userData.email);
    localStorage.setItem("user_name", userData.name);
    setAccessToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    setUser(null);
    setAccessToken(null);
  }, []);

  // Sincroniza entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access") {
        const { token, userData } = getAuthData();
        setAccessToken(token);
        setUser(userData);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getAuthData]);

  // Inicialização
  useEffect(() => {
    const { token, userData } = getAuthData();
    setAccessToken(token);
    setUser(userData);
  }, [getAuthData]);

  return {
    isAuthenticated: !!accessToken,
    user,
    accessToken,
    login,
    logout,
  };
}