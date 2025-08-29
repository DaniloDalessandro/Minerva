# Generated manually for ai_assistant

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ConversationSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.CharField(max_length=100, unique=True, verbose_name='ID da Sessão')),
                ('title', models.CharField(blank=True, max_length=200, verbose_name='Título da Conversa')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Atualizado em')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativa')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alice_sessions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Sessão de Conversa',
                'verbose_name_plural': 'Sessões de Conversa',
                'ordering': ['-updated_at'],
            },
        ),
        migrations.CreateModel(
            name='AliceConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=100, unique=True, verbose_name='Chave')),
                ('value', models.TextField(verbose_name='Valor')),
                ('description', models.TextField(blank=True, verbose_name='Descrição')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Configuração do Alice',
                'verbose_name_plural': 'Configurações do Alice',
                'ordering': ['key'],
            },
        ),
        migrations.CreateModel(
            name='DatabaseSchema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_name', models.CharField(max_length=100, verbose_name='Nome da Tabela')),
                ('column_name', models.CharField(max_length=100, verbose_name='Nome da Coluna')),
                ('data_type', models.CharField(max_length=50, verbose_name='Tipo de Dados')),
                ('is_nullable', models.BooleanField(default=True, verbose_name='Permite Null')),
                ('column_default', models.TextField(blank=True, null=True, verbose_name='Valor Padrão')),
                ('column_description', models.TextField(blank=True, verbose_name='Descrição da Coluna')),
                ('business_meaning', models.TextField(blank=True, verbose_name='Significado de Negócio')),
                ('sample_values', models.JSONField(blank=True, default=list, verbose_name='Valores de Exemplo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Esquema do Banco',
                'verbose_name_plural': 'Esquemas do Banco',
                'ordering': ['table_name', 'column_name'],
                'unique_together': {('table_name', 'column_name')},
            },
        ),
        migrations.CreateModel(
            name='QueryLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_question', models.TextField(verbose_name='Pergunta do Usuário')),
                ('interpreted_intent', models.TextField(verbose_name='Intenção Interpretada')),
                ('generated_sql', models.TextField(verbose_name='SQL Gerado')),
                ('execution_status', models.CharField(choices=[('SUCCESS', 'Sucesso'), ('ERROR', 'Erro'), ('PENDING', 'Pendente')], max_length=10)),
                ('execution_time_ms', models.IntegerField(blank=True, null=True, verbose_name='Tempo de Execução (ms)')),
                ('result_count', models.IntegerField(blank=True, null=True, verbose_name='Quantidade de Resultados')),
                ('error_message', models.TextField(blank=True, verbose_name='Mensagem de Erro')),
                ('gemini_response', models.JSONField(blank=True, default=dict, verbose_name='Resposta do Gemini')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='queries', to='ai_assistant.conversationsession')),
            ],
            options={
                'verbose_name': 'Log de Consulta',
                'verbose_name_plural': 'Logs de Consultas',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ConversationMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_type', models.CharField(choices=[('USER', 'Usuário'), ('ASSISTANT', 'Alice'), ('SYSTEM', 'Sistema'), ('ERROR', 'Erro')], max_length=10)),
                ('content', models.TextField(verbose_name='Conteúdo')),
                ('metadata', models.JSONField(blank=True, default=dict, verbose_name='Metadados')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='ai_assistant.conversationsession')),
            ],
            options={
                'verbose_name': 'Mensagem',
                'verbose_name_plural': 'Mensagens',
                'ordering': ['created_at'],
            },
        ),
    ]