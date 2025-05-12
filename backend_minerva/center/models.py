from django.db import models
from accounts.models import User
from .utils.validators import validate_name

#=================================================================================================================

class Management_Center(models.Model):
    name = models.CharField(max_length=100, unique=True, validators=[validate_name],verbose_name='Nome')
    description = models.TextField(blank=True,null=True,verbose_name='Descrição')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='centros_gertores_criados', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='centros_gestores_atualizados', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Atualizado por')

    def __str__(self):
        return self.name
    
    class Meta:        
        verbose_name = 'Centro Gestor'
        verbose_name_plural = 'Centros Gestores'
        ordering = ['name']
    
#=================================================================================================================

class Requesting_Center(models.Model):
    management_center = models.ForeignKey(Management_Center, on_delete=models.CASCADE, related_name='solicitantes',verbose_name='Centro Gestor')
    name = models.CharField(max_length=100,verbose_name='Nome')
    description = models.TextField(blank=True,null=True,verbose_name='Descrição')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='centros_solicitantes_criados', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='centros_solicitantes_atualizados', on_delete=models.SET_NULL, null=True, blank=True,verbose_name='Atualizado por')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Centro Solicitante'
        verbose_name_plural = 'Centros Solicitantes'
        unique_together = ('management_center', 'name')
        ordering = ['name']