import { ColumnDef } from "@tanstack/react-table";
import { BudgetLine } from "@/lib/api/budgetlines";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<BudgetLine>[] = [
  // 5 COLUNAS PRINCIPAIS - SEMPRE VISÍVEIS
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
    cell: ({ row }) => row.original.category,
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
        <span className="max-w-xs truncate" title={description}>
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
      const amount = parseFloat(row.original.budgeted_amount);
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
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
          {getContractStatusLabel(contractStatus)}
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
  
  // COLUNAS SECUNDÁRIAS - DISPONÍVEIS NA ENGRENAGEM
  {
    accessorKey: "management_center.name",
    header: "Centro Gestor",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const centerName = row.original.management_center?.name;
      
      if (isOptimistic && !centerName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return centerName || "-";
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "requesting_center.name",
    header: "Centro Solicitante",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const centerName = row.original.requesting_center?.name;
      
      if (isOptimistic && !centerName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return centerName || "-";
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "expense_type",
    header: "Tipo de Despesa",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => row.original.expense_type,
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "contract_type",
    header: "Tipo de Contrato",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const contractType = row.original.contract_type;
      
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

      return getContractTypeLabel(contractType);
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "probable_procurement_type",
    header: "Tipo de Aquisição",
    enableSorting: true,
    enableHiding: true,
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

      return getProcurementTypeLabel(procurementType);
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "main_fiscal.full_name",
    header: "Fiscal Principal",
    enableSorting: false,
    enableHiding: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const fiscalName = row.original.main_fiscal?.full_name;
      
      if (isOptimistic && !fiscalName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return fiscalName || "-";
    },
  },
  {
    accessorKey: "secondary_fiscal.full_name",
    header: "Fiscal Substituto",
    enableSorting: false,
    enableHiding: true,
    cell: ({ row }) => {
      const isOptimistic = row.original.isOptimistic;
      const fiscalName = row.original.secondary_fiscal?.full_name;
      
      if (isOptimistic && !fiscalName) {
        return <span className="text-gray-400 italic">Carregando...</span>;
      }
      
      return fiscalName || "-";
    },
  },
  {
    accessorKey: "process_status",
    header: "Status Processo",
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const processStatus = row.original.process_status;
      
      if (!processStatus) return "-";

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

      return getProcessStatusLabel(processStatus);
    },
    meta: {
      showFilterIcon: true,
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
    accessorKey: "updated_at",
    header: "Atualizado em",
    enableSorting: true,
    enableHiding: true,
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
  {
    accessorKey: "updated_by",
    header: "Atualizado por",
    enableSorting: false,
    enableHiding: true,
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