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
import { Assistance, CreateAssistanceData } from "@/lib/api/aids"
import { Employee } from "@/lib/api/employees"
import { BudgetLine } from "@/lib/api/budgetlines"

interface AssistanceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateAssistanceData) => void
  assistance?: Assistance
  employees: Employee[]
  budgetLines: BudgetLine[]
  isLoading?: boolean
}

export function AssistanceForm({
  isOpen,
  onClose,
  onSubmit,
  assistance,
  employees,
  budgetLines,
  isLoading = false
}: AssistanceFormProps) {
  const [formData, setFormData] = useState<CreateAssistanceData>({
    employee: 0,
    budget_line: 0,
    type: "GRADUACAO",
    total_amount: "",
    installment_count: 1,
    amount_per_installment: "",
    start_date: "",
    end_date: "",
    notes: "",
    status: "AGUARDANDO"
  })

  useEffect(() => {
    if (assistance) {
      setFormData({
        employee: assistance.employee,
        budget_line: assistance.budget_line,
        type: assistance.type || "GRADUACAO",
        total_amount: assistance.total_amount,
        installment_count: assistance.installment_count || 1,
        amount_per_installment: assistance.amount_per_installment || "",
        start_date: assistance.start_date,
        end_date: assistance.end_date || "",
        notes: assistance.notes || "",
        status: assistance.status
      })
    } else {
      setFormData({
        employee: 0,
        budget_line: 0,
        type: "GRADUACAO",
        total_amount: "",
        installment_count: 1,
        amount_per_installment: "",
        start_date: "",
        end_date: "",
        notes: "",
        status: "AGUARDANDO"
      })
    }
  }, [assistance])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      employee: 0,
      budget_line: 0,
      type: "GRADUACAO",
      total_amount: "",
      installment_count: 1,
      amount_per_installment: "",
      start_date: "",
      end_date: "",
      notes: "",
      status: "AGUARDANDO"
    })
    onClose()
  }

  const handleTotalAmountChange = (value: string) => {
    setFormData(prev => {
      const totalAmount = parseFloat(value) || 0
      const installmentCount = prev.installment_count || 1
      const amountPerInstallment = installmentCount > 0 ? (totalAmount / installmentCount).toFixed(2) : ""
      
      return {
        ...prev,
        total_amount: value,
        amount_per_installment: amountPerInstallment
      }
    })
  }

  const handleInstallmentCountChange = (value: string) => {
    setFormData(prev => {
      const installmentCount = parseInt(value) || 1
      const totalAmount = parseFloat(prev.total_amount) || 0
      const amountPerInstallment = installmentCount > 0 ? (totalAmount / installmentCount).toFixed(2) : ""
      
      return {
        ...prev,
        installment_count: installmentCount,
        amount_per_installment: amountPerInstallment
      }
    })
  }

  const activeEmployees = employees.filter(emp => emp.status === 'ATIVO')
  const activeBudgetLines = budgetLines.filter(bl => bl.budgeted_amount > 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {assistance ? "Editar Auxílio" : "Novo Auxílio"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Funcionário *</Label>
              <Select 
                value={formData.employee.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, employee: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
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
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type || "GRADUACAO"} 
                onValueChange={(value: "GRADUACAO" | "POS_GRADUACAO" | "AUXILIO_CHECHE_ESCOLA" | "LINGUA_ESTRANGEIRA") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRADUACAO">Graduação</SelectItem>
                  <SelectItem value="POS_GRADUACAO">Pós-Graduação</SelectItem>
                  <SelectItem value="AUXILIO_CHECHE_ESCOLA">Auxílio Creche/Escola</SelectItem>
                  <SelectItem value="LINGUA_ESTRANGEIRA">Língua Estrangeira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_line">Linha Orçamentária *</Label>
            <Select 
              value={formData.budget_line.toString()} 
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, budget_line: parseInt(value) }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma linha orçamentária" />
              </SelectTrigger>
              <SelectContent>
                {activeBudgetLines.map((budgetLine) => (
                  <SelectItem key={budgetLine.id} value={budgetLine.id.toString()}>
                    {budgetLine.summary_description || `Linha ${budgetLine.id}`} - R$ {budgetLine.budgeted_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_amount">Valor Total *</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.total_amount}
                onChange={(e) => handleTotalAmountChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installment_count">Número de Parcelas</Label>
              <Input
                id="installment_count"
                type="number"
                min="1"
                value={formData.installment_count}
                onChange={(e) => handleInstallmentCountChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_per_installment">Valor por Parcela</Label>
              <Input
                id="amount_per_installment"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount_per_installment}
                onChange={(e) => setFormData(prev => ({ ...prev, amount_per_installment: e.target.value }))}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "AGUARDANDO" | "ATIVO" | "CONCLUIDO" | "CANCELADO") => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGUARDANDO">Aguardando Início</SelectItem>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Informações adicionais sobre o auxílio..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.employee || !formData.budget_line}>
              {isLoading ? "Salvando..." : assistance ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}