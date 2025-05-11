from django.core.exceptions import ValidationError
import datetime

def validate_year(value):
    current_year = datetime.datetime.now().year
    if value < current_year:
        raise ValidationError(f'O ano {value} não pode ser anterior ao ano atual {current_year}.')