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
import { BudgetLine } from "@/lib/api/budgetlines"
import { Budget } from "@/lib/api/budgets"
import { ManagementCenter, RequestingCenter } from "@/lib/api/centers"
import { Employee } from "@/lib/api/employees"

interface ActionsProps {
  budgetLine: BudgetLine
  onEdit: (budgetLine: BudgetLine) => void
  onDelete: (budgetLine: BudgetLine) => void
}

const Actions = ({ budgetLine, onEdit, onDelete }: ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(budgetLine)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(budgetLine)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const budgetLineColumns = (
  onEdit: (budgetLine: BudgetLine) => void,
  onDelete: (budgetLine: BudgetLine) => void,
  budgets: Budget[],
  managementCenters: ManagementCenter[],
  requestingCenters: RequestingCenter[],
  employees: Employee[]
): ColumnDef<BudgetLine>[] => [
  {
    accessorKey: "summary_description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("summary_description") as string
      return description || "Sem descrição"
    },
  },
  {
    accessorKey: "budget",
    header: "Orçamento",
    cell: ({ row }) => {
      const budgetId = row.getValue("budget") as number
      const budget = budgets.find(b => b.id === budgetId)
      return budget ? `${budget.category} ${budget.year}` : "Não encontrado"
    },
  },
  {
    accessorKey: "expense_type",
    header: "Tipo de Despesa",
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      return category ? (
        <Badge variant={category === "CAPEX" ? "default" : "secondary"}>
          {category}
        </Badge>
      ) : "Não especificado"
    },
  },
  {
    accessorKey: "management_center",
    header: "Centro Gestor",
    cell: ({ row }) => {
      const centerId = row.getValue("management_center") as number
      const center = managementCenters.find(mc => mc.id === centerId)
      return center ? center.name : "Não especificado"
    },
  },
  {
    accessorKey: "requesting_center",
    header: "Centro Solicitante",
    cell: ({ row }) => {
      const centerId = row.getValue("requesting_center") as number
      const center = requestingCenters.find(rc => rc.id === centerId)
      return center ? center.name : "Não especificado"
    },
  },
  {
    accessorKey: "budgeted_amount",
    header: "Valor Orçado",
    cell: ({ row }) => {
      const amount = row.getValue("budgeted_amount") as number
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
    },
  },
  {
    accessorKey: "probable_procurement_type",
    header: "Tipo de Aquisição",
    cell: ({ row }) => {
      const type = row.getValue("probable_procurement_type") as string
      return (
        <span className="text-sm">{type}</span>
      )
    },
  },
  {
    accessorKey: "process_status",
    header: "Status do Processo",
    cell: ({ row }) => {
      const status = row.getValue("process_status") as string
      if (!status) return "Não especificado"
      
      const variant = status.includes("PRAZO") || status === "ELABORADO NO PRAZO" ? "default" : 
                    status.includes("ATRASO") || status === "VENCIDO" ? "destructive" : "secondary"
      
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "contract_status",
    header: "Status do Contrato",
    cell: ({ row }) => {
      const status = row.getValue("contract_status") as string
      if (!status) return "Não especificado"
      
      const variant = status.includes("PRAZO") && !status.includes("VENCIDO") ? "default" : 
                    status.includes("VENCIDO") ? "destructive" : "secondary"
      
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const budgetLine = row.original
      return <Actions budgetLine={budgetLine} onEdit={onEdit} onDelete={onDelete} />
    },
  },
]