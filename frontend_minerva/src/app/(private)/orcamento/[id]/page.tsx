"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchBudgetById, Budget, createBudgetMovement, CreateBudgetMovementData, fetchBudgets } from "@/lib/api/budgets"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, DollarSignIcon, BuildingIcon, UserIcon, ArrowLeft, ArrowLeftRightIcon, InfoIcon, TagIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BudgetMovementHistory } from "@/components/budget/BudgetMovementHistory"
import { BudgetMovementForm } from "@/components/forms/BudgetMovementForm"
import { BudgetLines } from "@/components/budget/BudgetLines"

export default function BudgetDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const budgetId = Number(params.id)
  
  const [budget, setBudget] = useState<Budget | null>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadBudgetDetails = async () => {
      try {
        setLoading(true)
        
        // Load budget details and all budgets for movement form
        const [budgetData, budgetsData] = await Promise.all([
          fetchBudgetById(budgetId),
          fetchBudgets()
        ])
        setBudget(budgetData)
        setBudgets(budgetsData.results || budgetsData)
        
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

  const handleNewMovement = () => {
    setIsMovementFormOpen(true)
  }

  const handleMovementSubmit = async (data: CreateBudgetMovementData) => {
    try {
      setIsSubmitting(true)
      await createBudgetMovement(data)
      setIsMovementFormOpen(false)
      // Refresh budget details to update available amount
      const updatedBudget = await fetchBudgetById(budgetId)
      setBudget(updatedBudget)
    } catch (error) {
      console.error("Erro ao criar movimentação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseMovementForm = () => {
    setIsMovementFormOpen(false)
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
      {/* Compact Header with Back Button and Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes do Orçamento - {budget.year}
            </h1>
            <p className="text-sm text-muted-foreground">Visualização completa do orçamento</p>
          </div>
        </div>
        <Button onClick={handleNewMovement} className="flex items-center gap-2">
          <ArrowLeftRightIcon className="h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Budget Information Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              Informações do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  Ano
                </div>
                <p className="text-lg font-semibold">{budget.year}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TagIcon className="h-4 w-4" />
                  Tipo/Categoria
                </div>
                <Badge variant={budget.category === 'CAPEX' ? 'default' : 'secondary'} className="text-sm">
                  {budget.category}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CheckCircleIcon className="h-4 w-4" />
                  Status
                </div>
                <Badge variant={budget.status === 'ATIVO' ? 'default' : 'secondary'} className="text-sm">
                  {budget.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BuildingIcon className="h-4 w-4" />
                  Centro Gestor
                </div>
                <p className="text-base font-medium">{budget.management_center?.name || "Não informado"}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>Criado em {formatDate(budget.created_at)}</span>
                {budget.created_by && (
                  <span className="font-medium">
                    por {budget.created_by.first_name && budget.created_by.last_name 
                      ? `${budget.created_by.first_name} ${budget.created_by.last_name}`
                      : budget.created_by.email}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>Atualizado em {formatDate(budget.updated_at)}</span>
                {budget.updated_by && (
                  <span className="font-medium">
                    por {budget.updated_by.first_name && budget.updated_by.last_name 
                      ? `${budget.updated_by.first_name} ${budget.updated_by.last_name}`
                      : budget.updated_by.email}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Values */}
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
        <BudgetMovementHistory budgetId={budget.id} onNewMovement={handleNewMovement} />

        {/* Budget Lines */}
        {budget.budget_lines && budget.budget_lines_summary && (
          <BudgetLines 
            budgetLines={budget.budget_lines}
            budgetLinesSummary={budget.budget_lines_summary}
          />
        )}
      </div>

      {/* Budget Movement Form Modal */}
      <BudgetMovementForm
        isOpen={isMovementFormOpen}
        onClose={handleCloseMovementForm}
        onSubmit={handleMovementSubmit}
        budgets={budgets}
        isLoading={isSubmitting}
      />
    </div>
  )
}