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
    
    # Campos calculados
    used_amount = serializers.ReadOnlyField()
    calculated_available_amount = serializers.ReadOnlyField()
    valor_remanejado_entrada = serializers.ReadOnlyField()
    valor_remanejado_saida = serializers.ReadOnlyField()
    
    class Meta:
        model = Budget
        fields = [
            'id', 'year', 'category', 'management_center', 
            'management_center_id', 'total_amount', 'available_amount', 'status',
            'used_amount', 'calculated_available_amount',
            'valor_remanejado_entrada', 'valor_remanejado_saida',
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['created_at', 'updated_at', 'available_amount', 'used_amount', 'calculated_available_amount', 'valor_remanejado_entrada', 'valor_remanejado_saida']


class BudgetDetailSerializer(BudgetSerializer):
    """
    Serializer detalhado para Budget incluindo linhas orçamentárias vinculadas
    """
    # Linhas orçamentárias vinculadas
    budget_lines = serializers.SerializerMethodField()
    
    # Estatísticas das linhas orçamentárias
    budget_lines_summary = serializers.SerializerMethodField()
    
    # Histórico de movimentações
    movements_summary = serializers.SerializerMethodField()
    
    class Meta(BudgetSerializer.Meta):
        fields = BudgetSerializer.Meta.fields + [
            'budget_lines', 'budget_lines_summary', 'movements_summary'
        ]
    
    def get_budget_lines(self, obj):
        """
        Retorna as linhas orçamentárias vinculadas ao orçamento com informações detalhadas
        """
        from budgetline.serializers import BudgetLineDetailSerializer
        
        # Busca as linhas com prefetch para otimização
        budget_lines = obj.budget_lines.select_related(
            'management_center', 'requesting_center', 'main_fiscal', 
            'secondary_fiscal', 'created_by', 'updated_by'
        ).prefetch_related('versions').order_by('-created_at')
        
        return BudgetLineDetailSerializer(budget_lines, many=True).data
    
    def get_budget_lines_summary(self, obj):
        """
        Retorna um resumo das linhas orçamentárias
        """
        budget_lines = obj.budget_lines.all()
        total_budgeted = sum(line.budgeted_amount for line in budget_lines)
        
        # Contagem por status de processo
        process_status_counts = {}
        for line in budget_lines:
            status = line.process_status or 'N/A'
            process_status_counts[status] = process_status_counts.get(status, 0) + 1
        
        # Contagem por status de contrato
        contract_status_counts = {}
        for line in budget_lines:
            status = line.contract_status or 'N/A'
            contract_status_counts[status] = contract_status_counts.get(status, 0) + 1
        
        # Contagem por tipo de despesa
        expense_type_counts = {}
        for line in budget_lines:
            expense_type = line.expense_type or 'N/A'
            expense_type_counts[expense_type] = expense_type_counts.get(expense_type, 0) + 1
        
        return {
            'total_lines': budget_lines.count(),
            'total_budgeted_amount': float(total_budgeted),
            'remaining_amount': float(obj.available_amount),
            'utilization_percentage': round((float(total_budgeted) / float(obj.total_amount)) * 100, 2) if obj.total_amount > 0 else 0,
            'process_status_distribution': process_status_counts,
            'contract_status_distribution': contract_status_counts,
            'expense_type_distribution': expense_type_counts
        }
    
    def get_movements_summary(self, obj):
        """
        Retorna um resumo das movimentações do orçamento
        """
        # Movimentações onde este orçamento é origem (saídas)
        outgoing_movements = obj.outgoing_movements.all()
        total_outgoing = sum(movement.amount for movement in outgoing_movements)
        
        # Movimentações onde este orçamento é destino (entradas)
        incoming_movements = obj.incoming_movements.all()
        total_incoming = sum(movement.amount for movement in incoming_movements)
        
        return {
            'total_outgoing_movements': outgoing_movements.count(),
            'total_incoming_movements': incoming_movements.count(),
            'total_outgoing_amount': float(total_outgoing),
            'total_incoming_amount': float(total_incoming),
            'net_movement': float(total_incoming - total_outgoing),
            'last_movement_date': max(
                [m.movement_date for m in list(outgoing_movements) + list(incoming_movements)],
                default=None
            )
        }

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
    # Nested representation for read operations
    source = BudgetSerializer(read_only=True)
    destination = BudgetSerializer(read_only=True)
    # Write fields for creating/updating movements
    source_id = serializers.IntegerField(write_only=True, required=True)
    destination_id = serializers.IntegerField(write_only=True, required=True)
    # User information for audit fields
    created_by = UserInfoSerializer(read_only=True)
    updated_by = UserInfoSerializer(read_only=True)
    
    class Meta:
        model = BudgetMovement
        fields = [
            'id', 'source', 'source_id', 'destination', 'destination_id', 
            'amount', 'movement_date', 'notes', 
            'created_at', 'updated_at', 'created_by', 'updated_by'
        ]
        read_only_fields = ['created_by', 'updated_by', 'created_at', 'updated_at']
