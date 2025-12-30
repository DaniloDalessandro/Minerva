# Minerva - Guia de Deploy

## 📋 Índice
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Deploy com Docker](#deploy-com-docker)
- [Deploy Manual](#deploy-manual)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Melhorias Implementadas](#melhorias-implementadas)

## 🔧 Configuração de Ambiente

### Backend (.env)

Copie o arquivo `.env.example` para `.env` no diretório `backend_minerva/`:

```bash
cp backend_minerva/.env.example backend_minerva/.env
```

Edite o arquivo `.env` com suas configurações:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-generated-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (PostgreSQL para produção)
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=minerva_db
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=db
DATABASE_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Email (para produção)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

### Frontend (.env.local)

Copie o arquivo `.env.example` para `.env.local` no diretório `frontend_minerva/`:

```bash
cp frontend_minerva/.env.example frontend_minerva/.env.local
```

Edite com a URL da API:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

## 🐳 Deploy com Docker

### Desenvolvimento

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Produção

1. **Build das imagens:**
```bash
docker-compose build
```

2. **Iniciar serviços:**
```bash
docker-compose up -d
```

3. **Criar superusuário:**
```bash
docker-compose exec backend python manage.py createsuperuser
```

4. **Coletar arquivos estáticos:**
```bash
docker-compose exec backend python manage.py collectstatic --noinput
```

## 🚀 Deploy Manual

### Backend (Django)

1. **Instalar dependências:**
```bash
cd backend_minerva
pip install -r requirements.txt
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Executar migrations:**
```bash
python manage.py migrate
```

4. **Coletar arquivos estáticos:**
```bash
python manage.py collectstatic --noinput
```

5. **Criar superusuário:**
```bash
python manage.py createsuperuser
```

6. **Iniciar servidor (produção com Gunicorn):**
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (Next.js)

1. **Instalar dependências:**
```bash
cd frontend_minerva
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env.local
# Edite o arquivo .env.local
```

3. **Build para produção:**
```bash
npm run build
```

4. **Iniciar servidor:**
```bash
npm start
```

## 📝 Variáveis de Ambiente

### Backend Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DEBUG` | Modo debug (False em produção) | `False` |
| `SECRET_KEY` | Chave secreta do Django | `django-insecure-...` |
| `ALLOWED_HOSTS` | Hosts permitidos | `domain.com,www.domain.com` |
| `DATABASE_ENGINE` | Engine do banco | `django.db.backends.postgresql` |
| `DATABASE_NAME` | Nome do banco | `minerva_db` |
| `GEMINI_API_KEY` | Chave da API Gemini | `AIza...` |

### Frontend Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `https://api.domain.com` |
| `NODE_ENV` | Ambiente Node | `production` |

## ✨ Melhorias Implementadas

### 🔒 Segurança
- ✅ API keys movidas para variáveis de ambiente
- ✅ DEBUG configurável por ambiente
- ✅ SECRET_KEY gerenciável
- ✅ ALLOWED_HOSTS configurável

### 💾 Banco de Dados
- ✅ FloatField → DecimalField para valores monetários
- ✅ Índices adicionados em campos frequentemente filtrados:
  - Employee: email, cpf, status, direction, management, coordination
  - Budget: year, category, status, management_center

### 🔐 Permissões
- ✅ Filtro hierárquico aplicado em EmployeeListView
- ✅ Permissões consistentes em todas as views

### 📊 Logging
- ✅ Substituição de print() por logging adequado
- ✅ Níveis apropriados (INFO, WARNING, ERROR)
- ✅ Logger configurado em todos os módulos

### 🚦 Rate Limiting
- ✅ Throttling implementado:
  - Anônimos: 100 req/hora
  - Autenticados: 1000 req/hora
  - Login: 10 tentativas/hora
  - AI Assistant: 100 req/hora

### 📚 Documentação
- ✅ OpenAPI/Swagger configurado
- ✅ Acesse em: `http://localhost:8000/api/docs/`
- ✅ ReDoc disponível em: `http://localhost:8000/api/redoc/`

### 🐳 Infraestrutura
- ✅ Dockerfile para backend e frontend
- ✅ docker-compose.yml completo
- ✅ PostgreSQL configurado para produção
- ✅ .dockerignore otimizado

## 🌐 URLs Importantes

### Desenvolvimento
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Django: http://localhost:8000/admin
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

### Produção
Substitua `localhost` pelo seu domínio.

## 🔧 Comandos Úteis

```bash
# Backend
python manage.py migrate                  # Aplicar migrations
python manage.py createsuperuser         # Criar admin
python manage.py collectstatic           # Coletar statics

# Frontend
npm run dev                              # Desenvolvimento
npm run build                            # Build produção
npm start                                # Iniciar produção

# Docker
docker-compose up -d                     # Iniciar serviços
docker-compose logs -f backend           # Ver logs backend
docker-compose exec backend python manage.py migrate  # Migrations no container
docker-compose down                      # Parar todos os serviços
```

## 📞 Suporte

Para problemas ou dúvidas, consulte a documentação da API em `/api/docs/`.
