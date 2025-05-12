from django.core.exceptions import ValidationError

def validate_name(value):
    if not value.isalpha():
        raise ValidationError('O nome deve conter apenas letras.')
    if len(value) < 3:
        raise ValidationError('O nome deve ter pelo menos 3 caracteres.')