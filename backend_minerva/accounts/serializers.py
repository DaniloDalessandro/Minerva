from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .utils.messages import LOGIN_MESSAGES
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona informações extras ao token (opcional)
        token['email'] = user.email
        token['name'] = user.first_name
        token['id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Adiciona dados do usuário na resposta (além dos tokens)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'name': self.user.first_name,
        }

        return data

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError(LOGIN_MESSAGES['invalid_credentials'])

        if not user.check_password(data['password']):
            raise serializers.ValidationError(LOGIN_MESSAGES['invalid_credentials'])

        if not user.is_active:
            raise serializers.ValidationError("Usuário inativo.")  # você pode criar uma msg específica se quiser

        return {'user': user}



# -------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

# -------------------------------
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

# -------------------------------
class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

# -------------------------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

# -------------------------------
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')
        read_only_fields = ('email',)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'avatar']