"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Permitir tempo para o hook de autenticação se inicializar
    const timer = setTimeout(() => {
      if (!isAuthenticated || !accessToken) {
        if (!hasRedirected) {
          setHasRedirected(true);
          router.push('/login');
        }
      } else {
        setIsLoading(false);
      }
    }, 150); // Tempo ligeiramente maior para garantir inicialização

    return () => clearTimeout(timer);
  }, [isAuthenticated, accessToken, router, hasRedirected]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (já redirecionou)
  if (!isAuthenticated || !accessToken) {
    return null;
  }

  return <>{children}</>;
}