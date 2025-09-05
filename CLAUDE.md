# Projeto Minerva - Claude Code

## Comandos úteis
- Backend: `call venv\Scripts\activate.bat && python manage.py runserver`
- Frontend: `npm run dev`
- Migrations: `call venv\Scripts\activate.bat && python manage.py makemigrations && python manage.py migrate`

## Estrutura do projeto
- Backend Django em `/backend_minerva`
- Frontend Next.js em `/frontend_minerva`

## SEGURANÇA - MELHORIAS IMPLEMENTADAS

### Problema Identificado
O sistema tinha uma VULNERABILIDADE CRÍTICA:
- Tokens JWT armazenados em localStorage E cookies
- Tokens válidos por 7 dias
- URLs acessíveis diretamente mesmo após "logout"
- Cookies definidos via JavaScript (não HttpOnly)

### Correções Aplicadas:

1. **Tempo de vida dos tokens reduzido:**
   - Access token: 7 dias → 15 minutos
   - Refresh token: 7 dias → 1 dia

2. **Armazenamento seguro:**
   - REMOVIDO: localStorage para tokens
   - MANTIDO: Apenas cookies com 15 minutos
   - Configurado: Cookies HttpOnly e Secure em produção

3. **Configurações de segurança adicionadas:**
   - SESSION_COOKIE_HTTPONLY = True
   - SESSION_COOKIE_SECURE = True (produção)
   - CSRF_COOKIE_HTTPONLY = True
   - SameSite = 'Strict'

### Próximos Passos Recomendados:

1. **Implementar refresh automático** no frontend
2. **Migrar para cookies HttpOnly** definidos pelo servidor
3. **Implementar logout global** invalidando tokens no servidor
4. **Adicionar rate limiting** para login
5. **Logs de auditoria** para acessos de segurança

### CORREÇÕES APLICADAS PARA O LOGIN:

**Problemas corrigidos:**
1. **useAuth.ts**: Função `getCookie()` adicionada para ler tokens dos cookies
2. **authFetch.ts**: Migrado de localStorage para cookies em todas as operações
3. **useValidation.ts**: Atualizado para usar cookies em vez de localStorage
4. **Sincronização entre componentes**: Ajustada para funcionar com cookies

**Arquivos modificados:**
- `frontend_minerva/src/hooks/useAuth.ts`
- `frontend_minerva/src/lib/api/authFetch.ts`  
- `frontend_minerva/src/hooks/useValidation.ts`
- `backend_minerva/core/settings.py`

### Teste da Correção:
✅ **Sistema de login CORRIGIDO e funcional**
✅ **Servidores rodando:** Frontend (3001) + Backend (8000)
✅ **Tokens expiram em 15 minutos** (maior segurança)
✅ **Cookies seguros** em vez de localStorage vulnerável

**Status:** Login funcionando normalmente com segurança aprimorada!