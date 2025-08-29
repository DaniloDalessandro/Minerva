import { ColumnDef } from "@tanstack/react-table";
import { Auxilio } from "@/lib/api/auxilios";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, User } from "lucide-react";

export const columns: ColumnDef<Auxilio>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <span className="font-mono text-sm">
          #{id}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "employee.full_name",
    header: "Colaborador",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const employeeName = row.original.employee?.full_name;
      
      if (isOptimistic && !employeeName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">
            {employeeName || "-"}
          </span>
        </div>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    enableSorting: true,
    cell: ({ row }) => {
      const type = row.original.type;
      
      const getTypeVariant = (type: string) => {
        switch (type) {
          case 'GRADUACAO':
            return 'default';
          case 'POS_GRADUACAO':
            return 'secondary';
          case 'AUXILIO_CRECHE_ESCOLA':
            return 'outline';
          case 'LINGUA_ESTRANGEIRA':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      const getTypeLabel = (type: string) => {
        switch (type) {
          case 'GRADUACAO':
            return 'Graduação';
          case 'POS_GRADUACAO':
            return 'Pós-Graduação';
          case 'AUXILIO_CRECHE_ESCOLA':
            return 'Creche/Escola';
          case 'LINGUA_ESTRANGEIRA':
            return 'Língua Estrangeira';
          default:
            return type;
        }
      };

      return (
        <Badge variant={getTypeVariant(type)} className="text-xs">
          {getTypeLabel(type)}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "total_amount",
    header: "Valor Total",
    enableSorting: true,
    cell: ({ row }) => {
      const totalAmount = row.original.total_amount;
      return (
        <span className="font-mono text-green-600 font-semibold">
          R$ {parseFloat(totalAmount).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "installment_count",
    header: "Parcelas",
    enableSorting: true,
    cell: ({ row }) => {
      const installmentCount = row.original.installment_count;
      return (
        <span className="font-mono">
          {installmentCount}x
        </span>
      );
    },
  },
  {
    accessorKey: "amount_per_installment",
    header: "Valor por Parcela",
    enableSorting: true,
    cell: ({ row }) => {
      const amountPerInstallment = row.original.amount_per_installment;
      return (
        <span className="font-mono text-blue-600">
          R$ {parseFloat(amountPerInstallment).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Data Início",
    enableSorting: true,
    cell: ({ row }) => {
      const startDate = row.original.start_date;
      if (!startDate) return "-";
      
      return (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {new Date(startDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: "Data Fim",
    enableSorting: true,
    cell: ({ row }) => {
      const endDate = row.original.end_date;
      if (!endDate) return "-";
      
      const endDateObj = new Date(endDate);
      const today = new Date();
      const daysDiff = Math.ceil((endDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));
      const isExpiringSoon = daysDiff <= 30 && daysDiff >= 0;
      const isExpired = daysDiff < 0;
      
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : ''}`}>
            {endDateObj.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          {(isExpiringSoon || isExpired) && (
            <AlertTriangle className={`w-4 h-4 ${isExpired ? 'text-red-500' : 'text-yellow-500'}`} />
          )}
        </div>
      );
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
          case 'AGUARDANDO':
            return 'outline';
          case 'ATIVO':
            return 'default';
          case 'CONCLUIDO':
            return 'secondary';
          case 'CANCELADO':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'AGUARDANDO':
            return 'Aguardando';
          case 'ATIVO':
            return 'Ativo';
          case 'CONCLUIDO':
            return 'Concluído';
          case 'CANCELADO':
            return 'Cancelado';
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
    accessorKey: "budget_line.name",
    header: "Linha Orçamentária",
    enableSorting: false,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const budgetLineName = row.original.budget_line?.name;
      
      if (isOptimistic && !budgetLineName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <span className="text-sm">
          {budgetLineName || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Observações",
    enableSorting: false,
    cell: ({ row }) => {
      const notes = row.original.notes;
      if (!notes) return "-";
      
      return (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={notes}>
          {notes}
        </span>
      );
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
];