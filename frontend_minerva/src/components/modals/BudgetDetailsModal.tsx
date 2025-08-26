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
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Ano
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold">{budget.year}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant={budget.category === 'CAPEX' ? 'default' : 'secondary'} className="text-sm">
                  {budget.category}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Management Center */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BuildingIcon className="h-4 w-4" />
                Centro Gestor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold">{budget.management_center?.name}</p>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4" />
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(budget.total_amount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Disponível
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(budget.available_amount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Valor Utilizado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(usedAmount.toString())}
                </p>
                <p className="text-sm text-muted-foreground">
                  {usagePercentage}% do total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant={budget.status === 'ATIVO' ? 'default' : 'secondary'}>
                {budget.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Audit Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Criado em
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{formatDate(budget.created_at)}</p>
                {budget.created_by && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <UserIcon className="h-3 w-3" />
                    {budget.created_by.email}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Atualizado em
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{formatDate(budget.updated_at)}</p>
                {budget.updated_by && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <UserIcon className="h-3 w-3" />
                    {budget.updated_by.email}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}