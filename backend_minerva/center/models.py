from django.db import models
from django.core.exceptions import ValidationError
from accounts.models import User
from .utils.validators import validate_registry_field

#=================================================================================================================

class Management_Center(models.Model):
    name = models.CharField(max_length=100, unique=True, validators=[validate_registry_field], verbose_name='Nome')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='centros_gertores_criados', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='centros_gestores_atualizados', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Atualizado por')

    def clean(self):
        """Custom validation with Zod-like behavior"""
        errors = {}
        
        if self.name:
            try:
                # Validate and clean the name
                cleaned_name = validate_registry_field(self.name)
                self.name = cleaned_name
                
                # Check for duplicates (excluding current instance)
                existing = Management_Center.objects.filter(name=cleaned_name)
                if self.pk:
                    existing = existing.exclude(pk=self.pk)
                    
                if existing.exists():
                    errors['name'] = {
                        'field': 'name',
                        'code': 'duplicate',
                        'message': 'Já existe um centro gestor com este registro.'
                    }
            except ValidationError as e:
                errors['name'] = e.message_dict if hasattr(e, 'message_dict') else {'message': str(e)}
        
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:        
        verbose_name = 'Centro Gestor'
        verbose_name_plural = 'Centros Gestores'
        ordering = ['name']
    
#=================================================================================================================

class Requesting_Center(models.Model):
    management_center = models.ForeignKey(Management_Center, on_delete=models.CASCADE, related_name='solicitantes', verbose_name='Centro Gestor')
    name = models.CharField(max_length=100, validators=[validate_registry_field], verbose_name='Nome')
    description = models.TextField(blank=True, null=True, verbose_name='Descrição')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, related_name='centros_solicitantes_criados', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Criado por')
    updated_by = models.ForeignKey(User, related_name='centros_solicitantes_atualizados', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Atualizado por')

    def clean(self):
        """Custom validation with Zod-like behavior"""
        errors = {}
        
        if self.name:
            try:
                # Validate and clean the name
                cleaned_name = validate_registry_field(self.name)
                self.name = cleaned_name
                
                # Check for duplicates within the same management center
                if self.management_center:
                    existing = Requesting_Center.objects.filter(
                        management_center=self.management_center,
                        name=cleaned_name
                    )
                    if self.pk:
                        existing = existing.exclude(pk=self.pk)
                        
                    if existing.exists():
                        errors['name'] = {
                            'field': 'name',
                            'code': 'duplicate',
                            'message': 'Já existe um centro solicitante com este registro no centro gestor selecionado.'
                        }
            except ValidationError as e:
                errors['name'] = e.message_dict if hasattr(e, 'message_dict') else {'message': str(e)}
        
        if not self.management_center:
            errors['management_center'] = {
                'field': 'management_center',
                'code': 'required',
                'message': 'O centro gestor é obrigatório.'
            }
        
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Centro Solicitante'
        verbose_name_plural = 'Centros Solicitantes'
        unique_together = ('management_center', 'name')
        ordering = ['name']