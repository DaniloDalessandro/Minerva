from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0003_remove_employeeaidpayment_employee_aid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='status',
            field=models.CharField(choices=[('ATIVO', 'Ativo'), ('INATIVO', 'Inativo'), ('FERIAS', 'Férias'), ('AFASTADO', 'Afastado')], default='ATIVO', max_length=8),
        ),
    ]
