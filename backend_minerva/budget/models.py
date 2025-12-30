from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User
from .utils.validators import validate_year
from center.models import Management_Center
from accounts.permissions import HierarchicalPermissionMixin
from decimal import Decimal
from django.db.models import Sum

#========================================================================================================================================
class Budget(models.Model, HierarchicalPermissionMixin):
    BUDGET_CLASSES = [
        ('CAPEX', 'CAPEX'),
        ('OPEX', 'OPEX'),
    ]
    year = models.PositiveIntegerField(validators=[validate_year],verbose_name='Ano')
    category = models.CharField(max_length=5, choices=BUDGET_CLASSES,verbose_name='Categoria')
    management_center = models.ForeignKey(
        Management_Center, 
        on_delete=models.CASCADE, 
        related_name='budgets',
        verbose_name='Centro Gestor'
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Valor Total'
    )
    available_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.00'))], 
        default=0.0,
        verbose_name='Valor Disponível'
    )
    STATUS = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]
    status = models.CharField(max_length=7, choices=STATUS, default='ATIVO', verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='budgets_created', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='budgets_updated', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Atualizado por')
    

    @property
    def used_amount(self):
        """Calcula o valor utilizado baseado na soma das linhas orçamentárias"""
        total_budgeted = self.budget_lines.aggregate(
            total=Sum('budgeted_amount')
        )['total']
        # Converte float para Decimal para compatibilidade
        if total_budgeted is None:
            return Decimal('0.00')
        return Decimal(str(total_budgeted))
    
    @property
    def valor_remanejado_entrada(self):
        """Calcula o valor total recebido via movimentações (entradas)"""
        incoming_total = self.incoming_movements.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        return incoming_total
    
    @property
    def valor_remanejado_saida(self):
        """Calcula o valor total enviado via movimentações (saídas)"""
        outgoing_total = self.outgoing_movements.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        return outgoing_total
    
    @property
    def calculated_available_amount(self):
        """Calcula o valor disponível considerando movimentações"""
        # Valor base é o total_amount
        base_amount = Decimal(str(self.total_amount))
        
        # Movimentações
        entrada = self.valor_remanejado_entrada
        saida = self.valor_remanejado_saida
        
        # Valor usado pelas linhas orçamentárias
        used_by_lines = self.used_amount
        
        # Disponível = total + entrada - saída - usado
        available = base_amount + entrada - saida - used_by_lines
        return max(available, Decimal('0.00'))
    
    def update_calculated_amounts(self):
        """Atualiza o available_amount com base nos cálculos automáticos"""
        self.available_amount = self.calculated_available_amount
        self.save(update_fields=['available_amount', 'updated_at'])
    
    def save(self, *args, **kwargs):
        # Se não é uma atualização manual do available_amount, calcular automaticamente
        if 'update_fields' not in kwargs or 'available_amount' not in kwargs.get('update_fields', []):
            # Só calcular se já existe (não é criação inicial)
            if self.pk:
                self.available_amount = self.calculated_available_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category} {self.year} - {self.management_center.name}"
    
    @classmethod
    def get_objects_by_direction(cls, direction):
        """Retorna orçamentos baseados na direção"""
        # Assumindo que management_center tem relação com direção
        # Adapte conforme sua estrutura de dados
        return cls.objects.filter(
            management_center__direction=direction
        ) if hasattr(cls.objects.model._meta.get_field('management_center').remote_field.model, 'direction') else cls.objects.none()
    
    @classmethod
    def get_objects_by_management(cls, management):
        """Retorna orçamentos baseados na gerência"""
        return cls.objects.filter(
            management_center__management=management
        ) if hasattr(cls.objects.model._meta.get_field('management_center').remote_field.model, 'management') else cls.objects.none()
    
    @classmethod
    def get_objects_by_coordination(cls, coordination):
        """Retorna orçamentos baseados na coordenação - filtro principal"""
        return cls.objects.filter(
            management_center__coordination=coordination
        ) if hasattr(cls.objects.model._meta.get_field('management_center').remote_field.model, 'coordination') else cls.objects.none()
    
    @classmethod
    def get_objects_by_user(cls, user):
        """Retorna orçamentos que o usuário específico pode ver"""
        if user.employee and user.employee.coordination:
            return cls.get_objects_by_coordination(user.employee.coordination)
        return cls.objects.none()
    
    class Meta:
        unique_together = ['year', 'category', 'management_center']
        verbose_name = 'Orçamento'
        verbose_name_plural = 'Orçamentos'
        indexes = [
            models.Index(fields=['year'], name='budget_year_idx'),
            models.Index(fields=['category'], name='budget_category_idx'),
            models.Index(fields=['status'], name='budget_status_idx'),
            models.Index(fields=['management_center'], name='budget_mgmt_center_idx'),
            models.Index(fields=['year', 'category'], name='budget_year_cat_idx'),
        ]
        ordering = ['-year', 'category']

#==================================================================================================================================

class BudgetMovement(models.Model):
    source = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='outgoing_movements',verbose_name='Origem')
    destination = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='incoming_movements',verbose_name='Destino')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))],verbose_name='Valor')
    movement_date = models.DateField(auto_now_add=True,verbose_name='Data da Movimentação')
    notes = models.TextField(blank=True, null=True,verbose_name='Observações')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='budget_movements_created', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='budget_movements_updated', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Atualizado por')
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Atualizar os valores calculados dos orçamentos relacionados
        self.source.update_calculated_amounts()
        self.destination.update_calculated_amounts()
    
    def delete(self, *args, **kwargs):
        source_budget = self.source
        destination_budget = self.destination
        super().delete(*args, **kwargs)
        # Atualizar os valores calculados dos orçamentos relacionados
        source_budget.update_calculated_amounts()
        destination_budget.update_calculated_amounts()

    def __str__(self):
        return f"{self.source} -> {self.destination} ({self.amount})"
    
    class Meta:
        verbose_name = 'Movimentação'
        verbose_name_plural = 'Movimentações'
        ordering = ['-movement_date']
