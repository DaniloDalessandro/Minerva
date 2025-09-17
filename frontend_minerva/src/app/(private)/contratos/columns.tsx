import { ColumnDef } from "@tanstack/react-table";
import { Contract } from "@/lib/api/contratos";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar } from "lucide-react";

export const defaultColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "protocol_number",
    header: "Protocolo",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const protocolNumber = row.original.protocol_number;
      
      if (isOptimistic && protocolNumber === 'Aguardando...') {
        return <span className="text-gray-400 italic">Gerando...</span>;
      }
      
      return (
        <span className="font-mono text-sm font-semibold text-blue-600">
          {protocolNumber}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "main_inspector.full_name",
    header: "Fiscal Principal",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const inspectorName = row.original.main_inspector?.full_name;
      
      if (isOptimistic && !inspectorName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return inspectorName || "-";
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "payment_nature",
    header: "Natureza Pagamento",
    enableSorting: true,
    cell: ({ row }) => {
      const paymentNature = row.original.payment_nature;
      
      const getPaymentNatureVariant = (nature: string) => {
        switch (nature) {
          case 'PAGAMENTO ÚNICO':
            return 'default';
          case 'PAGAMENTO MENSAL':
            return 'secondary';
          case 'PAGAMENTO ANUAL':
            return 'outline';
          case 'PAGAMENTO TRIMESTRAL':
          case 'PAGAMENTO SEMESTRAL':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      const getPaymentNatureLabel = (nature: string) => {
        switch (nature) {
          case 'PAGAMENTO ÚNICO':
            return 'Único';
          case 'PAGAMENTO ANUAL':
            return 'Anual';
          case 'PAGAMENTO SEMANAL':
            return 'Semanal';
          case 'PAGAMENTO MENSAL':
            return 'Mensal';
          case 'PAGAMENTO QUINZENAL':
            return 'Quinzenal';
          case 'PAGAMENTO TRIMESTRAL':
            return 'Trimestral';
          case 'PAGAMENTO SEMESTRAL':
            return 'Semestral';
          case 'PAGAMENTO SOB DEMANDA':
            return 'Sob Demanda';
          default:
            return nature;
        }
      };

      return (
        <Badge variant={getPaymentNatureVariant(paymentNature)} className="text-xs">
          {getPaymentNatureLabel(paymentNature)}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
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
          case 'ENCERRADO':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'ATIVO':
            return 'Ativo';
          case 'ENCERRADO':
            return 'Encerrado';
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
];

export const optionalColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    enableHiding: true,
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
    accessorKey: "substitute_inspector.full_name",
    header: "Fiscal Substituto",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const inspectorName = row.original.substitute_inspector?.full_name;
      
      if (isOptimistic && !inspectorName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <span className="text-sm text-gray-600">
          {inspectorName || "-"}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "original_value",
    header: "Valor Original",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const originalValue = row.original.original_value;
      return (
        <span className="font-mono text-green-600 font-semibold">
          R$ {parseFloat(originalValue).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "current_value",
    header: "Valor Atual",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const originalValue = parseFloat(row.original.original_value);
      const currentValue = parseFloat(row.original.current_value);
      const hasChanged = originalValue !== currentValue;
      
      return (
        <div className="flex flex-col">
          <span className={`font-mono font-semibold ${hasChanged ? 'text-blue-600' : 'text-green-600'}`}>
            R$ {currentValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {hasChanged && (
            <span className="text-xs text-gray-500">
              {currentValue > originalValue ? '↗️ Acréscimo' : '↘️ Redução'}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Data Início",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const startDate = row.original.start_date;
      if (!startDate) return "-";
      
      return new Date(startDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "end_date",
    header: "Data Fim",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const endDate = row.original.end_date;
      if (!endDate) return "-";
      
      return new Date(endDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "expiration_date",
    header: "Vencimento",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const expirationDate = row.original.expiration_date;
      if (!expirationDate) return "-";
      
      const expDate = new Date(expirationDate);
      const today = new Date();
      const daysDiff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      const isExpiringSoon = daysDiff <= 30 && daysDiff >= 0;
      const isExpired = daysDiff < 0;
      
      return (
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : ''}`}>
            {expDate.toLocaleDateString("pt-BR", {
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
    accessorKey: "budget_line.name",
    header: "Linha Orçamentária",
    enableSorting: false,
    enableHiding: true,
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
    accessorKey: "description",
    header: "Descrição",
    enableSorting: false,
    enableHiding: true,
    cell: ({ row }) => {
      const description = row.original.description;
      if (!description) return "-";
      
      return (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "signing_date",
    header: "Data Assinatura",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const signingDate = row.original.signing_date;
      if (!signingDate) return "-";
      
      return (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm">
            {new Date(signingDate).toLocaleDateString("pt-BR", {
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
    accessorKey: "created_at",
    header: "Criado em",
    enableSorting: true,
    enableHiding: true,
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
    enableHiding: true,
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

export const columns = [...defaultColumns, ...optionalColumns];