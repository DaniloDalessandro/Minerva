"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { BudgetLine, CreateBudgetLineData } from "@/lib/api/budgetlines"
import { Budget } from "@/lib/api/budgets"
import { ManagementCenter, RequestingCenter } from "@/lib/api/centers"
import { Employee } from "@/lib/api/employees"

interface BudgetLineFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateBudgetLineData) => void
  budgetLine?: BudgetLine
  budgets: Budget[]
  managementCenters: ManagementCenter[]
  requestingCenters: RequestingCenter[]
  employees: Employee[]
  isLoading?: boolean
}

export function BudgetLineForm({
  isOpen,
  onClose,
  onSubmit,
  budgetLine,
  budgets,
  managementCenters,
  requestingCenters,
  employees,
  isLoading = false
}: BudgetLineFormProps) {
  const [formData, setFormData] = useState<CreateBudgetLineData>({
    budget: 0,
    category: "OPEX",
    expense_type: "Base Principal",
    management_center: 0,
    requesting_center: 0,
    summary_description: "",
    object: "",
    budget_classification: "NOVO",
    main_fiscal: 0,
    secondary_fiscal: 0,
    contract_type: "SERVIÇO",
    probable_procurement_type: "LICITAÇÃO",
    budgeted_amount: 0,
    process_status: "DENTRO DO PRAZO",
    contract_status: "DENTRO DO PRAZO",
    contract_notes: ""
  })

  const [filteredRequestingCenters, setFilteredRequestingCenters] = useState<RequestingCenter[]>([])

  useEffect(() => {
    if (budgetLine) {
      setFormData({
        budget: budgetLine.budget,
        category: budgetLine.category || "OPEX",
        expense_type: budgetLine.expense_type,
        management_center: budgetLine.management_center || 0,
        requesting_center: budgetLine.requesting_center || 0,
        summary_description: budgetLine.summary_description || "",
        object: budgetLine.object || "",
        budget_classification: budgetLine.budget_classification || "NOVO",
        main_fiscal: budgetLine.main_fiscal || 0,
        secondary_fiscal: budgetLine.secondary_fiscal || 0,
        contract_type: budgetLine.contract_type || "SERVIÇO",
        probable_procurement_type: budgetLine.probable_procurement_type,
        budgeted_amount: budgetLine.budgeted_amount,
        process_status: budgetLine.process_status || "DENTRO DO PRAZO",
        contract_status: budgetLine.contract_status || "DENTRO DO PRAZO",
        contract_notes: budgetLine.contract_notes || ""
      })
      
      // Filter requesting centers based on management center
      if (budgetLine.management_center) {
        const filtered = requestingCenters.filter(rc => rc.management_center === budgetLine.management_center)
        setFilteredRequestingCenters(filtered)
      }
    }
  }, [budgetLine, requestingCenters])

  const handleManagementCenterChange = (value: string) => {
    const managementCenterId = parseInt(value)
    setFormData(prev => ({ 
      ...prev, 
      management_center: managementCenterId, 
      requesting_center: 0 
    }))
    
    const filtered = requestingCenters.filter(rc => rc.management_center === managementCenterId)
    setFilteredRequestingCenters(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      budget: 0,
      category: "OPEX",
      expense_type: "Base Principal",
      management_center: 0,
      requesting_center: 0,
      summary_description: "",
      object: "",
      budget_classification: "NOVO",
      main_fiscal: 0,
      secondary_fiscal: 0,
      contract_type: "SERVIÇO",
      probable_procurement_type: "LICITAÇÃO",
      budgeted_amount: 0,
      process_status: "DENTRO DO PRAZO",
      contract_status: "DENTRO DO PRAZO",
      contract_notes: ""
    })
    setFilteredRequestingCenters([])
    onClose()
  }

  const activeBudgets = budgets.filter(b => b.status === 'ATIVO')
  const activeEmployees = employees.filter(emp => emp.status === 'ATIVO')

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {budgetLine ? "Editar Linha Orçamentária" : "Nova Linha Orçamentária"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento *</Label>
              <Select 
                value={formData.budget.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, budget: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um orçamento" />
                </SelectTrigger>
                <SelectContent>
                  {activeBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      {budget.category} {budget.year} - R$ {parseFloat(budget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category || "OPEX"} 
                onValueChange={(value: "CAPEX" | "OPEX") => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary_description">Descrição Resumida</Label>
            <Input
              id="summary_description"
              value={formData.summary_description}
              onChange={(e) => setFormData(prev => ({ ...prev, summary_description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_type">Tipo de Despesa *</Label>
              <Select 
                value={formData.expense_type} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, expense_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Base Principal">Base Principal</SelectItem>
                  <SelectItem value="Serviços Especializados">Serviços Especializados</SelectItem>
                  <SelectItem value="Despesas Compartilhadas">Despesas Compartilhadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="object">Objeto</Label>
              <Input
                id="object"
                value={formData.object}
                onChange={(e) => setFormData(prev => ({ ...prev, object: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="management_center">Centro Gestor</Label>
              <Select 
                value={formData.management_center?.toString() || ""} 
                onValueChange={handleManagementCenterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro gestor" />
                </SelectTrigger>
                <SelectContent>
                  {managementCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesting_center">Centro Solicitante</Label>
              <Select 
                value={formData.requesting_center?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, requesting_center: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro solicitante" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRequestingCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgeted_amount">Valor Orçado *</Label>
              <Input
                id="budgeted_amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.budgeted_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, budgeted_amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_classification">Classificação Orçamentária</Label>
              <Select 
                value={formData.budget_classification || "NOVO"} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, budget_classification: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOVO">Novo</SelectItem>
                  <SelectItem value="RENOVAÇÃO">Renovação</SelectItem>
                  <SelectItem value="CARY OVER">Cary Over</SelectItem>
                  <SelectItem value="REPLANEJAMENTO">Replanejamento</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_type">Tipo de Contrato</Label>
              <Select 
                value={formData.contract_type || "SERVIÇO"} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, contract_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SERVIÇO">Serviço</SelectItem>
                  <SelectItem value="FORNECIMENTO">Fornecimento</SelectItem>
                  <SelectItem value="ASSINATURA">Assinatura</SelectItem>
                  <SelectItem value="FORNECIMENTO/SERVIÇO">Fornecimento/Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="probable_procurement_type">Tipo de Aquisição *</Label>
            <Select 
              value={formData.probable_procurement_type} 
              onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, probable_procurement_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LICITAÇÃO">Licitação</SelectItem>
                <SelectItem value="DISPENSA EM RAZÃO DO VALOR">Dispensa em razão do valor</SelectItem>
                <SelectItem value="CONVÊNIO">Convênio</SelectItem>
                <SelectItem value="FUNDO FIXO">Fundo Fixo</SelectItem>
                <SelectItem value="INEXIGIBILIDADE">Inexigibilidade</SelectItem>
                <SelectItem value="ATA DE REGISTRO DE PREÇO">Ata de Registro de Preço</SelectItem>
                <SelectItem value="ACORDO DE COOPERAÇÃO">Acordo de Cooperação</SelectItem>
                <SelectItem value="APOSTILAMENTO">Apostilamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main_fiscal">Fiscal Principal</Label>
              <Select 
                value={formData.main_fiscal?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, main_fiscal: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fiscal principal" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_fiscal">Fiscal Substituto</Label>
              <Select 
                value={formData.secondary_fiscal?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, secondary_fiscal: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fiscal substituto" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees
                    .filter(emp => emp.id !== formData.main_fiscal)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.full_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract_notes">Observações</Label>
            <Textarea
              id="contract_notes"
              value={formData.contract_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, contract_notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.budget}>
              {isLoading ? "Salvando..." : budgetLine ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}