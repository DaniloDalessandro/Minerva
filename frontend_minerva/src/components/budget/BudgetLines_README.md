# Componente BudgetLines

Este componente implementa a interface frontend para a seção "Linhas Orçamentárias Vinculadas" na página de detalhes do orçamento.

## Funcionalidades Implementadas

### 1. Cards de Resumo/Estatísticas
- **Total de Linhas**: Mostra o número total de linhas orçamentárias
- **Valor Total Orçado**: Exibe o valor total de todas as linhas em formato monetário
- **% de Utilização**: Porcentagem de utilização do orçamento

### 2. Lista de Linhas Orçamentárias
Cada linha exibe:
- **Descrição da linha orçamentária**
- **Valor orçado** (formatado em BRL)
- **Centro Gestor** e **Fiscal Principal**
- **Tipo de Despesa** (Base Principal, Base Suplementar, Reserva Técnica, Contingência)
- **Status do Processo** e **Status do Contrato** com badges coloridos
- **Informações de versão** (versão atual/total de versões)
- **Botão de histórico** para visualizar versões anteriores

### 3. Badges Coloridos por Status
#### Status do Processo:
- 🟢 ELABORADO NO PRAZO (verde)
- 🟡 ELABORADO COM ATRASO (amarelo)  
- 🔵 EM ELABORAÇÃO (azul)
- 🟠 PENDENTE (laranja)

#### Status do Contrato:
- 🟢 DENTRO DO PRAZO / CONTRATADO NO PRAZO (verde)
- 🟡 CONTRATADO COM ATRASO (amarelo)
- 🔴 PRAZO VENCIDO / VENCIDO (vermelho)

#### Tipo de Despesa:
- 🔵 Base Principal (azul)
- 🟣 Base Suplementar (roxo)
- 🟠 Reserva Técnica (laranja)
- 🔴 Contingência (vermelho)

### 4. Distribuição de Status
Cards na parte inferior mostram:
- **Distribuição por Status do Processo**
- **Distribuição por Status do Contrato**

### 5. Modal de Histórico de Versões
- Integra com o componente `BudgetLineVersionHistory`
- Modal responsivo com scroll interno
- Botão "Histórico" em cada linha orçamentária

## Arquivos Criados/Modificados

### Arquivos Criados:
1. **`/src/components/budget/BudgetLines.tsx`** - Componente principal
2. **`/src/components/budget/BudgetLinesExample.tsx`** - Exemplo de uso com dados mock

### Arquivos Modificados:
3. **`/src/lib/api/budgets.ts`** - Adicionadas interfaces TypeScript:
   - `BudgetLineListItem`
   - `BudgetLinesSummary`
   - Budget interface estendida com `budget_lines` e `budget_lines_summary`

4. **`/src/app/(private)/orcamento/[id]/page.tsx`** - Integração do componente na página

## Como Usar

### 1. Na Página de Detalhes do Orçamento

```tsx
import { BudgetLines } from "@/components/budget/BudgetLines"

// No componente da página:
{budget.budget_lines && budget.budget_lines_summary && (
  <BudgetLines 
    budgetLines={budget.budget_lines}
    budgetLinesSummary={budget.budget_lines_summary}
  />
)}
```

### 2. Estrutura Esperada dos Dados

O backend deve retornar no endpoint `GET /api/v1/budget/budgets/{id}/`:

```json
{
  "id": 1,
  "year": 2024,
  "category": "CAPEX",
  // ... outros campos existentes
  "budget_lines": [
    {
      "id": 1,
      "summary_description": "Descrição da linha",
      "budgeted_amount": 150000.0,
      "management_center_name": "Centro Gestor",
      "main_fiscal_name": "Fiscal Principal",
      "current_version": 2,
      "total_versions": 2,
      "expense_type": "Base Principal",
      "contract_status": "DENTRO DO PRAZO",
      "process_status": "ELABORADO NO PRAZO"
    }
  ],
  "budget_lines_summary": {
    "total_lines": 2,
    "total_budgeted_amount": 230000.0,
    "utilization_percentage": 23.0,
    "process_status_distribution": {
      "ELABORADO NO PRAZO": 1,
      "EM ELABORAÇÃO": 1
    },
    "contract_status_distribution": {
      "DENTRO DO PRAZO": 1,
      "PRAZO VENCIDO": 1
    },
    "expense_type_distribution": {
      "Base Principal": 1,
      "Reserva Técnica": 1
    }
  }
}
```

## Dependências Utilizadas

- **shadcn/ui components**:
  - Card, CardContent, CardHeader, CardTitle
  - Badge
  - Button
  - Dialog, DialogContent, DialogHeader, DialogTitle
- **Lucide React Icons**:
  - ListIcon, DollarSignIcon, TrendingUpIcon, etc.
- **BudgetLineVersionHistory** component (existente)

## Layout Responsivo

- **Mobile**: Layout em coluna única
- **Tablet**: Grid de 2 colunas para cards de estatísticas
- **Desktop**: Grid de 3 colunas otimizado, layout horizontal para itens da lista

## Acessibilidade

- Uso de cores contrastantes nos badges
- Ícones descritivos para cada seção
- Estrutura semântica apropriada
- Suporte a navegação via teclado

## Performance

- Renderização condicional (só exibe se houver dados)
- Componentes otimizados do shadcn/ui
- Formatação de moeda eficiente
- Modal lazy-loaded para histórico de versões

## Posicionamento na Página

O componente é exibido **após** a seção "Histórico de Movimentações" na página de detalhes do orçamento, como solicitado.