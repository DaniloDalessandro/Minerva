from django.contrib import admin
from django.contrib.auth.models import Group
from .models import User


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['employee', 'email', 'is_active']
    search_fields = ['employee__name', 'email']
    
    # Agora mostra employee e grupos no formulário do admin
    fields = ['employee', 'groups']
    filter_horizontal = ['groups']  # Interface melhor para selecionar múltiplos grupos

    # Se quiser aplicar uma lógica específica para permitir a edição, revise a lógica
    def has_change_permission(self, request, obj=None):
        # Exemplo: permitir que apenas superusuários editem
        if request.user.is_superuser:
            return True
        return False

# Registrando o User com o CustomUserAdmin
admin.site.register(User, CustomUserAdmin)

