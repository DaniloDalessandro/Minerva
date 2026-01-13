# Sistema Minerva

Sistema completo de gestão de orçamentos, contratos e colaboradores com frontend Next.js e backend Django REST Framework.

## 📋 Visão Geral

O Sistema Minerva é uma plataforma integrada para gerenciamento organizacional que inclui:

- **Gestão de Orçamentos** - CAPEX e OPEX com controle hierárquico
- **Gestão de Contratos** - Contratos, parcelas e aditivos
- **Gestão de Colaboradores** - Funcionários e estrutura organizacional
- **Assistente AI** - Alice, assistente virtual para consultas
- **Sistema Hierárquico** - Controle de acesso por níveis organizacionais

## 🏗️ Arquitetura

```
Minerva/
├── frontend_minerva/     # Next.js 15 + React 19 + TypeScript
├── backend_minerva/      # Django REST Framework + Python 3.13
└── docker-compose.yml    # Orquestração de containers
```

### Stack Tecnológica

**Frontend:**
- Next.js 15.1.3
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/ui
- TanStack Query
- Zod

**Backend:**
- Django 5.2.7
- Django REST Framework
- Python 3.13
- JWT Authentication
- PostgreSQL/SQLite
- Google Gemini AI

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- Git

### 1. Clone o repositório

```bash
git clone <repository-url>
cd Minerva
```

### 2. Configurar Backend

```bash
cd backend_minerva

# Criar ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Edite o .env com suas configurações

# Gerar SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

Backend disponível em: `http://localhost:8000`

### 3. Configurar Frontend

```bash
cd frontend_minerva

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie .env.local com:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend disponível em: `http://localhost:3000`

## 📁 Estrutura do Projeto

### Backend (`backend_minerva/`)

```
backend_minerva/
├── accounts/          # Autenticação e usuários
├── ai_assistant/      # Assistente AI Alice
├── aid/               # Gestão de auxílios
├── budget/            # Gestão de orçamentos
├── budgetline/        # Linhas orçamentárias
├── center/            # Centros gestores
├── contract/          # Gestão de contratos
├── core/              # Configurações Django
├── employee/          # Gestão de funcionários
├── sector/            # Estrutura organizacional
└── manage.py
```

### Frontend (`frontend_minerva/`)

```
frontend_minerva/
├── src/
│   ├── app/           # App Router do Next.js
│   ├── components/    # Componentes React reutilizáveis
│   ├── features/      # Features organizadas por módulo
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilitários e configurações
│   ├── services/      # Integração com API
│   └── types/         # TypeScript types
├── public/            # Arquivos estáticos
└── package.json
```

## 🔑 Funcionalidades Principais

### Autenticação e Autorização
- Login/Logout com JWT
- Controle hierárquico de permissões
- Rate limiting para segurança
- Blacklist de tokens

### Gestão de Orçamentos
- Criação de orçamentos CAPEX/OPEX
- Controle de valores disponíveis (cache otimizado)
- Movimentações entre orçamentos
- Exportação para PDF
- Histórico de alterações

### Gestão de Contratos
- Criação de contratos vinculados a linhas orçamentárias
- Gestão de parcelas e aditivos
- Número de protocolo automático
- Rastreamento de fiscais

### Gestão de Colaboradores
- Cadastro de funcionários
- Estrutura hierárquica (Direção → Gerência → Coordenação)
- Vinculação com usuários
- Gestão de auxílios

### Assistente AI (Alice)
- Consultas em linguagem natural
- Geração automática de SQL
- Histórico de conversas
- Validação de queries

## 🔐 Segurança

### Implementações de Segurança

- ✅ Autenticação JWT com refresh tokens
- ✅ Blacklist de tokens invalidados
- ✅ Rate limiting configurável
- ✅ Validação robusta de entrada
- ✅ Proteção CSRF
- ✅ CORS configurável
- ✅ Senhas hasheadas com PBKDF2
- ✅ SECRET_KEY obrigatória e única

### Rate Limits Padrão

- Login: 5 tentativas/hora
- Registro: 3 tentativas/hora
- Reset senha: 3 tentativas/hora
- Export PDF: 10/hora
- Requisições gerais: 1000/hora (autenticado)

