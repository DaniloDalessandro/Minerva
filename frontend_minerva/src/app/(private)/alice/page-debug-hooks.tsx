"use client"

import { useState, useEffect } from "react"

export default function AlicePageDebug() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🔍 Alice page debug - useEffect executado")
    
    try {
      console.log("🔍 Tentando inicializar...")
      // Simula inicialização
      setTimeout(() => {
        console.log("🔍 Inicialização concluída")
        setIsLoading(false)
      }, 1000)
      
    } catch (err) {
      console.error("🚨 Erro na inicialização:", err)
      setError(String(err))
      setIsLoading(false)
    }
  }, [])

  console.log("🔍 Alice page debug - renderizando. isLoading:", isLoading, "error:", error)

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Debug - Carregando Alice...
        </h2>
        <div className="p-4 border rounded">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight text-red-500">
          Debug - Erro detectado
        </h2>
        <div className="p-4 border border-red-500 rounded">
          <p>Erro: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight text-green-500">
        Debug - Alice carregou com sucesso!
      </h2>
      <div className="p-4 border border-green-500 rounded">
        <p>Se você está vendo esta mensagem, o problema não é com os hooks básicos do React.</p>
        <p>O problema pode estar nas importações de componentes UI ou na API.</p>
      </div>
    </div>
  )
}