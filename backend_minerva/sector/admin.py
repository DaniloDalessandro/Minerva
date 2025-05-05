from django.contrib import admin
from .models import Direction, Management, Coordination

@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'created_by')
    search_fields = ('name', 'description')

@admin.register(Management)
class ManagementAdmin(admin.ModelAdmin):
    list_display = ('name', 'direction', 'created_at', 'created_by')
    search_fields = ('name', 'description')
    list_filter = ('direction',)

@admin.register(Coordination)
class CoordinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'management', 'created_at', 'created_by')
    search_fields = ('name', 'description')
    list_filter = ('management',)
