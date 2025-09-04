# 🔐 Guia do Sistema de Permissões Hierárquicas - Minerva

## 📋 Visão Geral

O sistema Minerva implementa um controle de acesso baseado em grupos hierárquicos que reflete a estrutura organizacional da empresa. Cada usuário deve estar em pelo menos um grupo para ter acesso ao sistema.

## 🏢 Estrutura Hierárquica

### 👑 **Presidente**
- **Acesso:** Total a todos os dados do sistema
- **Pode ver:** Todos os orçamentos, contratos, linhas orçamentárias e auxílios
- **Permissões:** Criar, editar, visualizar e excluir qualquer registro

### 🎯 **Diretores**
- **Acesso:** Dados de sua direção e hierarquias subordinadas
- **Pode ver:** Contratos, orçamentos e dados de suas gerências e coordenações
- **Tipos:**
  - **Diretor Financeiro:** Foco em orçamentos e linhas orçamentárias
  - **Diretor Administrativo:** Foco em contratos e funcionários

### 📋 **Gerentes**
- **Acesso:** Dados de sua gerência e coordenações subordinadas
- **Pode ver:** Contratos, orçamentos e dados de suas coordenações
- **Permissões:** Criar e editar registros em sua área de responsabilidade

### 📌 **Coordenadores**
- **Acesso:** Dados apenas de sua coordenação
- **Pode ver:** Contratos, orçamentos e dados específicos de sua coordenação
- **Permissões:** Editar registros de sua coordenação

### 👤 **Funcionários**
- **Acesso:** Limitado ou nenhum acesso administrativo
- **Pode ver:** Apenas dados relacionados ao seu trabalho (se configurado)

## 🚀 Configuração Inicial

### 1. Executar Comando de Setup
```bash
python manage.py setup_permissions
```

Este comando:
- Cria as permissões personalizadas
- Cria os grupos padrão com suas permissões
- Configura a estrutura hierárquica

### 2. Criar Grupos Adicionais (se necessário)
```bash
python manage.py setup_permissions --reset  # Remove grupos existentes e recria
```

## 👥 Gerenciamento de Usuários e Grupos

### No Django Admin:

1. **Acessar Grupos:**
   - Vá para "Autenticação e Autorização" → "Grupos"
   - Visualize todos os grupos com contagem de permissões e usuários

2. **Gerenciar Usuários:**
   - Vá para "Contas" → "Usuários"
   - Cada usuário mostra:
     - Grupos atribuídos (com cores)
     - Nível hierárquico (com ícones)
     - Status de acesso

3. **Atribuir Usuário a Grupo:**
   - Edite o usuário
   - Na seção "Permissões e Grupos", selecione os grupos apropriados
   - **IMPORTANTE:** Usuários sem grupos não terão acesso ao sistema

## ⚠️ Regras Importantes

### ❌ **Sem Grupos = Sem Acesso**
- Usuários sem grupos são automaticamente bloqueados
- Recebem página de "Acesso Negado"
- Devem ser atribuídos a um grupo para ter qualquer acesso

### 🔒 **Hierarquia Rígida**
- As permissões seguem estritamente a estrutura organizacional
- Não depende do cadastro de direção/gerência/coordenação do funcionário
- Depende APENAS do grupo ao qual o usuário pertence

### 👑 **Superusuários**
- Superusuários sempre têm acesso total
- Bypass completo do sistema de grupos
- Use apenas para administradores técnicos

## 🔧 Permissões Personalizadas

### Permissões por Módulo:

**Orçamentos (Budget):**
- `view_all_budgets` - Ver todos os orçamentos
- `view_direction_budgets` - Ver orçamentos da direção
- `view_management_budgets` - Ver orçamentos da gerência
- `view_coordination_budgets` - Ver orçamentos da coordenação

**Contratos (Contract):**
- `view_all_contracts` - Ver todos os contratos
- `view_direction_contracts` - Ver contratos da direção
- `view_management_contracts` - Ver contratos da gerência
- `view_coordination_contracts` - Ver contratos da coordenação

**Linhas Orçamentárias (BudgetLine):**
- `view_all_budgetlines` - Ver todas as linhas orçamentárias
- `view_direction_budgetlines` - Ver linhas da direção
- `view_management_budgetlines` - Ver linhas da gerência
- `view_coordination_budgetlines` - Ver linhas da coordenação

**Auxílios (Aid):**
- `view_all_aids` - Ver todos os auxílios
- `view_direction_aids` - Ver auxílios da direção
- `view_management_aids` - Ver auxílios da gerência
- `view_coordination_aids` - Ver auxílios da coordenação

## 📊 Monitoramento

### Interface Visual:
- **Grupos com cores:** Cada nível hierárquico tem cor específica
- **Ícones por nível:** 👑 🎯 📋 📌 👤
- **Contadores:** Número de usuários por grupo e permissões por grupo
- **Status visual:** Fácil identificação de usuários sem acesso

### Logs e Auditoria:
- Middleware registra tentativas de acesso não autorizado
- Context processor fornece informações de permissões nos templates
- Interface de administração mostra status detalhado de cada usuário

## 🛠️ Resolução de Problemas

### Usuário não consegue acessar o admin:
1. Verificar se está em algum grupo
2. Verificar se o grupo tem permissões adequadas
3. Verificar se o usuário está ativo
4. Verificar se o employee está associado corretamente

### Erro de permissões:
1. Executar `python manage.py setup_permissions` novamente
2. Verificar se as migrações foram aplicadas
3. Verificar se o middleware está configurado corretamente

### Grupo sem permissões:
1. Editar o grupo no Django Admin
2. Atribuir permissões apropriadas manualmente
3. Ou recriar grupos com `--reset`

## 📝 Exemplo de Fluxo

1. **Funcionário é contratado**
   - Admin cria Employee no sistema
   - Admin cria User e associa ao Employee
   - **Usuário ainda não tem acesso**

2. **Atribuição de acesso**
   - Admin determina nível hierárquico do funcionário
   - Admin adiciona usuário ao grupo apropriado
   - **Usuário agora pode acessar o sistema**

3. **Mudança de cargo**
   - Admin remove usuário do grupo atual
   - Admin adiciona usuário ao novo grupo
   - **Permissões são atualizadas automaticamente**

## 🎯 Benefícios

- ✅ **Segurança:** Controle granular de acesso
- ✅ **Flexibilidade:** Grupos podem ser personalizados
- ✅ **Auditoria:** Rastreamento completo de permissões
- ✅ **Usabilidade:** Interface visual intuitiva
- ✅ **Manutenção:** Sistema automatizado de permissões
- ✅ **Hierarquia:** Reflete estrutura organizacional real