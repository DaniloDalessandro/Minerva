from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('O e-mail deve ser fornecido'))
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not password:
            raise ValueError(_('A senha é obrigatória para superusuário'))

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superusuário precisa ter is_staff=True.'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superusuário precisa ter is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None  # Remove o campo username
    email = models.EmailField(unique=True, verbose_name="E-mail")
    employee = models.OneToOneField(
    'employee.Employee',  # ← lazy import via string
    on_delete=models.CASCADE,
    verbose_name="Funcionário",
    related_name="user",
    null=True,
    blank=False,
)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def save(self, *args, **kwargs):
        # Se employee está definido e email não está definido, usar email do employee
        if self.employee and not self.email:
            self.email = self.employee.email
        # Se employee mudou, atualizar email
        elif self.employee and self.email != self.employee.email:
            self.email = self.employee.email
        super().save(*args, **kwargs)

    def __str__(self):
        if self.employee:
            return f"{self.employee.full_name} ({self.employee.cpf})"
        return self.email

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
