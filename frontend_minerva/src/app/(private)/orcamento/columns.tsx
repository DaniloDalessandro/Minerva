import { ColumnDef } from "@tanstack/react-table";
import { Budget } from "@/lib/api/budgets";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns = (
  onViewContracts: (budget: Budget) => void,
  onEdit: (budget: Budget) => void,
  onDelete: (budget: Budget) => void
): ColumnDef<Budget>[] => [
  {
    accessorKey: "year",
    header: "Ano",
    enableSorting: true,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "management_center.name",
    header: "Centro Gestor",
    enableSorting: false,
    cell: ({ row }) => row.original.management_center?.name ?? "-",
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => (
      <Badge variant={row.original.category === 'CAPEX' ? 'default' : 'secondary'}>
        {row.original.category}
      </Badge>
    ),
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "total_amount",
    header: "Valor Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.total_amount);
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    },
  },
  {
    accessorKey: "available_amount",
    header: "Valor Disponível",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.available_amount);
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    },
  },
  {
    id: "used_amount",
    header: "Valor Utilizado",
    cell: ({ row }) => {
      const total = parseFloat(row.original.total_amount);
      const available = parseFloat(row.original.available_amount);
      const used = total - available;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(used);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'ATIVO' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    enableSorting: true,
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(",", ""),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewContracts(row.original)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver contratos</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(row.original)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar orçamento</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(row.original)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir orçamento</span>
        </Button>
      </div>
    ),
  },
];
