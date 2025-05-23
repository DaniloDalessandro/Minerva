# Generated by Django 5.2 on 2025-05-11 22:14

import budget.utils.validators
import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('center', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Budget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.PositiveIntegerField(validators=[budget.utils.validators.validate_year], verbose_name='Ano')),
                ('category', models.CharField(choices=[('CAPEX', 'CAPEX'), ('OPEX', 'OPEX')], max_length=5, verbose_name='Categoria')),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Valor Total')),
                ('available_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)], verbose_name='Valor Disponível')),
                ('status', models.CharField(choices=[('ATIVO', 'Ativo'), ('INATIVO', 'Inativo')], default='ATIVO', max_length=7, verbose_name='Status')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='budgets_created', to=settings.AUTH_USER_MODEL, verbose_name='Criado por')),
                ('management_center', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='budgets', to='center.management_center', verbose_name='Centro Gestor')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='budgets_updated', to=settings.AUTH_USER_MODEL, verbose_name='Atualizado por')),
            ],
            options={
                'verbose_name': 'Orçamento',
                'verbose_name_plural': 'Orçamentos',
                'ordering': ['-year', 'category'],
                'unique_together': {('year', 'category', 'management_center')},
            },
        ),
        migrations.CreateModel(
            name='BudgetMovement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Valor')),
                ('movement_date', models.DateField(auto_now_add=True, verbose_name='Data da Movimentação')),
                ('notes', models.TextField(blank=True, null=True, verbose_name='Observações')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('update_at', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='budget_movements_created', to=settings.AUTH_USER_MODEL, verbose_name='Criado por')),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incoming_movements', to='budget.budget', verbose_name='Destino')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outgoing_movements', to='budget.budget', verbose_name='Origem')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='budget_movements_updated', to=settings.AUTH_USER_MODEL, verbose_name='Atualizado por')),
            ],
            options={
                'verbose_name': 'Movimentação',
                'verbose_name_plural': 'Movimentações',
                'ordering': ['-movement_date'],
            },
        ),
    ]
