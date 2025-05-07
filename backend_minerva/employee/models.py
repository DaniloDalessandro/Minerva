# employee/models.py
from django.db import models
from sector.models import Direction, Management, Coordination
from accounts.models import User

class Employee(models.Model):
    full_name = models.CharField("Nome completo", max_length=255)
    email = models.EmailField("Email", unique=True)
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, null=True,verbose_name="Direção")
    management = models.ForeignKey(Management, on_delete=models.SET_NULL, null=True, verbose_name="Gerência")
    coordination = models.ForeignKey(Coordination, on_delete=models.SET_NULL, null=True, verbose_name="Coordenação")
    cpf = models.CharField(max_length=15)
    STATUS = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]
    status = models.CharField(max_length=7, choices=STATUS, default='ATIVO')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employees_created', verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employees_updated', verbose_name='Atualizado por')

    def __str__(self):
        return self.full_name + " - " + self.cpf

    class Meta:
        verbose_name = "Funcionário"
        verbose_name_plural = "Funcionários"
