from django.db import models
from accounts.models import User
from budgetline.models import BudgetLine
from employee.models import Employee
from django.core.validators import MinValueValidator

# =================================================================================================================
class Assistance(models.Model):
    
    STATUS_CHOICES = [
    ('AGUARDANDO', 'Aguardando Início'),
    ('ATIVO', 'Ativo'),
    ('CONCLUIDO', 'Concluído'),
    ('CANCELADO', 'Cancelado'),
    ]

    TYPE_CHOICES = [
    ('GRADUACAO', 'Graduação'),
    ('POS_GRADUACAO', 'Pós-Graduação'),
    ('AUXILIO_CHECHE_ESCOLA', 'Auxílio Creche Escola'),
    ('LINGUA_ESTRANGEIRA', 'Língua Estrangeira'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='assistances',verbose_name='Funcionário')
    budget_line = models.ForeignKey(BudgetLine, on_delete=models.CASCADE, related_name='assistances',verbose_name='Linha Orçamentária')
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, null=True, blank=True,verbose_name='Tipo')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)],verbose_name='Valor Total')
    installment_count = models.PositiveIntegerField(null=True, blank=True,verbose_name='Número de Parcelas')
    amount_per_installment = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,verbose_name='Valor por Parcela')
    start_date = models.DateField(verbose_name='Data de Início')
    end_date = models.DateField(null=True, blank=True,verbose_name='Data de Término')
    notes = models.TextField(blank=True,verbose_name='Observações')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AGUARDANDO',verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')   
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_assistances',verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_assistances',verbose_name='Atualizado por')

    def __str__(self):
        return self.employee.name + ' - ' + self.budget_line.name

    class Meta:
        ordering = ['start_date']
        verbose_name = 'Assistência'
        verbose_name_plural = 'Assistências'