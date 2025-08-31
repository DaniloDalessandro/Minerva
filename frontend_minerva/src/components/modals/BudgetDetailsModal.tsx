"use client"

import { Budget } from "@/lib/api/budgets"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, DollarSignIcon, BuildingIcon, UserIcon } from "lucide-react"
import { BudgetMovementHistory } from "@/components/budget/BudgetMovementHistory"

interface BudgetDetailsModalProps {
  budget: Budget | null
  isOpen: boolean
  onClose: () => void
}

export function BudgetDetailsModal({ budget, isOpen, onClose }: BudgetDetailsModalProps) {
  if (!budget) return null

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
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", "")
  }

  const usedAmount = parseFloat(budget.total_amount) - parseFloat(budget.available_amount)
  const usagePercentage = ((usedAmount / parseFloat(budget.total_amount)) * 100).toFixed(1)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalhes do Orçamento - {budget.year}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações do Orçamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Informações do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ano</p>
                  <p className="font-semibold">{budget.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-semibold">{budget.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Centro Gestor</p>
                  <p className="font-semibold">{budget.management_center?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold">{budget.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Financial Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4" />
                Valores Orçamentários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(budget.total_amount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Disponível</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(budget.available_amount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Utilizado</p>
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(usedAmount.toString())}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{width: `${usagePercentage}%`}}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">{usagePercentage}% utilizado</p>
            </CardContent>
          </Card>

          {/* Budget Movements History */}
          <BudgetMovementHistory budgetId={budget.id} />

          {/* Compact Audit Information */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  <span>Criado: {formatDate(budget.created_at)}</span>
                  {budget.created_by && <span>por {budget.created_by.email}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  <span>Atualizado: {formatDate(budget.updated_at)}</span>
                  {budget.updated_by && <span>por {budget.updated_by.email}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}