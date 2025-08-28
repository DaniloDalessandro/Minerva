from django.db import models
from django.core.validators import MinValueValidator
from accounts.models import User
from budget.models import Budget
from employee.models import Employee
from center.models import Management_Center, Requesting_Center

class BudgetLine(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.PROTECT, related_name='budget_lines',verbose_name='Orçamento')
    BUDGET_CATEGORY_CHOICES = [
        ('CAPEX', 'CAPEX'),
        ('OPEX', 'OPEX'),
    ]
    category = models.CharField(
        max_length=100, 
        choices=BUDGET_CATEGORY_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name='Categoria'
    )

    EXPENSE_TYPE_CHOICES = [
        ('Base Principal', 'Base Principal'),
        ('Serviços Especializados', 'Serviços Especializados'),
        ('Despesas Compartilhadas', 'Despesas Compartilhadas'),
    ]
    expense_type = models.CharField(
        max_length=100, 
        choices=EXPENSE_TYPE_CHOICES, 
        verbose_name='Tipo de Despesa'
    )

    management_center = models.ForeignKey(
        Management_Center, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='budget_lines',
        verbose_name='Centro de Gestor'
    )
    requesting_center = models.ForeignKey(
        Requesting_Center, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name='Centro Solicitante'
    )
    summary_description = models.CharField(
        max_length=255, 
        null=True, 
        blank=True, 
        verbose_name='Descrição resumida'
    )
    object = models.CharField(
        max_length=80, 
        blank=True, 
        null=True, 
        verbose_name='Objeto'
    )

    BUDGET_CLASSIFICATION_CHOICES = [
        ('NOVO', 'NOVO'),
        ('RENOVAÇÃO', 'RENOVAÇÃO'),
        ('CARY OVER', 'CARY OVER'),
        ('REPLANEJAMENTO', 'REPLANEJAMENTO'),
        ('N/A', 'N/A'),
    ]
    budget_classification = models.CharField(
        max_length=100, 
        choices=BUDGET_CLASSIFICATION_CHOICES, 
        null=True, 
        blank=True,
        verbose_name='Classificação Orçamentária'
    )

    main_fiscal = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='main_contract_fiscal', 
        blank=True,
        null=True,
        verbose_name='Fiscal Principal'
    )
    secondary_fiscal = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='secondary_contract_fiscal', 
        blank=True,
        null=True,
        verbose_name='Fiscal Substituto'
    )

    CONTRACT_TYPE_CHOICES = [
        ('SERVIÇO', 'SERVIÇO'),
        ('FORNECIMENTO', 'FORNECIMENTO'),
        ('ASSINATURA', 'ASSINATURA'),
        ('FORNECIMENTO/SERVIÇO', 'FORNECIMENTO/SERVIÇO'),
    ]
    contract_type = models.CharField(
        max_length=100, 
        choices=CONTRACT_TYPE_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Tipo de Contrato'
    )

    PROCUREMENT_TYPE_CHOICES = [
        ('LICITAÇÃO', 'LICITAÇÃO'),
        ('DISPENSA EM RAZÃO DO VALOR', 'DISPENSA EM RAZÃO DO VALOR'),
        ('CONVÊNIO', 'CONVÊNIO'),
        ('FUNDO FIXO', 'FUNDO FIXO'),
        ('INEXIGIBILIDADE', 'INEXIGIBILIDADE'),
        ('ATA DE REGISTRO DE PREÇO', 'ATA DE REGISTRO DE PREÇO'),
        ('ACORDO DE COOPERAÇÃO', 'ACORDO DE COOPERAÇÃO'),
        ('APOSTILAMENTO', 'APOSTILAMENTO'),
    ]
    probable_procurement_type = models.CharField(
        max_length=100, 
        choices=PROCUREMENT_TYPE_CHOICES,
        verbose_name='Tipo de Aquisição'
    )
    
    budgeted_amount = models.FloatField(
        default=0, 
        validators=[MinValueValidator(0.01)],
        verbose_name='Valor Orçado'
    )

    PROCESS_STATUS_CHOICES = [
        ('VENCIDO', 'VENCIDO'),
        ('DENTRO DO PRAZO', 'DENTRO DO PRAZO'),
        ('ELABORADO COM ATRASO', 'ELABORADO COM ATRASO'),
        ('ELABORADO NO PRAZO', 'ELABORADO NO PRAZO'),
    ]
    process_status = models.CharField(
        max_length=100, 
        choices=PROCESS_STATUS_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Status do Processo'
    )

    CONTRACT_STATUS_CHOICES = [
        ('DENTRO DO PRAZO', 'DENTRO DO PRAZO'),
        ('CONTRATADO NO PRAZO', 'CONTRATADO NO PRAZO'),
        ('CONTRATADO COM ATRASO', 'CONTRATADO COM ATRASO'),
        ('PRAZO VENCIDO', 'PRAZO VENCIDO'),
        ('LINHA TOTALMENTE REMANEJADA', 'LINHA TOTALMENTE REMANEJADA'),
        ('LINHA TOTALMENTE EXECUTADA', 'LINHA TOTALMENTE EXECUTADA'),
        ('LINHA DE PAGAMENTO', 'LINHA DE PAGAMENTO'),
        ('LINHA PARCIALMENTE REMANEJADA', 'LINHA PARCIALMENTE REMANEJADA'),
        ('LINHA PARCIALMENTE EXECUTADA', 'LINHA PARCIALMENTE EXECUTADA'),
        ('N/A', 'N/A'),
    ]
    contract_status = models.CharField(
        max_length=100, 
        choices=CONTRACT_STATUS_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Status do Contrato'
    )

    contract_notes = models.TextField(
        max_length=400, 
        blank=True, 
        null=True,
        verbose_name='Observações'
    
    )
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='budget_lines_created',verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='budget_lines_updated',verbose_name='Atualizado por')   
   
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if not is_new:
            self.create_version("Atualização da linha orçamentária", kwargs.get('updated_by'))

    def create_version(self, change_reason, user=None):
        latest_version = self.versions.first()
        version_number = (latest_version.version_number + 1) if latest_version else 1
        
        BudgetLineVersion.objects.create(
            budget_line=self,
            version_number=version_number,
            category=self.category,
            expense_type=self.expense_type,
            management_center=self.management_center,
            requesting_center=self.requesting_center,
            summary_description=self.summary_description,
            object=self.object,
            budget_classification=self.budget_classification,
            main_fiscal=self.main_fiscal,
            secondary_fiscal=self.secondary_fiscal,
            contract_type=self.contract_type,
            probable_procurement_type=self.probable_procurement_type,
            budgeted_amount=self.budgeted_amount,
            process_status=self.process_status,
            contract_status=self.contract_status,
            contract_notes=self.contract_notes,
            change_reason=change_reason,
            created_by=user
        )

    def __str__(self):
        return self.summary_description or "Linha orçamentaria desconhecida"

    class Meta:
        verbose_name = 'Linha Orçamentária'
        verbose_name_plural = 'Linhas Orçamentárias'
        ordering = ['-created_at']

