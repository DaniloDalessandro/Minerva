/**
 * Exemplo de uso do componente BudgetLines
 * Este arquivo demonstra como integrar o componente com dados de exemplo
 * Para usar em produção, substitua pelos dados reais da API
 */

import { BudgetLines } from "./BudgetLines"
import { BudgetLineListItem, BudgetLinesSummary } from "@/lib/api/budgets"

const exampleBudgetLines: BudgetLineListItem[] = [
  {
    id: 1,
    summary_description: "Aquisição de Equipamentos de TI para modernização da infraestrutura",
    budgeted_amount: 150000.50,
    management_center_name: "Centro de Tecnologia",
    main_fiscal_name: "João Silva Santos",
    current_version: 2,
    total_versions: 2,
    expense_type: "Base Principal",
    contract_status: "DENTRO DO PRAZO",
    process_status: "ELABORADO NO PRAZO"
  },
  {
    id: 2,
    summary_description: "Serviços de Consultoria em Gestão de Projetos",
    budgeted_amount: 80000.00,
    management_center_name: "Centro de Gestão",
    main_fiscal_name: "Maria Oliveira Lima",
    current_version: 1,
    total_versions: 3,
    expense_type: "Base Suplementar",
    contract_status: "CONTRATADO COM ATRASO",
    process_status: "ELABORADO COM ATRASO"
  },
  {
    id: 3,
    summary_description: "Reforma das Instalações do Prédio Administrativo",
    budgeted_amount: 250000.00,
    management_center_name: "Centro de Infraestrutura",
    main_fiscal_name: "Carlos Eduardo Pereira",
    current_version: 3,
    total_versions: 3,
    expense_type: "Reserva Técnica",
    contract_status: "PRAZO VENCIDO",
    process_status: "EM ELABORAÇÃO"
  }
]

const exampleBudgetLinesSummary: BudgetLinesSummary = {
  total_lines: 3,
  total_budgeted_amount: 480000.50,
  utilization_percentage: 65.2,
  process_status_distribution: {
    "ELABORADO NO PRAZO": 1,
    "ELABORADO COM ATRASO": 1,
    "EM ELABORAÇÃO": 1
  },
  contract_status_distribution: {
    "DENTRO DO PRAZO": 1,
    "CONTRATADO COM ATRASO": 1,
    "PRAZO VENCIDO": 1
  },
  expense_type_distribution: {
    "Base Principal": 1,
    "Base Suplementar": 1,
    "Reserva Técnica": 1
  }
}

export function BudgetLinesExample() {
  return (
    <BudgetLines 
      budgetLines={exampleBudgetLines}
      budgetLinesSummary={exampleBudgetLinesSummary}
    />
  )
}

/**
 * EXEMPLO DE INTEGRAÇÃO NA PÁGINA DE DETALHES DO ORÇAMENTO:
 * 
 * // No arquivo page.tsx, após BudgetMovementHistory:
 * 
 * {/* Budget Lines *\/}
 * {budget.budget_lines && budget.budget_lines_summary && (
 *   <BudgetLines 
 *     budgetLines={budget.budget_lines}
 *     budgetLinesSummary={budget.budget_lines_summary}
 *   />
 * )}
 * 
 * ESTRUTURA ESPERADA DOS DADOS DA API:
 * 
 * Interface Budget deve incluir:
 * - budget_lines?: BudgetLineListItem[]
 * - budget_lines_summary?: BudgetLinesSummary
 * 
 * O backend deve retornar estes campos no endpoint:
 * GET /api/v1/budget/budgets/{id}/
 */