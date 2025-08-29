import { ColumnDef } from "@tanstack/react-table";
import { BudgetLine } from "@/lib/api/budgetlines";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<BudgetLine>[] = [
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
    accessorKey: "budget.name",
    header: "Orçamento",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const budgetName = row.original.budget?.name;
      
      if (isOptimistic && !budgetName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return budgetName || "-";
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    enableSorting: true,
    cell: ({ row }) => {
      const category = row.original.category;
      
      const getCategoryVariant = (category: string) => {
        switch (category) {
          case 'CAPEX':
            return 'destructive';
          case 'OPEX':
            return 'default';
          default:
            return 'secondary';
        }
      };

      return (
        <Badge variant={getCategoryVariant(category)}>
          {category}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "expense_type",
    header: "Tipo de Despesa",
    enableSorting: true,
    cell: ({ row }) => {
      const expenseType = row.original.expense_type;
      
      const getExpenseTypeVariant = (type: string) => {
        switch (type) {
          case 'Base Principal':
            return 'default';
          case 'Serviços Especializados':
            return 'secondary';
          case 'Despesas Compartilhadas':
            return 'outline';
          default:
            return 'secondary';
        }
      };

      return (
        <Badge variant={getExpenseTypeVariant(expenseType)}>
          {expenseType}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "summary_description",
    header: "Descrição",
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.original.summary_description;
      if (!description) return "-";
      
      return (
        <span className="text-sm max-w-xs truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "budgeted_amount",
    header: "Valor Orçado",
    enableSorting: true,
    cell: ({ row }) => {
      const budgetedAmount = row.original.budgeted_amount;
      return (
        <span className="font-mono text-green-600 font-semibold">
          R$ {parseFloat(budgetedAmount).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "management_center.name",
    header: "Centro Gestor",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const centerName = row.original.management_center?.name;
      
      if (isOptimistic && !centerName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <span className="text-sm">
          {centerName || "-"}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "requesting_center.name",
    header: "Centro Solicitante",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const centerName = row.original.requesting_center?.name;
      
      if (isOptimistic && !centerName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <span className="text-sm">
          {centerName || "-"}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "contract_type",
    header: "Tipo de Contrato",
    enableSorting: true,
    cell: ({ row }) => {
      const contractType = row.original.contract_type;
      
      const getContractTypeVariant = (type: string) => {
        switch (type) {
          case 'SERVIÇO':
            return 'default';
          case 'FORNECIMENTO':
            return 'secondary';
          case 'ASSINATURA':
            return 'outline';
          case 'FORNECIMENTO/SERVIÇO':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      const getContractTypeLabel = (type: string) => {
        switch (type) {
          case 'SERVIÇO':
            return 'Serviço';
          case 'FORNECIMENTO':
            return 'Fornecimento';
          case 'ASSINATURA':
            return 'Assinatura';
          case 'FORNECIMENTO/SERVIÇO':
            return 'Forn./Serv.';
          default:
            return type;
        }
      };

      return (
        <Badge variant={getContractTypeVariant(contractType)}>
          {getContractTypeLabel(contractType)}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "probable_procurement_type",
    header: "Tipo de Aquisição",
    enableSorting: true,
    cell: ({ row }) => {
      const procurementType = row.original.probable_procurement_type;
      
      const getProcurementTypeLabel = (type: string) => {
        switch (type) {
          case 'LICITAÇÃO':
            return 'Licitação';
          case 'DISPENSA EM RAZÃO DO VALOR':
            return 'Dispensa';
          case 'CONVÊNIO':
            return 'Convênio';
          case 'FUNDO FIXO':
            return 'Fundo Fixo';
          case 'INEXIGIBILIDADE':
            return 'Inexigibilidade';
          case 'ATA DE REGISTRO DE PREÇO':
            return 'ARP';
          case 'ACORDO DE COOPERAÇÃO':
            return 'Acordo Coop.';
          case 'APOSTILAMENTO':
            return 'Apostilamento';
          default:
            return type;
        }
      };

      return (
        <span className="text-sm">
          {getProcurementTypeLabel(procurementType)}
        </span>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "main_fiscal.full_name",
    header: "Fiscal Principal",
    enableSorting: false,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const fiscalName = row.original.main_fiscal?.full_name;
      
      if (isOptimistic && !fiscalName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return (
        <span className="text-sm">
          {fiscalName || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "process_status",
    header: "Status Processo",
    enableSorting: true,
    cell: ({ row }) => {
      const processStatus = row.original.process_status;
      
      if (!processStatus) return "-";

      const getProcessStatusVariant = (status: string) => {
        switch (status) {
          case 'VENCIDO':
            return 'destructive';
          case 'DENTRO DO PRAZO':
            return 'default';
          case 'ELABORADO COM ATRASO':
            return 'outline';
          case 'ELABORADO NO PRAZO':
            return 'secondary';
          default:
            return 'secondary';
        }
      };

      const getProcessStatusLabel = (status: string) => {
        switch (status) {
          case 'VENCIDO':
            return 'Vencido';
          case 'DENTRO DO PRAZO':
            return 'No Prazo';
          case 'ELABORADO COM ATRASO':
            return 'C/ Atraso';
          case 'ELABORADO NO PRAZO':
            return 'No Prazo';
          default:
            return status;
        }
      };

      return (
        <Badge variant={getProcessStatusVariant(processStatus)}>
          {getProcessStatusLabel(processStatus)}
        </Badge>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "contract_status",
    header: "Status Contrato",
    enableSorting: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const contractStatus = row.original.contract_status;
      
      if (!contractStatus) return "-";

      const getContractStatusVariant = (status: string) => {
        switch (status) {
          case 'DENTRO DO PRAZO':
          case 'CONTRATADO NO PRAZO':
            return 'default';
          case 'CONTRATADO COM ATRASO':
          case 'PRAZO VENCIDO':
            return 'destructive';
          case 'LINHA TOTALMENTE EXECUTADA':
          case 'LINHA PARCIALMENTE EXECUTADA':
            return 'secondary';
          case 'LINHA TOTALMENTE REMANEJADA':
          case 'LINHA PARCIALMENTE REMANEJADA':
            return 'outline';
          case 'LINHA DE PAGAMENTO':
          case 'N/A':
            return 'outline';
          default:
            return 'secondary';
        }
      };

      const getContractStatusLabel = (status: string) => {
        switch (status) {
          case 'DENTRO DO PRAZO':
            return 'No Prazo';
          case 'CONTRATADO NO PRAZO':
            return 'Contratado';
          case 'CONTRATADO COM ATRASO':
            return 'C/ Atraso';
          case 'PRAZO VENCIDO':
            return 'Vencido';
          case 'LINHA TOTALMENTE REMANEJADA':
            return 'Remanejada';
          case 'LINHA TOTALMENTE EXECUTADA':
            return 'Executada';
          case 'LINHA DE PAGAMENTO':
            return 'Pagamento';
          case 'LINHA PARCIALMENTE REMANEJADA':
            return 'Parc. Remanj.';
          case 'LINHA PARCIALMENTE EXECUTADA':
            return 'Parc. Exec.';
          case 'N/A':
            return 'N/A';
          default:
            return status;
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Badge variant={getContractStatusVariant(contractStatus)}>
            {getContractStatusLabel(contractStatus)}
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