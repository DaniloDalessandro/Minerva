# employee/models.py
from django.db import models

class Employee(models.Model):
    full_name = models.CharField("Nome completo", max_length=255)
    email = models.EmailField("Email", unique=True)
    position = models.CharField("Cargo", max_length=100, blank=True, null=True)
    department = models.CharField("Departamento", max_length=100, blank=True, null=True)

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Funcionário"
        verbose_name_plural = "Funcionários"
