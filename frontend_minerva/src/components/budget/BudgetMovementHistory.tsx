"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, HistoryIcon, PlusIcon } from "lucide-react"
import { BudgetMovement, getBudgetMovementsByBudget } from "@/lib/api/budgets"

interface BudgetMovementHistoryProps {
  budgetId: number
  onNewMovement?: () => void
}

export function BudgetMovementHistory({ budgetId, onNewMovement }: BudgetMovementHistoryProps) {
  const [movements, setMovements] = useState<BudgetMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMovements()
  }, [budgetId])

  const loadMovements = async () => {
    try {
      setIsLoading(true)
      const data = await getBudgetMovementsByBudget(budgetId)
      setMovements(data)
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error)
      setMovements([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    const value = parseFloat(amount)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Carregando movimentações...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            Histórico de Movimentações ({movements.length})
          </CardTitle>
          {onNewMovement && (
            <Button size="sm" onClick={onNewMovement}>
              <PlusIcon className="h-3 w-3 mr-1" />
              Nova Movimentação
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Nenhuma movimentação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(movement.movement_date)}
                    </Badge>
                    <span className="font-semibold text-lg">
                      {formatCurrency(movement.amount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate max-w-32">
                      {movement.source?.category} {movement.source?.year}
                    </span>
                    <ArrowRightIcon className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate max-w-32">
                      {movement.destination?.category} {movement.destination?.year}
                    </span>
                  </div>
                  
                  {movement.notes && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {movement.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {movements.length > 5 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  + {movements.length - 5} movimentações a mais
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}