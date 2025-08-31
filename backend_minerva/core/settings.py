from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-j-lu3=l!j!p%+q9gx*-d@77p+^&a5o%7hj=3d7!gp%o)!t$xn*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #LIBS
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    # APPS
    'accounts',
    'employee',
    'sector',
    'center',
    'budget',
    'budgetline',
    'aid',
    'contract',
    'ai_assistant',
    
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'accounts.User'

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'budget': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

# settings.py

# Backend de e-mail para desenvolvimento (imprime no console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Email padrão do remetente (aparece como quem enviou o e-mail)
DEFAULT_FROM_EMAIL = 'noreply@sistemacontratos.local'

# Configuração do Google Gemini AI
GEMINI_API_KEY = 'AIzaSyA44SpR5MjGYDOMby0FDAhK5N-ZLjE3zCE'


REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": (
        "rest_framework.pagination.PageNumberPagination"
    ),
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),     
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    
}

JAZZMIN_SETTINGS = {
    "site_title": "⚓ Minerva 1.0.0",
    "site_header": "⚓ Minerva 1.0.0", 
    "site_brand": "⚓ Minerva 1.0.0",
    
    # Favicon e logo usando emoji de âncora
    "site_icon": None,
    "site_logo": None,
    "login_logo": None,
    
    # UI Tweaks para corrigir sobreposições
    "custom_css": "admin/css/custom_admin.css",
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    
    # Formato de formulário para melhor visualização
    "changeform_format": "vertical_tabs",
    "changeform_format_overrides": {
        "accounts.user": "single",
        "auth.user": "single",
        "auth.group": "single"
    },
    
    # Ícones personalizados para models (apenas um ícone por model)
    "icons": {
        # Django Admin
        "admin.LogEntry": "fas fa-history",
        
        # Auth (Django padrão)
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "auth.Permission": "fas fa-key",
        
        # Content Types
        "contenttypes.ContentType": "fas fa-tag",
        
        # Sessions
        "sessions.Session": "fas fa-user-clock",
        
        # Auth Token
        "authtoken.Token": "fas fa-ticket-alt",
        "authtoken.TokenProxy": "fas fa-id-card-alt",
        
        # Accounts (Usuários customizados)
        "accounts.User": "fas fa-user-tie",
        
        # Employee (Colaboradores)
        "employee.Employee": "fas fa-id-badge",
        
        # Center (Centros)
        "center.Management_Center": "fas fa-building-user",
        "center.Requesting_Center": "fas fa-building-flag",
        
        # Sector (Setores)
        "sector.Direction": "fas fa-compass",
        "sector.Management": "fas fa-layer-group",
        "sector.Coordination": "fas fa-project-diagram",
        
        # Budget (Orçamentos)
        "budget.Budget": "fas fa-file-invoice-dollar",
        "budget.BudgetMovement": "fas fa-exchange-alt",
        
        # Budget Line (Linhas Orçamentárias)
        "budgetline.BudgetLine": "fas fa-list-alt",
        "budgetline.BudgetLineMovement": "fas fa-arrows-alt-h",
        "budgetline.BudgetLineVersion": "fas fa-code-branch",
        
        # Contract (Contratos)
        "contract.Contract": "fas fa-file-contract",
        "contract.ContractInstallment": "fas fa-calendar-check",
        "contract.ContractAmendment": "fas fa-file-signature",
        
        # Aid (Auxílios)
        "aid.Assistance": "fas fa-hand-holding-heart",
        
        # AI Assistant (Assistente IA)
        "ai_assistant.ConversationSession": "fas fa-comments",
        "ai_assistant.ConversationMessage": "fas fa-comment-alt",
        "ai_assistant.QueryLog": "fas fa-search",
        "ai_assistant.DatabaseSchema": "fas fa-database",
        "ai_assistant.AliceConfiguration": "fas fa-cog",
    },
    
    # Ícones padrão
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    
    # Menu lateral
    "show_sidebar": True,
    "navigation_expanded": True,
    
    # Links no topo
    "topmenu_links": [
        {"name": "Início", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Ver Site", "url": "/", "new_window": True},
    ],
    
    # Links no menu do usuário
    "usermenu_links": [
        {"name": "Suporte", "url": "https://github.com/user/repo/issues", "new_window": True},
    ],
    
    # Texto de boas-vindas
    "welcome_sign": "⚓ Bem-vindo ao Sistema Minerva",
    "copyright": "⚓ Minerva © 2024 - Sistema de Gestão de Contratos",
    
    # Ordenação do menu
    "order_with_respect_to": [
        "accounts", 
        "employee", 
        "center", 
        "sector", 
        "budget", 
        "budgetline", 
        "contract", 
        "aid", 
        "ai_assistant", 
        "auth"
    ],
    
    # Links personalizados
    "custom_links": {
        "center": [{
            "name": "Relatório de Centros", 
            "url": "admin:center_management_center_changelist", 
            "permissions": ["center.view_management_center"]
        }],
        "sector": [{
            "name": "Organograma", 
            "url": "admin:sector_direction_changelist", 
            "permissions": ["sector.view_direction"]
        }],
        "budget": [{
            "name": "Dashboard Financeiro", 
            "url": "admin:budget_budget_changelist", 
            "permissions": ["budget.view_budget"]
        }]
    },
    
    # Configurações adicionais de UI
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "related_modal_active": False,
    "language_chooser": False,
}