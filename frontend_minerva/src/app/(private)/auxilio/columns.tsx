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
import { Assistance } from "@/lib/api/aids"
import { Employee } from "@/lib/api/employees"
import { BudgetLine } from "@/lib/api/budgetlines"

interface ActionsProps {
  assistance: Assistance
  onEdit: (assistance: Assistance) => void
  onDelete: (assistance: Assistance) => void
}

const Actions = ({ assistance, onEdit, onDelete }: ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(assistance)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(assistance)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ATIVO':
      return 'default'
    case 'AGUARDANDO':
      return 'secondary'
    case 'CONCLUIDO':
      return 'outline'
    case 'CANCELADO':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'GRADUACAO':
      return 'Graduação'
    case 'POS_GRADUACAO':
      return 'Pós-Graduação'
    case 'AUXILIO_CHECHE_ESCOLA':
      return 'Auxílio Creche/Escola'
    case 'LINGUA_ESTRANGEIRA':
      return 'Língua Estrangeira'
    default:
      return 'Não especificado'
  }
}

export const assistanceColumns = (
  onEdit: (assistance: Assistance) => void,
  onDelete: (assistance: Assistance) => void,
  employees: Employee[],
  budgetLines: BudgetLine[]
): ColumnDef<Assistance>[] => [
  {
    accessorKey: "employee",
    header: "Funcionário",
    cell: ({ row }) => {
      const employeeId = row.getValue("employee") as number
      const employee = employees.find(emp => emp.id === employeeId)
      return employee ? employee.full_name : "Não encontrado"
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return getTypeLabel(type)
    },
  },
  {
    accessorKey: "budget_line",
    header: "Linha Orçamentária",
    cell: ({ row }) => {
      const budgetLineId = row.getValue("budget_line") as number
      const budgetLine = budgetLines.find(bl => bl.id === budgetLineId)
      return budgetLine ? (budgetLine.summary_description || "Sem descrição") : "Não encontrado"
    },
  },
  {
    accessorKey: "total_amount",
    header: "Valor Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
    },
  },
  {
    accessorKey: "installment_count",
    header: "Parcelas",
    cell: ({ row }) => {
      const count = row.getValue("installment_count") as number
      return count || "Não especificado"
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
    accessorKey: "end_date",
    header: "Data de Término",
    cell: ({ row }) => {
      const date = row.getValue("end_date") as string
      return date ? new Date(date).toLocaleDateString("pt-BR") : "Não especificado"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const assistance = row.original
      return <Actions assistance={assistance} onEdit={onEdit} onDelete={onDelete} />
    },
  },
]