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
import { Budget, BudgetMovement } from "@/lib/api/budgets"
import { ManagementCenter } from "@/lib/api/centers"

interface BudgetActionsProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
}

interface BudgetMovementActionsProps {
  movement: BudgetMovement
  onEdit: (movement: BudgetMovement) => void
  onDelete: (movement: BudgetMovement) => void
}

const BudgetActions = ({ budget, onEdit, onDelete }: BudgetActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(budget)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(budget)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const BudgetMovementActions = ({ movement, onEdit, onDelete }: BudgetMovementActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(movement)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(movement)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const budgetColumns = (
  onEdit: (budget: Budget) => void,
  onDelete: (budget: Budget) => void,
  managementCenters: ManagementCenter[]
): ColumnDef<Budget>[] => [
  {
    accessorKey: "year",
    header: "Ano",
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      return (
        <Badge variant={category === "CAPEX" ? "default" : "secondary"}>
          {category}
        </Badge>
      )
    },
  },
  {
    accessorKey: "management_center",
    header: "Centro Gestor",
    cell: ({ row }) => {
      const managementCenterId = row.getValue("management_center") as number
      const managementCenter = managementCenters.find(mc => mc.id === managementCenterId)
      return managementCenter ? managementCenter.name : "Não encontrado"
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
    accessorKey: "available_amount",
    header: "Valor Disponível",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("available_amount"))
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
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
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString("pt-BR")
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const budget = row.original
      return <BudgetActions budget={budget} onEdit={onEdit} onDelete={onDelete} />
    },
  },
]

export const budgetMovementColumns = (
  onEdit: (movement: BudgetMovement) => void,
  onDelete: (movement: BudgetMovement) => void,
  budgets: Budget[]
): ColumnDef<BudgetMovement>[] => [
  {
    accessorKey: "source",
    header: "Origem",
    cell: ({ row }) => {
      const sourceId = row.getValue("source") as number
      const sourceBudget = budgets.find(b => b.id === sourceId)
      return sourceBudget ? `${sourceBudget.category} ${sourceBudget.year}` : "Não encontrado"
    },
  },
  {
    accessorKey: "destination",
    header: "Destino",
    cell: ({ row }) => {
      const destinationId = row.getValue("destination") as number
      const destinationBudget = budgets.find(b => b.id === destinationId)
      return destinationBudget ? `${destinationBudget.category} ${destinationBudget.year}` : "Não encontrado"
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
    },
  },
  {
    accessorKey: "movement_date",
    header: "Data da Movimentação",
    cell: ({ row }) => {
      const date = new Date(row.getValue("movement_date"))
      return date.toLocaleDateString("pt-BR")
    },
  },
  {
    accessorKey: "notes",
    header: "Observações",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return notes ? (
        <span className="text-sm text-muted-foreground">{notes}</span>
      ) : (
        <span className="text-sm text-muted-foreground italic">Sem observações</span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const movement = row.original
      return <BudgetMovementActions movement={movement} onEdit={onEdit} onDelete={onDelete} />
    },
  },
]