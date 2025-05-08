from django.contrib import admin
from .models import CentroDeCustoGestor, CentroDeCustoSolicitante

@admin.register(CentroDeCustoGestor)
class CentroDeCustoGestorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'created_at', 'updated_at', 'created_by', 'updated_by')
    search_fields = ('nome',)
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(CentroDeCustoSolicitante)
class CentroDeCustoSolicitanteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'centro_gestor', 'created_at', 'updated_at', 'created_by', 'updated_by')
    search_fields = ('nome', 'centro_gestor__nome')
    list_filter = ('centro_gestor', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
