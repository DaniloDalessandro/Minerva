from django.contrib import admin
from django.contrib.auth.models import Group
from .models import User
from employee.models import Employee

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['employee', 'email', 'is_active']
    search_fields = ['employee__name', 'email']
    
    # Agora mostra employee e grupos no formulário do admin
    fields = ['employee', 'groups']
    filter_horizontal = ['groups']  # Interface melhor para selecionar múltiplos grupos

    def has_change_permission(self, request, obj=None):
        return True

admin.site.register(User, CustomUserAdmin)
admin.site.unregister(Group)
admin.site.register(Group)
