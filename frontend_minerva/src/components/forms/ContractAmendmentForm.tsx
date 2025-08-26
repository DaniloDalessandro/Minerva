"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ContractAmendment {
  id?: number
  amendment_number: number
  description: string
  value_change?: number
  new_due_date?: string
  contract: number
  created_at?: string
}

interface ContractAmendmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContractAmendment) => void
  amendment?: ContractAmendment
  contractId: number
  isLoading?: boolean
}

export function ContractAmendmentForm({
  isOpen,
  onClose,
  onSubmit,
  amendment,
  contractId,
  isLoading = false
}: ContractAmendmentFormProps) {
  const [formData, setFormData] = useState<ContractAmendment>({
    amendment_number: 1,
    description: "",
    value_change: 0,
    new_due_date: "",
    contract: contractId
  })

  useEffect(() => {
    if (amendment) {
      setFormData(amendment)
    }
  }, [amendment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      amendment_number: 1,
      description: "",
      value_change: 0,
      new_due_date: "",
      contract: contractId
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {amendment ? "Editar Aditivo" : "Novo Aditivo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amendment_number">Número do Aditivo *</Label>
            <Input
              id="amendment_number"
              type="number"
              value={formData.amendment_number}
              onChange={(e) => setFormData(prev => ({ ...prev, amendment_number: parseInt(e.target.value) }))}
              required
            />
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

          <div className="space-y-2">
            <Label htmlFor="value_change">Alteração no Valor</Label>
            <Input
              id="value_change"
              type="number"
              step="0.01"
              value={formData.value_change || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, value_change: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_due_date">Nova Data de Vencimento</Label>
            <Input
              id="new_due_date"
              type="date"
              value={formData.new_due_date || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, new_due_date: e.target.value || undefined }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : amendment ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}