from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    model = User

    # Campos mostrados ao adicionar um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('employee',),
        }),
    )

    # Campos mostrados ao editar um usuário existente
    fieldsets = (
        (None, {'fields': ('email', 'employee')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    readonly_fields = ('email',)
    list_display = ('email', 'employee', 'is_staff')
    ordering = ('email',)
    search_fields = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('employee',)
        return self.readonly_fields
