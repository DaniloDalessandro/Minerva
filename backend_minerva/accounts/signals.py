# accounts/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
import random
import string
from django.core.mail import send_mail
from django.conf import settings

def gerar_senha(tamanho=10):
    caracteres = string.ascii_letters + string.digits
    return ''.join(random.choices(caracteres, k=tamanho))

@receiver(post_save, sender=User)
def definir_senha_e_enviar_email(sender, instance, created, **kwargs):
    if created:
        # Preencher o e-mail com o do employee, se ainda não estiver preenchido
        if not instance.email and instance.employee:
            instance.email = instance.employee.email

        nova_senha = gerar_senha()
        instance.set_password(nova_senha)
        instance.save()  # Atualiza o user com email e senha criptografada

        # Envia e-mail com senha gerada
        send_mail(
            'Acesso ao Sistema Minerva',
            f'Olá,\n\nSeu usuário foi criado no sistema Minerva.\nE-mail: {instance.email}\nSenha: {nova_senha}\n\nRecomenda-se trocar a senha após o primeiro acesso.',
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )
