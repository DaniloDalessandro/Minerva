"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Contract, ContractInstallment, ContractAmendment } from "@/lib/api/contracts"
import { BudgetLine } from "@/lib/api/budgetlines"
import { Employee } from "@/lib/api/employees"

interface ContractActionsProps {
  contract: Contract
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
}

const ContractActions = ({ contract, onEdit, onDelete }: ContractActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(contract)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(contract)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const contractColumns = (
  onEdit: (contract: Contract) => void,
  onDelete: (contract: Contract) => void,
  budgetLines: BudgetLine[],
  employees: Employee[]
): ColumnDef<Contract>[] => [
  {
    accessorKey: "protocol_number",
    header: "Número do Protocolo",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "budget_line",
    header: "Linha Orçamentária",
    cell: ({ row }) => {
      const budgetLineId = row.getValue("budget_line") as number
      const budgetLine = budgetLines.find(bl => bl.id === budgetLineId)
      return budgetLine ? (budgetLine.summary_description || `Linha ${budgetLine.id}`) : "Não encontrado"
    },
  },
  {
    accessorKey: "main_inspector",
    header: "Fiscal Principal",
    cell: ({ row }) => {
      const inspectorId = row.getValue("main_inspector") as number
      const inspector = employees.find(emp => emp.id === inspectorId)
      return inspector ? inspector.full_name : "Não encontrado"
    },
  },
  {
    accessorKey: "original_value",
    header: "Valor Original",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("original_value"))
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
    },
  },
  {
    accessorKey: "current_value",
    header: "Valor Atual",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("current_value"))
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
    },
  },
  {
    accessorKey: "start_date",
    header: "Data de Início",
    cell: ({ row }) => {
      const date = new Date(row.getValue("start_date"))
      return date.toLocaleDateString("pt-BR")
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "ATIVO" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const contract = row.original
      return <ContractActions contract={contract} onEdit={onEdit} onDelete={onDelete} />
    },
  },
]

export const contractInstallmentColumns: ColumnDef<ContractInstallment>[] = []
export const contractAmendmentColumns: ColumnDef<ContractAmendment>[] = []