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
    'accounts.middleware.HierarchicalPermissionMiddleware',  # Middleware de permissões hierárquicas
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
                'accounts.middleware.user_permission_context',  # Context processor de permissões
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

# Configuração do Jazzmin
JAZZMIN_SETTINGS = {
    "site_title": "Minerva Admin",
    "site_header": "Minerva",
    "site_brand": "Minerva",
    "site_logo": "img/logo.svg",
    "login_logo": None,
    "login_logo_dark": None,
    "site_icon": "img/favicon.svg",  # Favicon customizado com âncora
    "welcome_sign": "Bem-vindo ao Sistema Minerva",
    "copyright": "Minerva © 2024 - Sistema de Gestão",
    
    # Sidebar
    "show_sidebar": True,
    "navigation_expanded": True,
    
    # Top Menu
    "topmenu_links": [
        {"name": "Início", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Ver Site", "url": "/", "new_window": True},
    ],
    
    # User Menu
    "usermenu_links": [
        {"name": "Perfil", "url": "admin:password_change", "icon": "fas fa-user-cog"},
    ],
    
    # Ícones por aplicação/modelo - Modernizados e coesos
    "icons": {
        # Autenticação e Usuários
        "auth": "fas fa-shield-alt",
        "auth.user": "fas fa-user-circle",
        "auth.Group": "fas fa-users",
        "accounts": "fas fa-user-shield",
        "accounts.User": "fas fa-id-card",
        
        # Funcionários
        "employee": "fas fa-address-card",
        "employee.Employee": "fas fa-user-tag",
        
        # Centros
        "center": "fas fa-building",
        "center.Management_Center": "fas fa-warehouse",
        "center.Requesting_Center": "fas fa-store-alt",
        
        # Setores
        "sector": "fas fa-sitemap",
        "sector.Direction": "fas fa-compass",
        "sector.Management": "fas fa-cogs",
        "sector.Coordination": "fas fa-project-diagram",
        
        # Orçamento
        "budget": "fas fa-chart-pie",
        "budget.Budget": "fas fa-wallet",
        "budgetline": "fas fa-chart-line",
        "budgetline.BudgetLine": "fas fa-list-alt",
        
        # Contratos
        "contract": "fas fa-file-signature",
        "contract.Contract": "fas fa-handshake",
        
        # Auxílios/Assistência
        "aid": "fas fa-hand-holding-usd",
        "aid.Assistance": "fas fa-heart",
        
        # IA Assistant
        "ai_assistant": "fas fa-brain",
        "ai_assistant.ConversationSession": "fas fa-comment-dots",
        
        # Admin
        "admin.LogEntry": "fas fa-clipboard-list",
    },
    
    # Ícones padrão
    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-file",
    
    # Configurações de UI
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs"
    },
    
    # Configurações de tema
    "theme": "default",
    "dark_mode_theme": None,
    
    # Modern UI improvements
    "show_ui_builder": False,
    "related_modal_active": False,
    "use_google_fonts_cdn": True,
    
    # Links customizados
    "custom_links": {
        "accounts": [{
            "name": "Gerenciar Usuários",
            "url": "admin:accounts_user_changelist",
            "icon": "fas fa-users-cog",
            "permissions": ["accounts.view_user"]
        }],
        "budget": [{
            "name": "Dashboard Financeiro",
            "url": "admin:budget_budget_changelist",
            "icon": "fas fa-chart-pie",
            "permissions": ["budget.view_budget"]
        }],
        "contract": [{
            "name": "Relatório de Contratos",
            "url": "admin:contract_contract_changelist",
            "icon": "fas fa-file-chart-column",
            "permissions": ["contract.view_contract"]
        }]
    },
    
    # Ordem dos apps
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
    
}

