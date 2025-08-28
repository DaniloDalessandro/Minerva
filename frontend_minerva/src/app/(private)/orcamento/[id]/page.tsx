"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchBudgetById, Budget } from "@/lib/api/budgets"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, DollarSignIcon, BuildingIcon, UserIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function BudgetDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const budgetId = Number(params.id)
  
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBudgetDetails = async () => {
      try {
        setLoading(true)
        
        // Load budget details only
        const budgetData = await fetchBudgetById(budgetId)
        setBudget(budgetData)
        
      } catch (err) {
        console.error("Erro ao carregar detalhes do orçamento:", err)
        setError("Erro ao carregar detalhes do orçamento")
      } finally {
        setLoading(false)
      }
    }

    loadBudgetDetails()
  }, [budgetId])

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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando detalhes do orçamento...</div>
        </div>
      </div>
    )
  }

  if (error || !budget) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            {error || "Orçamento não encontrado"}
          </div>
        </div>
      </div>
    )
  }

  const usedAmount = parseFloat(budget.total_amount) - parseFloat(budget.available_amount)
  const usagePercentage = ((usedAmount / parseFloat(budget.total_amount)) * 100).toFixed(1)

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          Detalhes do Orçamento - {budget.year}
        </h1>
      </div>
      
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
            <p className="text-lg font-semibold">
              {budget.management_center?.name || "N/A"}
            </p>
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

        {/* Additional Budget Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Informações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID do Orçamento</p>
                <p className="text-lg">{budget.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Percentual Utilizado</p>
                <p className="text-lg">{usagePercentage}%</p>
              </div>
            </div>
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
                  {budget.created_by.first_name && budget.created_by.last_name 
                    ? `${budget.created_by.first_name} ${budget.created_by.last_name}`
                    : budget.created_by.email}
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
                  {budget.updated_by.first_name && budget.updated_by.last_name 
                    ? `${budget.updated_by.first_name} ${budget.updated_by.last_name}`
                    : budget.updated_by.email}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}