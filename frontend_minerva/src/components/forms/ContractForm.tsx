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
import { Contract, CreateContractData } from "@/lib/api/contracts"
import { BudgetLine } from "@/lib/api/budgetlines"
import { Employee } from "@/lib/api/employees"

interface ContractFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateContractData) => void
  contract?: Contract
  budgetLines: BudgetLine[]
  employees: Employee[]
  isLoading?: boolean
}

export function ContractForm({
  isOpen,
  onClose,
  onSubmit,
  contract,
  budgetLines,
  employees,
  isLoading = false
}: ContractFormProps) {
  const [formData, setFormData] = useState<CreateContractData>({
    budget_line: 0,
    signing_date: "",
    expiration_date: "",
    main_inspector: 0,
    substitute_inspector: 0,
    payment_nature: "PAGAMENTO ÚNICO",
    description: "",
    original_value: "",
    current_value: "",
    start_date: "",
    end_date: "",
    status: "ATIVO"
  })

  useEffect(() => {
    if (contract) {
      setFormData({
        budget_line: contract.budget_line,
        signing_date: contract.signing_date || "",
        expiration_date: contract.expiration_date || "",
        main_inspector: contract.main_inspector,
        substitute_inspector: contract.substitute_inspector,
        payment_nature: contract.payment_nature,
        description: contract.description,
        original_value: contract.original_value,
        current_value: contract.current_value,
        start_date: contract.start_date,
        end_date: contract.end_date || "",
        status: contract.status
      })
    } else {
      setFormData({
        budget_line: 0,
        signing_date: "",
        expiration_date: "",
        main_inspector: 0,
        substitute_inspector: 0,
        payment_nature: "PAGAMENTO ÚNICO",
        description: "",
        original_value: "",
        current_value: "",
        start_date: "",
        end_date: "",
        status: "ATIVO"
      })
    }
  }, [contract])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      budget_line: 0,
      signing_date: "",
      expiration_date: "",
      main_inspector: 0,
      substitute_inspector: 0,
      payment_nature: "PAGAMENTO ÚNICO",
      description: "",
      original_value: "",
      current_value: "",
      start_date: "",
      end_date: "",
      status: "ATIVO"
    })
    onClose()
  }

  const handleOriginalValueChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      original_value: value,
      current_value: prev.current_value || value
    }))
  }

  const activeEmployees = employees.filter(emp => emp.status === 'ATIVO')
  const activeBudgetLines = budgetLines.filter(bl => bl.budgeted_amount > 0)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contract ? "Editar Contrato" : "Novo Contrato"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main_inspector">Fiscal Principal *</Label>
              <Select 
                value={formData.main_inspector.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, main_inspector: parseInt(value) }))
                }
                required
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
              <Label htmlFor="substitute_inspector">Fiscal Substituto *</Label>
              <Select 
                value={formData.substitute_inspector.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, substitute_inspector: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fiscal substituto" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees
                    .filter(emp => emp.id !== formData.main_inspector)
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
            <Label htmlFor="payment_nature">Natureza do Pagamento *</Label>
            <Select 
              value={formData.payment_nature} 
              onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, payment_nature: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAGAMENTO ÚNICO">Pagamento Único</SelectItem>
                <SelectItem value="PAGAMENTO ANUAL">Pagamento Anual</SelectItem>
                <SelectItem value="PAGAMENTO SEMANAL">Pagamento Semanal</SelectItem>
                <SelectItem value="PAGAMENTO MENSAL">Pagamento Mensal</SelectItem>
                <SelectItem value="PAGAMENTO QUIZENAL">Pagamento Quinzenal</SelectItem>
                <SelectItem value="PAGAMENTO TRIMESTRAL">Pagamento Trimestral</SelectItem>
                <SelectItem value="PAGAMENTO SEMESTRAL">Pagamento Semestral</SelectItem>
                <SelectItem value="PAGAMENTO SOB DEMANDA">Pagamento Sob Demanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="original_value">Valor Original *</Label>
              <Input
                id="original_value"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.original_value}
                onChange={(e) => handleOriginalValueChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_value">Valor Atual *</Label>
              <Input
                id="current_value"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.current_value}
                onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                required
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signing_date">Data de Assinatura</Label>
              <Input
                id="signing_date"
                type="date"
                value={formData.signing_date}
                onChange={(e) => setFormData(prev => ({ ...prev, signing_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration_date">Data de Expiração</Label>
              <Input
                id="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "ATIVO" | "ENCERRADO") => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="ENCERRADO">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.budget_line || !formData.main_inspector || !formData.substitute_inspector || formData.main_inspector === formData.substitute_inspector}
            >
              {isLoading ? "Salvando..." : contract ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}