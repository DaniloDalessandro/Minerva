from rest_framework import serializers
from .models import BudgetLine, BudgetLineMovement

class BudgetLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetLine
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']

#=================================================================================================================

class BudgetLineMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetLineMovement
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']