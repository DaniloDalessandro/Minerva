import { ColumnDef } from "@tanstack/react-table";
import { Direction } from "@/lib/api/directions";

export const columns = (): ColumnDef<Direction>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    enableSorting: true,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("pt-BR"),
  },
  {
    accessorKey: "updated_at",
    header: "Atualizado em",
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleDateString("pt-BR"),
  },
  {
    accessorKey: "created_by",
    header: "Criado por",
    cell: ({ row }) => row.original.created_by?.username ?? "-",
  },
  {
    accessorKey: "updated_by",
    header: "Atualizado por",
    cell: ({ row }) => row.original.updated_by?.username ?? "-",
  },
];
