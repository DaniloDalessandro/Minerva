"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/context/AuthContext"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuthContext() // ✅ acesso ao contexto

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/v1/accounts/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Chama o login do contexto
        login({
          access: data.access,
          refresh: data.refresh,
          user: data.user,
        })

        router.push("/dashboard")
      } else {
        const errorMessage =
          data?.detail || data?.non_field_errors?.[0] || "Credenciais inválidas"
        setError(errorMessage)
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
    }
  }

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header com logo */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l-2 2v4c-2.5 1-4 3.5-4 6.5s2.5 5.5 6 5.5 6-2.5 6-5.5-1.5-5.5-4-6.5V4l-2-2zM8 14.5c0-2 1-3.5 2.5-4.5v4.5c0 .5.5 1 1 1h1c.5 0 1-.5 1-1V10c1.5 1 2.5 2.5 2.5 4.5 0 2-1.5 3.5-3.5 3.5s-3.5-1.5-3.5-3.5z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Minerva
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de Gestão de Contratos
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Entrar no sistema
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Ajuda
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Termos de Uso
          </a>
        </div>
        <p className="text-xs text-gray-400">
          © 2024 Minerva. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