#=================================================================================================================
        
class BudgetLineMovement(models.Model):
    source_line = models.ForeignKey(BudgetLine, on_delete=models.CASCADE, related_name='outgoing_movements', verbose_name='Linha de Origem', null=True, blank=True)
    destination_line = models.ForeignKey(BudgetLine, on_delete=models.CASCADE, related_name='incoming_movements', verbose_name='Linha de Destino', null=True, blank=True)
    movement_amount = models.FloatField(validators=[MinValueValidator(0.01)], verbose_name='Valor da Movimentação')
    movement_notes = models.TextField(max_length=400, blank=True, null=True, verbose_name='Motivo')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='budget_line_movements_created', verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='budget_line_movements_updated', verbose_name='Atualizado por')

    def __str__(self):
        return f'{self.movement_type} - {self.movement_amount}'

    class Meta:
        verbose_name = 'Movimentação'
        verbose_name_plural = 'Movimentações'
        ordering = ['-created_at']


class BudgetLineVersion(models.Model):
    budget_line = models.ForeignKey(
        BudgetLine, 
        on_delete=models.CASCADE, 
        related_name='versions',
        verbose_name='Linha Orçamentária'
    )
    version_number = models.PositiveIntegerField(verbose_name='Número da Versão')
    
    category = models.CharField(
        max_length=100, 
        choices=BudgetLine.BUDGET_CATEGORY_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name='Categoria'
    )
    expense_type = models.CharField(
        max_length=100, 
        choices=BudgetLine.EXPENSE_TYPE_CHOICES, 
        verbose_name='Tipo de Despesa'
    )
    management_center = models.ForeignKey(
        Management_Center, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='budget_line_versions',
        verbose_name='Centro de Gestor'
    )
    requesting_center = models.ForeignKey(
        Requesting_Center, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name='Centro Solicitante'
    )
    summary_description = models.CharField(
        max_length=255, 
        null=True, 
        blank=True, 
        verbose_name='Descrição resumida'
    )
    object = models.CharField(
        max_length=80, 
        blank=True, 
        null=True, 
        verbose_name='Objeto'
    )
    budget_classification = models.CharField(
        max_length=100, 
        choices=BudgetLine.BUDGET_CLASSIFICATION_CHOICES, 
        null=True, 
        blank=True,
        verbose_name='Classificação Orçamentária'
    )
    main_fiscal = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='main_fiscal_versions', 
        blank=True,
        null=True,
        verbose_name='Fiscal Principal'
    )
    secondary_fiscal = models.ForeignKey(
        Employee, 
        on_delete=models.PROTECT, 
        related_name='secondary_fiscal_versions', 
        blank=True,
        null=True,
        verbose_name='Fiscal Substituto'
    )
    contract_type = models.CharField(
        max_length=100, 
        choices=BudgetLine.CONTRACT_TYPE_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Tipo de Contrato'
    )
    probable_procurement_type = models.CharField(
        max_length=100, 
        choices=BudgetLine.PROCUREMENT_TYPE_CHOICES,
        verbose_name='Tipo de Aquisição'
    )
    budgeted_amount = models.FloatField(
        default=0, 
        validators=[MinValueValidator(0.01)],
        verbose_name='Valor Orçado'
    )
    process_status = models.CharField(
        max_length=100, 
        choices=BudgetLine.PROCESS_STATUS_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Status do Processo'
    )
    contract_status = models.CharField(
        max_length=100, 
        choices=BudgetLine.CONTRACT_STATUS_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Status do Contrato'
    )
    contract_notes = models.TextField(
        max_length=400, 
        blank=True, 
        null=True,
        verbose_name='Observações'
    )
    
    change_reason = models.TextField(
        max_length=500,
        verbose_name='Motivo da Alteração'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='budget_line_versions_created',
        verbose_name='Criado por'
    )
    
    def __str__(self):
        return f"{self.budget_line.summary_description} - Versão {self.version_number}"
    
    class Meta:
        verbose_name = 'Versão de Linha Orçamentária'
        verbose_name_plural = 'Versões de Linhas Orçamentárias'
        unique_together = ['budget_line', 'version_number']
        ordering = ['-version_number']