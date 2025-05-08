from django.db import models
from accounts.models import User

# ============================================================================================================

class CentroDeCustoGestor(models.Model):
    nome = models.CharField(max_length=100,unique=True)
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='center_custo_created',verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='center_custo_updated',verbose_name='Atualizado por')

    def __str__(self):
        return self.nome
    
# ============================================================================================================

class CentroDeCustoSolicitante(models.Model):
    centro_gestor = models.ForeignKey(CentroDeCustoGestor, on_delete=models.CASCADE, related_name='solicitantes')
    nome = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Atualizado em')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='center_solicita_created',verbose_name='Criado por')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='center_solicita_updated',verbose_name='Atualizado por')

    def __str__(self):
        return self.nome

    class Meta:
        unique_together = ('centro_gestor', 'nome')