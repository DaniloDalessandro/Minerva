# accounts/admin.py

from django.contrib import admin
from .models import User
from employee.models import Employee

class UserAdmin(admin.ModelAdmin):
    list_display = ['employee', 'email', 'is_active']
    search_fields = ['employee__name', 'email']

    # Só permite selecionar o funcionário
    fields = ['employee']
    
    def has_change_permission(self, request, obj=None):
        return True

admin.site.register(User, UserAdmin)
