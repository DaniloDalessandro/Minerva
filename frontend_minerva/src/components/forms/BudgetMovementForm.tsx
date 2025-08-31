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
import { BudgetMovement, CreateBudgetMovementData, Budget } from "@/lib/api/budgets"

interface BudgetMovementFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateBudgetMovementData) => void
  movement?: BudgetMovement
  budgets: Budget[]
  isLoading?: boolean
}

export function BudgetMovementForm({
  isOpen,
  onClose,
  onSubmit,
  movement,
  budgets,
  isLoading = false
}: BudgetMovementFormProps) {
  const [formData, setFormData] = useState<CreateBudgetMovementData>({
    source: 0,
    destination: 0,
    amount: "",
    notes: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (movement) {
      setFormData({
        source: movement.source,
        destination: movement.destination,
        amount: movement.amount,
        notes: movement.notes || ""
      })
    } else {
      setFormData({
        source: 0,
        destination: 0,
        amount: "",
        notes: ""
      })
    }
    setErrors({})
  }, [movement])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar orçamento de origem
    if (!formData.source || formData.source === 0) {
      newErrors.source = "Orçamento de origem é obrigatório"
    }

    // Validar orçamento de destino
    if (!formData.destination || formData.destination === 0) {
      newErrors.destination = "Orçamento de destino é obrigatório"
    }

    // Validar se origem e destino são diferentes
    if (formData.source && formData.destination && formData.source === formData.destination) {
      newErrors.destination = "Orçamento de destino deve ser diferente do orçamento de origem"
    }

    // Validar valor
    const amount = parseFloat(formData.amount)
    if (!formData.amount || amount <= 0) {
      newErrors.amount = "Valor deve ser maior que zero"
    } else if (formData.source) {
      const sourceBudget = budgets.find(b => b.id === formData.source)
      if (sourceBudget) {
        const availableAmount = parseFloat(sourceBudget.available_amount)
        if (amount > availableAmount) {
          newErrors.amount = `Valor não pode ser maior que R$ ${availableAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (valor disponível no orçamento de origem)`
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      source: 0,
      destination: 0,
      amount: "",
      notes: ""
    })
    setErrors({})
    onClose()
  }

  const activeBudgets = budgets.filter(b => b.status === 'ATIVO')

  const handleSourceChange = (value: string) => {
    setFormData(prev => ({ ...prev, source: parseInt(value) }))
    if (errors.source) {
      setErrors(prev => ({ ...prev, source: "" }))
    }
  }

  const handleDestinationChange = (value: string) => {
    setFormData(prev => ({ ...prev, destination: parseInt(value) }))
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: "" }))
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, amount: e.target.value }))
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {movement ? "Editar Movimentação" : "Nova Movimentação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Orçamento Origem *</Label>
            <Select 
              value={formData.source.toString()} 
              onValueChange={handleSourceChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o orçamento origem" />
              </SelectTrigger>
              <SelectContent>
                {activeBudgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id.toString()}>
                    <span className="text-sm">
                      {budget.category} {budget.year} - {budget.management_center?.name || 'N/A'} - R$ {parseFloat(budget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && <span className="text-sm text-red-500">{errors.source}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Orçamento Destino *</Label>
            <Select 
              value={formData.destination.toString()} 
              onValueChange={handleDestinationChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o orçamento destino" />
              </SelectTrigger>
              <SelectContent>
                {activeBudgets
                  .filter(budget => budget.id !== formData.source)
                  .map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      <span className="text-sm">
                        {budget.category} {budget.year} - {budget.management_center?.name || 'N/A'} - R$ {parseFloat(budget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.destination && <span className="text-sm text-red-500">{errors.destination}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleAmountChange}
              required
            />
            {formData.source > 0 && (() => {
              const sourceBudget = budgets.find(b => b.id === formData.source)
              if (sourceBudget) {
                return (
                  <p className="text-sm text-muted-foreground">
                    Valor máximo disponível: R$ {parseFloat(sourceBudget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )
              }
              return null
            })()}
            {errors.amount && <span className="text-sm text-red-500">{errors.amount}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Descreva o motivo da movimentação..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.source || !formData.destination || formData.source === formData.destination}
            >
              {isLoading ? "Salvando..." : movement ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}