from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User
from .utils.validators import validate_year
from center.models import Management_Center

#========================================================================================================================================
class Budget(models.Model):
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
        validators=[MinValueValidator(0.01)],
        verbose_name='Valor Total'
    )
    available_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)], 
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
    

    def __str__(self):
        return f"{self.category} {self.year} - {self.management_center.name}"
    
    class Meta:
        unique_together = ['year', 'category', 'management_center']
        verbose_name = 'Orçamento'
        verbose_name_plural = 'Orçamentos'
        ordering = ['-year', 'category']

#==================================================================================================================================

class BudgetMovement(models.Model):
    source = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='outgoing_movements',verbose_name='Origem')
    destination = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='incoming_movements',verbose_name='Destino')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)],verbose_name='Valor')
    movement_date = models.DateField(auto_now_add=True,verbose_name='Data da Movimentação')
    notes = models.TextField(blank=True, null=True,verbose_name='Observações')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    update_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='budget_movements_created', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='budget_movements_updated', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Atualizado por')
    
    def __str__(self):
        return f"{self.source} -> {self.destination} ({self.amount})"
    
    class Meta:
        verbose_name = 'Movimentação'
        verbose_name_plural = 'Movimentações'
        ordering = ['-movement_date']
