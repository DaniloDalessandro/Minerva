"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ListIcon, 
  DollarSignIcon, 
  TrendingUpIcon, 
  ClipboardListIcon, 
  HistoryIcon,
  UserIcon,
  TagIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ChevronRightIcon,
  PlusIcon
} from "lucide-react"
import { BudgetLineListItem, BudgetLinesSummary } from "@/lib/api/budgets"
import BudgetLineVersionHistory from "./BudgetLineVersionHistory"

interface BudgetLinesProps {
  budgetLines: BudgetLineListItem[]
  budgetLinesSummary: BudgetLinesSummary
  onCreateNewBudgetLine?: () => void
}

export function BudgetLines({ budgetLines, budgetLinesSummary, onCreateNewBudgetLine }: BudgetLinesProps) {
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getStatusColor = (status: string, type: 'contract' | 'process') => {
    const statusColors: { [key: string]: string } = {
      // Contract Status Colors
      'DENTRO DO PRAZO': 'bg-green-100 text-green-800 border-green-200',
      'CONTRATADO NO PRAZO': 'bg-green-100 text-green-800 border-green-200',
      'CONTRATADO COM ATRASO': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PRAZO VENCIDO': 'bg-red-100 text-red-800 border-red-200',
      'VENCIDO': 'bg-red-100 text-red-800 border-red-200',
      // Process Status Colors
      'ELABORADO NO PRAZO': 'bg-green-100 text-green-800 border-green-200',
      'ELABORADO COM ATRASO': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'EM ELABORAÇÃO': 'bg-blue-100 text-blue-800 border-blue-200',
      'PENDENTE': 'bg-orange-100 text-orange-800 border-orange-200',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getExpenseTypeColor = (expenseType: string) => {
    const typeColors: { [key: string]: string } = {
      'Base Principal': 'bg-blue-100 text-blue-800 border-blue-200',
      'Base Suplementar': 'bg-purple-100 text-purple-800 border-purple-200',
      'Reserva Técnica': 'bg-orange-100 text-orange-800 border-orange-200',
      'Contingência': 'bg-red-100 text-red-800 border-red-200',
    }
    return typeColors[expenseType] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleViewHistory = (lineId: number) => {
    setSelectedLineId(lineId)
    setIsHistoryDialogOpen(true)
  }

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false)
    setSelectedLineId(null)
  }

  // Summary statistics cards
  const summaryCards = [
    {
      title: "Total de Linhas",
      value: budgetLinesSummary.total_lines.toString(),
      icon: ListIcon,
      color: "text-blue-600"
    },
    {
      title: "Valor Total Orçado",
      value: formatCurrency(budgetLinesSummary.total_budgeted_amount),
      icon: DollarSignIcon,
      color: "text-green-600"
    },
    {
      title: "% de Utilização",
      value: `${budgetLinesSummary.utilization_percentage.toFixed(1)}%`,
      icon: TrendingUpIcon,
      color: "text-orange-600"
    }
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardListIcon className="h-5 w-5" />
            Linhas Orçamentárias Vinculadas
          </CardTitle>
          {onCreateNewBudgetLine && (
            <Button onClick={onCreateNewBudgetLine} className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Gerar Nova Linha Orçamentária
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card, index) => (
            <Card key={index} className="border-0 bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                  <card.icon className={`h-8 w-8 ${card.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Lines List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Linhas Orçamentárias</h3>
          
          {budgetLines.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ClipboardListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma linha orçamentária</h3>
              <p className="mt-1 text-sm text-gray-500">
                Este orçamento não possui linhas orçamentárias vinculadas.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgetLines.map((line) => (
                <Card key={line.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Description and Amount */}
                      <div className="lg:col-span-4 space-y-2">
                        <h4 className="font-semibold text-gray-900 leading-tight">
                          {line.summary_description || "Descrição não informada"}
                        </h4>
                        <div className="flex items-center gap-1">
                          <DollarSignIcon className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(line.budgeted_amount)}
                          </span>
                        </div>
                      </div>

                      {/* Management Center and Fiscal */}
                      <div className="lg:col-span-3 space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Centro:</span>
                        </div>
                        <p className="text-sm font-medium">{line.management_center_name}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Fiscal:</span>
                        </div>
                        <p className="text-sm">{line.main_fiscal_name}</p>
                      </div>

                      {/* Expense Type and Status */}
                      <div className="lg:col-span-3 space-y-2">
                        <Badge className={getExpenseTypeColor(line.expense_type)} variant="outline">
                          <TagIcon className="h-3 w-3 mr-1" />
                          {line.expense_type}
                        </Badge>
                        <div className="space-y-1">
                          <Badge className={getStatusColor(line.process_status, 'process')} variant="outline">
                            <CheckCircle2Icon className="h-3 w-3 mr-1" />
                            {line.process_status}
                          </Badge>
                          <Badge className={getStatusColor(line.contract_status, 'contract')} variant="outline">
                            <AlertCircleIcon className="h-3 w-3 mr-1" />
                            {line.contract_status}
                          </Badge>
                        </div>
                      </div>

                      {/* Version Info and Actions */}
                      <div className="lg:col-span-2 flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Versão</p>
                          <Badge variant="secondary" className="text-xs">
                            v{line.current_version}/{line.total_versions}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewHistory(line.id)}
                          className="flex items-center gap-1"
                        >
                          <HistoryIcon className="h-3 w-3" />
                          Histórico
                          <ChevronRightIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Distribution Statistics */}
        {(Object.keys(budgetLinesSummary.process_status_distribution).length > 0 || 
          Object.keys(budgetLinesSummary.contract_status_distribution).length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t">
            {/* Process Status Distribution */}
            {Object.keys(budgetLinesSummary.process_status_distribution).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Distribuição por Status do Processo</h4>
                <div className="space-y-2">
                  {Object.entries(budgetLinesSummary.process_status_distribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <Badge className={getStatusColor(status, 'process')} variant="outline">
                        {status}
                      </Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contract Status Distribution */}
            {Object.keys(budgetLinesSummary.contract_status_distribution).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Distribuição por Status do Contrato</h4>
                <div className="space-y-2">
                  {Object.entries(budgetLinesSummary.contract_status_distribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <Badge className={getStatusColor(status, 'contract')} variant="outline">
                        {status}
                      </Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Version History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Histórico de Versões da Linha Orçamentária</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {selectedLineId && (
              <BudgetLineVersionHistory 
                budgetLineId={selectedLineId} 
                isOpen={isHistoryDialogOpen} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}