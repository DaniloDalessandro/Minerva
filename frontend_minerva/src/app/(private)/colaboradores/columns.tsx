import { ColumnDef } from "@tanstack/react-table";
import { Colaborador } from "@/lib/api/colaboradores";

export const columns: ColumnDef<Colaborador>[] = [
  {
    accessorKey: "full_name",
    header: "Nome",
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.original.full_name;
      return <span>{name}</span>;
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    enableSorting: true,
    cell: ({ row }) => {
      const cpf = row.original.cpf;
      return <span>{cpf}</span>;
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "direction",
    header: "Direção",
    enableSorting: false,
    cell: ({ row }) => {
      const directionName = row.original.direction?.name;
      return <span>{directionName || "-"}</span>;
    },
  },
  {
    accessorKey: "management",
    header: "Gerência",
    enableSorting: false,
    cell: ({ row }) => {
      const managementName = row.original.management?.name;
      return <span>{managementName || "-"}</span>;
    },
  },
  {
    accessorKey: "coordination",
    header: "Coordenação",
    enableSorting: false,
    cell: ({ row }) => {
      const coordinationName = row.original.coordination?.name;
      return <span>{coordinationName || "-"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      
      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'ATIVO':
            return 'Ativo';
          case 'INATIVO':
            return 'Inativo';
          case 'FERIAS':
            return 'Férias';
          case 'AFASTADO':
            return 'Afastado';
          default:
            return status;
        }
      };

      return <span>{getStatusLabel(status)}</span>;
    },
    meta: {
      showFilterIcon: true,
    },
  },
];