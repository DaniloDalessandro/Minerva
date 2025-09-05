import { ColumnDef } from "@tanstack/react-table";
import { Colaborador } from "@/lib/api/colaboradores";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Colaborador>[] = [
  {
    accessorKey: "full_name",
    header: "Nome",
    enableSorting: true,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    enableSorting: true,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <span className="text-sm font-mono text-gray-600">
          {email}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "position",
    header: "Cargo",
    enableSorting: true,
    cell: ({ row }) => {
      const position = row.original.position;
      return position || "-";
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
      const isOptimistic = row.original.isOptimistic;
      const directionName = row.original.direction?.name;
      
      if (isOptimistic && !directionName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return directionName || "-";
    },
  },
  {
    accessorKey: "management",
    header: "Gerência",
    enableSorting: false,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const managementName = row.original.management?.name;
      
      if (isOptimistic && !managementName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return managementName || "-";
    },
  },
  {
    accessorKey: "coordination",
    header: "Coordenação",
    enableSorting: false,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const coordinationName = row.original.coordination?.name;
      
      if (isOptimistic && !coordinationName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return coordinationName || "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const status = row.original.status;
      
      const getStatusVariant = (status: string) => {
        switch (status) {
          case 'ATIVO':
            return 'default';
          case 'INATIVO':
            return 'destructive';
          case 'FERIAS':
            return 'secondary';
          case 'AFASTADO':
            return 'outline';
          default:
            return 'secondary';
        }
      };

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

      return (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
          {isOptimistic && (
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              Salvando...
            </Badge>
          )}
        </div>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    enableSorting: false,
    cell: ({ row }) => {
      const phone = row.original.phone;
      return phone || "-";
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
    accessorKey: "updated_at",
    header: "Atualizado em",
    enableSorting: true,
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(",", ""),
  },
  {
    accessorKey: "created_by",
    header: "Criado por",
    enableSorting: false,
    cell: ({ row }) => {
      const createdBy = row.original.created_by;
      if (createdBy) {
        return createdBy.first_name && createdBy.last_name 
          ? `${createdBy.first_name} ${createdBy.last_name}` 
          : createdBy.email;
      }
      return "N/A";
    },
  },
  {
    accessorKey: "updated_by",
    header: "Atualizado por",
    enableSorting: false,
    cell: ({ row }) => {
      const updatedBy = row.original.updated_by;
      if (updatedBy) {
        return updatedBy.first_name && updatedBy.last_name 
          ? `${updatedBy.first_name} ${updatedBy.last_name}` 
          : updatedBy.email;
      }
      return "N/A";
    },
  },
];