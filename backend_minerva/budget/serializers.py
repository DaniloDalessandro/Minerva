from .models import Budget, BudgetMovement
from rest_framework import serializers

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']

class BudgetMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetMovement
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']