from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('budget', '0002_alter_budget_total_amount_and_more'),
        ('budget', '0004_ensure_updated_at_field'),
    ]

    operations = [
        # Esta migração resolve os conflitos entre as branches
    ]