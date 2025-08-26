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
  }, [movement])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      source: 0,
      destination: 0,
      amount: "",
      notes: ""
    })
    onClose()
  }

  const activeBudgets = budgets.filter(b => b.status === 'ATIVO')

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
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
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, source: parseInt(value) }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o orçamento origem" />
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
            <Label htmlFor="destination">Orçamento Destino *</Label>
            <Select 
              value={formData.destination.toString()} 
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, destination: parseInt(value) }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o orçamento destino" />
              </SelectTrigger>
              <SelectContent>
                {activeBudgets
                  .filter(budget => budget.id !== formData.source)
                  .map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      {budget.category} {budget.year} - R$ {parseFloat(budget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
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