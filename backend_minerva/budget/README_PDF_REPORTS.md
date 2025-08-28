# Geração de Relatórios PDF para Orçamentos

Este documento descreve a implementação da funcionalidade de geração de relatórios em PDF para orçamentos no Sistema Minerva.

## Funcionalidades Implementadas

### 1. Relatório Detalhado de Orçamento Individual

**Endpoint:** `GET /api/budgets/<int:budget_id>/report/pdf/`

Gera um relatório PDF completo para um orçamento específico, incluindo:

- **Dados básicos do orçamento**: Ano, categoria, centro gestor, valores, status, auditoria
- **Linhas orçamentárias**: Lista detalhada de todas as linhas vinculadas ao orçamento
- **Histórico de movimentações**: Movimentações de entrada e saída com detalhes
- **Resumos e totalizadores**: Estatísticas calculadas automaticamente

**Exemplo de uso:**
```javascript
// Frontend JavaScript
const response = await fetch('/api/budgets/123/report/pdf/', {
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
    }
});

if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_orcamento.pdf';
    a.click();
}
```

### 2. Relatório Resumo de Múltiplos Orçamentos

**Endpoint:** `GET /api/budgets/summary/pdf/`

Gera um relatório PDF resumido com múltiplos orçamentos. Suporta filtros via query parameters:

- `year`: Filtrar por ano específico
- `category`: Filtrar por categoria (CAPEX/OPEX)
- `management_center`: Filtrar por ID do centro gestor
- `status`: Filtrar por status (ATIVO/INATIVO)

**Exemplos de uso:**
```javascript
// Relatório de todos os orçamentos
const response1 = await fetch('/api/budgets/summary/pdf/');

// Relatório filtrado por ano e categoria
const response2 = await fetch('/api/budgets/summary/pdf/?year=2024&category=CAPEX');

// Relatório filtrado por centro gestor
const response3 = await fetch('/api/budgets/summary/pdf/?management_center=5');
```

## Arquivos Implementados

### 1. `budget/utils/pdf_generator.py`

Contém as funções utilitárias para geração de PDF:

- `generate_budget_pdf(budget)`: Gera PDF detalhado de um orçamento
- `generate_budget_summary_pdf(budgets_queryset)`: Gera PDF resumo de múltiplos orçamentos
- `format_currency(value)`: Função auxiliar para formatação de moeda brasileira

### 2. Novas Views em `budget/views.py`

- `generate_budget_report_pdf(request, budget_id)`: View para relatório individual
- `generate_budget_summary_report_pdf(request)`: View para relatório resumo

### 3. URLs em `budget/urls.py`

```python
# PDF Report URLs
path('budgets/<int:budget_id>/report/pdf/', generate_budget_report_pdf, name='budget-report-pdf'),
path('budgets/summary/pdf/', generate_budget_summary_report_pdf, name='budget-summary-pdf'),
```

## Dependências

### Bibliotecas Python Instaladas

- `reportlab`: Biblioteca principal para geração de PDF
- `pillow`: Dependência para manipulação de imagens (requerida pelo ReportLab)

### Configuração

Não são necessárias configurações adicionais no `settings.py`. As funções utilizam as configurações padrão do Django.

## Tratamento de Erros

Ambos os endpoints implementam tratamento robusto de erros:

- **404**: Quando orçamento não encontrado (relatório individual) ou quando nenhum orçamento corresponde aos filtros (relatório resumo)
- **500**: Erros internos durante geração do PDF
- **Logging**: Todos os erros e operações são registrados no sistema de logging do Django

## Segurança e Permissões

- **Autenticação**: Requerida em ambos os endpoints (`@permission_classes([IsAuthenticated])`)
- **Autorização**: Utiliza as permissões padrão do Django Rest Framework
- **Validação**: IDs de orçamentos são validados automaticamente pelo Django

## Performance

### Otimizações Implementadas

- **Query Optimization**: Uso de `select_related()` e `prefetch_related()` para reduzir consultas ao banco
- **Memory Management**: PDFs são gerados em memória usando `BytesIO` para eficiência
- **Lazy Loading**: Dados são carregados apenas quando necessário

### Recomendações de Uso

- Para relatórios com muitos orçamentos, considere implementar paginação
- Para orçamentos com muitas linhas/movimentações, monitore uso de memória
- Considere implementar cache para relatórios frequentemente acessados

## Customização

### Layout e Formatação

O layout dos PDFs pode ser personalizado editando as funções em `pdf_generator.py`:

- **Cores**: Definidas usando `colors.HexColor()`
- **Fontes**: Configuráveis via `ParagraphStyle`
- **Tabelas**: Estilos definidos em `TableStyle`
- **Margens**: Configuráveis no `SimpleDocTemplate`

### Campos e Dados

Para adicionar novos campos aos relatórios:

1. Modifique as estruturas de dados nas funções `generate_budget_pdf()` ou `generate_budget_summary_pdf()`
2. Adicione as novas informações às tabelas correspondentes
3. Teste a formatação e ajuste conforme necessário

## Exemplo de Integração Frontend

### React/Next.js

```javascript
const downloadBudgetReport = async (budgetId) => {
    try {
        const response = await fetch(`/api/budgets/${budgetId}/report/pdf/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao gerar relatório');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_orcamento_${budgetId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao baixar relatório:', error);
    }
};
```

### HTML + JavaScript Vanilla

```html
<button onclick="downloadReport(123)">Gerar Relatório PDF</button>

<script>
async function downloadReport(budgetId) {
    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`/api/budgets/${budgetId}/report/pdf/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio_orcamento.pdf';
            a.click();
        } else {
            alert('Erro ao gerar relatório');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar relatório');
    }
}
</script>
```

## Testes

Para testar a funcionalidade:

1. **Via Navegador**: Acesse as URLs diretamente (com autenticação)
2. **Via Postman**: Configure requisições GET com token de autenticação
3. **Via Frontend**: Implemente botões de download nos componentes de orçamento

## Troubleshooting

### Problemas Comuns

1. **Erro "ModuleNotFoundError: No module named 'reportlab'"**
   - Solução: Execute `pip install reportlab` no ambiente virtual

2. **Erro de memória em relatórios grandes**
   - Solução: Implemente paginação ou limite o número de registros

3. **PDF em branco ou malformado**
   - Solução: Verifique se os dados do orçamento estão completos e válidos

4. **Problemas de encoding com caracteres especiais**
   - Solução: Verificar configurações de locale e encoding do sistema

### Logs Úteis

O sistema gera logs detalhados que podem ser consultados para diagnóstico:

```python
# Verificar logs no Django
import logging
logger = logging.getLogger(__name__)
logger.info("PDF generation started for budget: %s", budget_id)
```

## Próximos Passos

### Melhorias Sugeridas

1. **Templates Customizáveis**: Permitir diferentes layouts de relatório
2. **Exportação Excel**: Adicionar opção de exportação em formato Excel
3. **Relatórios Agendados**: Implementar geração automática de relatórios
4. **Gráficos**: Adicionar visualizações gráficas aos relatórios PDF
5. **Assinatura Digital**: Implementar assinatura digital nos PDFs
6. **Watermarks**: Adicionar marca d'água com informações de confidencialidade