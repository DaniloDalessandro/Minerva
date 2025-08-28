# Generated migration to ensure updated_at field consistency
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('budget', '0003_add_database_indexes'),
    ]

    operations = [
        # This is a no-op migration to ensure field consistency
        # The field rename was already handled in 0002_fix_budgetmovement_updated_at
    ]