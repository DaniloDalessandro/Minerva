import { Edit, Trash } from "lucide-react";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "ano",
    header: "Ano",
    enableSorting: true,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "centro_custo",
    header: "Centro de Custo",
    enableSorting: false,
  },
  {
    accessorKey: "classe",
    header: "Classe",
  },
  {
    accessorKey: "valor_total",
    header: "Valor Total",
  },
  {
    accessorKey: "valor_utilizado",
    header: "Valor Utilizado",
  },
  {
    accessorKey: "valor_restante",
    header: "Valor Restante",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "orcamento",
    header: "Orçamento",
  },
  
];