## 🎯 Hierarquia de Permissões

```
Presidente (acesso total)
    └── Direção
        └── Gerência
            └── Coordenação
                └── Funcionário
```

**Níveis de Acesso:**
- **Presidente**: Visualiza e gerencia todos os dados
- **Diretor**: Acessa dados de sua direção e subordinados
- **Gerente**: Acessa dados de sua gerência e coordenações
- **Coordenador**: Acessa apenas sua coordenação
- **Funcionário**: Acesso limitado aos próprios dados

## ⚡ Otimizações

### Performance

- **Cache de valores calculados** - Campos cached no modelo Budget eliminam queries N+1
- **Agregações SQL** - Substituição de loops Python por queries otimizadas
- **Select/Prefetch Related** - Redução de queries com eager loading
- **Indexação** - Índices em campos frequentemente consultados

**Impacto:**
- Redução de 300+ queries para 0 em listagens
- Tempo de resposta 70-90% menor
- Uso de memória 50-80% menor

### Frontend

- Server-side rendering (SSR)
- Lazy loading de componentes
- Code splitting automático
- Otimização de imagens
- Caching de requisições com TanStack Query

## 🛠️ Comandos Úteis

### Backend

```bash
# Desenvolvimento
python manage.py runserver

# Migrações
python manage.py makemigrations
python manage.py migrate

# Utilitários
python manage.py createsuperuser
python manage.py collectstatic
python manage.py check
python manage.py check --deploy

# Comandos customizados
python manage.py setup_hierarchy
python manage.py populate_employees
python manage.py setup_permissions
python manage.py recalculate_budget_cache
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm run start

# Linting e formatação
npm run lint
npm run format

# Testes
npm run test
```

## 📊 API Endpoints

### Autenticação
```
POST   /api/v1/auth/login/
POST   /api/v1/auth/logout/
POST   /api/v1/auth/register/
POST   /api/v1/auth/token/refresh/
GET    /api/v1/auth/me/
```

### Orçamentos
```
GET    /api/v1/budget/budgets/
POST   /api/v1/budget/budgets/
GET    /api/v1/budget/budgets/{id}/
PUT    /api/v1/budget/budgets/{id}/
DELETE /api/v1/budget/budgets/{id}/
GET    /api/v1/budget/budgets/{id}/pdf/
```

### Contratos
```
GET    /api/v1/contract/contracts/
POST   /api/v1/contract/contracts/
GET    /api/v1/contract/contracts/{id}/
PUT    /api/v1/contract/contracts/{id}/
DELETE /api/v1/contract/contracts/{id}/
```

### Funcionários
```
GET    /api/v1/employee/employees/
POST   /api/v1/employee/employees/
GET    /api/v1/employee/employees/{id}/
PUT    /api/v1/employee/employees/{id}/
DELETE /api/v1/employee/employees/{id}/
```

**Documentação completa:** `http://localhost:8000/api/schema/swagger-ui/`

## 🐳 Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🧪 Testes

### Backend

```bash
cd backend_minerva
python manage.py test

# Com coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend

```bash
cd frontend_minerva
npm run test
npm run test:watch
npm run test:coverage
```

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
# Django
DEBUG=True
SECRET_KEY=sua-chave-secreta-unica
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# AI (opcional)
GEMINI_API_KEY=sua-chave-api

# Email (opcional)
DEFAULT_FROM_EMAIL=noreply@minerva.local
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deploy

### Backend (Produção)

1. Configure variáveis de ambiente:
```env
DEBUG=False
SECRET_KEY=<chave-unica-segura>
ALLOWED_HOSTS=seudominio.com
DATABASE_ENGINE=django.db.backends.postgresql
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

2. Execute:
```bash
python manage.py collectstatic
python manage.py migrate
gunicorn core.wsgi:application
```

### Frontend (Produção)

```bash
npm run build
npm run start
```

## 📚 Documentação Adicional

- **Backend**: Consulte `backend_minerva/OTIMIZACOES.txt`
- **API**: `http://localhost:8000/api/schema/swagger-ui/`
- **Admin**: `http://localhost:8000/admin/`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👥 Equipe

Desenvolvido pela equipe Minerva.

---

**Versão:** 2.0
**Última atualização:** Janeiro 2026
