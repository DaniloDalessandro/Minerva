from .models import Budget, BudgetMovement
from rest_framework import serializers
from center.models import Management_Center
from center.serializers import ManagementCenterSerializer, UserInfoSerializer
from django.core.exceptions import ValidationError as DjangoValidationError
import logging

class BudgetSerializer(serializers.ModelSerializer):
    # Nested representation for read operations
    management_center = ManagementCenterSerializer(read_only=True)
    # Write field for management_center
    management_center_id = serializers.IntegerField(write_only=True, required=True)
    # User information for audit fields
    created_by = UserInfoSerializer(read_only=True)
    updated_by = UserInfoSerializer(read_only=True)
    
    class Meta:
        model = Budget
        fields = [
            'id', 'year', 'category', 'management_center', 
            'management_center_id', 'total_amount', 'available_amount', 'status',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'available_amount']

    def create(self, validated_data):
        logger = logging.getLogger(__name__)
        logger.info(f"Creating budget with validated_data: {validated_data}")
        
        # Handle management_center_id
        management_center_id = validated_data.pop('management_center_id', None)
        if management_center_id:
            try:
                management_center = Management_Center.objects.get(id=management_center_id)
                validated_data['management_center'] = management_center
                logger.info(f"Management center found: {management_center.name}")
            except Management_Center.DoesNotExist:
                logger.error(f"Management center with ID {management_center_id} not found")
                raise serializers.ValidationError(
                    {'management_center_id': 'Centro gestor não encontrado.'}
                )
        
        # Define o available_amount com o valor de total_amount ao criar
        total_amount = validated_data.get('total_amount')
        if total_amount is None:
            logger.error("total_amount is missing from validated_data")
            raise serializers.ValidationError(
                {'total_amount': 'Valor total é obrigatório.'}
            )
        
        validated_data['available_amount'] = total_amount
        logger.info(f"Setting available_amount to {total_amount}")
        
        try:
            return super().create(validated_data)
        except Exception as e:
            logger.error(f"Error creating budget: {str(e)}")
            raise

    def update(self, instance, validated_data):
        # Handle management_center_id for updates
        management_center_id = validated_data.pop('management_center_id', None)
        if management_center_id:
            try:
                management_center = Management_Center.objects.get(id=management_center_id)
                validated_data['management_center'] = management_center
            except Management_Center.DoesNotExist:
                raise serializers.ValidationError(
                    {'management_center_id': 'Centro gestor não encontrado.'}
                )
        
        return super().update(instance, validated_data)

    def validate(self, data):
        logger = logging.getLogger(__name__)
        logger.info(f"Validating budget data: {data}")
        
        # Validate required fields
        required_fields = ['year', 'category', 'total_amount']
        for field in required_fields:
            if not data.get(field):
                logger.error(f"Required field missing: {field}")
                raise serializers.ValidationError(
                    {field: f"O campo {field} é obrigatório."}
                )
        
        # Handle management_center for validation
        management_center = data.get('management_center')
        management_center_id = data.get('management_center_id')
        
        if not management_center and management_center_id:
            try:
                management_center = Management_Center.objects.get(id=management_center_id)
                data['management_center'] = management_center
                logger.info(f"Management center resolved: {management_center.name}")
            except Management_Center.DoesNotExist:
                logger.error(f"Management center with ID {management_center_id} not found")
                raise serializers.ValidationError(
                    {'management_center_id': 'Centro gestor não encontrado.'}
                )
        
        if not management_center and not management_center_id:
            logger.error("No management center provided")
            raise serializers.ValidationError(
                {'management_center_id': 'Centro gestor é obrigatório.'}
            )

        # Validate total_amount
        total_amount = data.get('total_amount')
        if total_amount is not None and total_amount <= 0:
            logger.error(f"Invalid total_amount: {total_amount}")
            raise serializers.ValidationError(
                {'total_amount': 'O valor total deve ser maior que zero.'}
            )
        
        # Validate year
        year = data.get('year')
        if year:
            try:
                # Call the model's year validator
                from .utils.validators import validate_year
                validate_year(year)
            except DjangoValidationError as e:
                logger.error(f"Year validation failed: {str(e)}")
                raise serializers.ValidationError(
                    {'year': str(e)}
                )

        # Verifica a restrição unique_together
        category = data.get('category')
        
        if management_center and year and category:
            budget_exists = Budget.objects.filter(
                year=year, 
                category=category, 
                management_center=management_center
            )
            
            # Exclude current instance if updating
            if self.instance:
                budget_exists = budget_exists.exclude(pk=self.instance.pk)
            
            if budget_exists.exists():
                error_msg = f"Já existe um orçamento para o ano de {year}, categoria {category} e centro gestor {management_center.name}."
                logger.error(error_msg)
                raise serializers.ValidationError(error_msg)
        
        logger.info("Budget validation completed successfully")
        return data

class BudgetMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetMovement
        fields = '__all__'
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']
