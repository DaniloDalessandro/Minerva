from django.contrib import admin
from .models import Management_Center, Requesting_Center, CenterHierarchy

@admin.register(Management_Center)
class ManagementCenterAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'description',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    )
    search_fields = ('name',)
    readonly_fields = (
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        ('Auditoria', {
            'classes': ('collapse',),
            'fields': (
                'created_by',
                'updated_by',
                'created_at',
                'updated_at',
            )
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Requesting_Center)
class RequestingCenterAdmin(admin.ModelAdmin):
    list_display = (
        'management_center',
        'name',
        'description',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    )
    list_filter = ('management_center',)
    search_fields = ('name',)
    readonly_fields = (
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        (None, {
            'fields': ('management_center', 'name', 'description')
        }),
        ('Auditoria', {
            'classes': ('collapse',),
            'fields': (
                'created_by',
                'updated_by',
                'created_at',
                'updated_at',
            )
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(CenterHierarchy)
class CenterHierarchyAdmin(admin.ModelAdmin):
    list_display = (
        'management_center',
        'direction', 
        'management',
        'coordination',
        'hierarchy_level',
        'created_at',
    )
    list_filter = (
        'direction',
        'management', 
        'coordination',
        'created_at',
    )
    search_fields = (
        'management_center__name',
        'direction__name',
        'management__name', 
        'coordination__name',
    )
    readonly_fields = (
        'hierarchy_level',
        'created_by',
        'created_at',
        'updated_at',
    )
    fieldsets = (
        ('Associação Centro-Hierarquia', {
            'fields': (
                'management_center',
                'direction',
                'management', 
                'coordination',
                'hierarchy_level',
            )
        }),
        ('Auditoria', {
            'classes': ('collapse',),
            'fields': (
                'created_by',
                'created_at',
                'updated_at',
            )
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)