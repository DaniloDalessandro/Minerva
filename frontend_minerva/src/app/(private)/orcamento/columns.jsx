export const columns = [
  {
    accessorKey: "ano",
    header: "Ano",
    enableSorting: true,
    cell: ({ getValue }) => getValue()
  },
  {
    accessorKey: "centro_custo",
    header: "Centro de Custo",
    enableSorting: false,
    cell: ({ getValue }) => getValue()
  },
  { accessorKey: "classe", header: "Classe" },
  { accessorKey: "valor_total", header: "Valor Total" },
  { accessorKey: "valor_utilizado", header: "Valor Utilizado" },
  { accessorKey: "valor_restante", header: "Valor Restante" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "orcamento", header: "Orçamento" },
];
