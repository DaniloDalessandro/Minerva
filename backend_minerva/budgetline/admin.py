from django.contrib import admin
from budgetline.models import BudgetLine, BudgetLineMovement

class BudgetLineAdmin(admin.ModelAdmin):
    list_display = ('budget', 'category', 'expense_type', 'management_center', 'requesting_center', 'summary_description', 'object', 'created_by', 'updated_by', 'created_at', 'updated_at')  
    readonly_fields = ('created_by', 'updated_by', 'created_at', 'updated_at')  

    def save_model(self, request, obj, form, change):
        if not obj.pk: 
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

admin.site.register(BudgetLine, BudgetLineAdmin)

#=================================================================================================================

class BudgetLineMovementAdmin(admin.ModelAdmin):
    list_display = ('source_line', 'destination_line','movement_amount', 'created_by', 'updated_by', 'created_at', 'updated_at')  
    readonly_fields = ('created_by', 'updated_by', 'created_at', 'updated_at')  

    def save_model(self, request, obj, form, change):
        if not obj.pk: 
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

admin.site.register(BudgetLineMovement, BudgetLineMovementAdmin)