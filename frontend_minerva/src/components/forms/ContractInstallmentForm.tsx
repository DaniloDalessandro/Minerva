"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ContractInstallment {
  id?: number
  installment_number: number
  amount: number
  due_date: string
  status: "PENDING" | "PAID" | "OVERDUE"
  contract: number
}

interface ContractInstallmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContractInstallment) => void
  installment?: ContractInstallment
  contractId: number
  isLoading?: boolean
}

export function ContractInstallmentForm({
  isOpen,
  onClose,
  onSubmit,
  installment,
  contractId,
  isLoading = false
}: ContractInstallmentFormProps) {
  const [formData, setFormData] = useState<ContractInstallment>({
    installment_number: 1,
    amount: 0,
    due_date: "",
    status: "PENDING",
    contract: contractId
  })

  useEffect(() => {
    if (installment) {
      setFormData(installment)
    }
  }, [installment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      installment_number: 1,
      amount: 0,
      due_date: "",
      status: "PENDING",
      contract: contractId
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {installment ? "Editar Parcela" : "Nova Parcela"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="installment_number">Número da Parcela *</Label>
            <Input
              id="installment_number"
              type="number"
              value={formData.installment_number}
              onChange={(e) => setFormData(prev => ({ ...prev, installment_number: parseInt(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Data de Vencimento *</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : installment ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}