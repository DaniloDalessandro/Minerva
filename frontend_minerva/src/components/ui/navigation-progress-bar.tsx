"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavigationProgressBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Inicia o loading quando a navegação começa
    setIsLoading(true)
    setProgress(0)
    
    // Simula progresso gradual
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 100)

    // Completa o progresso após um tempo
    const completeTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }, 600)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div 
        className={cn(
          "h-full bg-primary transition-all duration-300 ease-out",
          "bg-gradient-to-r from-blue-500 to-blue-600",
          "shadow-sm"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}