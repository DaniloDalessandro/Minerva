"""from .models import Budget, BudgetMovement
from rest_framework import serializers

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at', 'available_amount']

    def create(self, validated_data):
        # Define o available_amount com o valor de total_amount ao criar
        validated_data['available_amount'] = validated_data.get('total_amount')
        return super().create(validated_data)

    def validate(self, data):
        # Verifica a restrição unique_together
        year = data.get('year')
        category = data.get('category')
        management_center = data.get('management_center')

        if Budget.objects.filter(year=year, category=category, management_center=management_center).exists():
            raise serializers.ValidationError(
                f"Já existe um orçamento para o ano de {year}, categoria {category} e centro gestor {management_center.name}."
            )
        return data

class BudgetMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetMovement
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']
""