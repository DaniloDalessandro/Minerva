from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    ChangePasswordSerializer,
    ProfileUpdateSerializer,
    UserSerializer
)

from .utils.messages import (
    LOGIN_MESSAGES,
    LOGOUT_MESSAGES,
    REGISTER_MESSAGES,
    PASSWORD_RESET_MESSAGES,
    PASSWORD_CONFIRM_MESSAGES,
    CHANGE_PASSWORD_MESSAGES,
    PROFILE_MESSAGES
)

User = get_user_model()

# -------------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response({
                'message': LOGIN_MESSAGES['success'],
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })

            # Tempo de expiração
            access_exp = 60 * 60  # 1 hora
            refresh_exp = 60 * 60 * 24 * 7  # 7 dias

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                max_age=access_exp,
                samesite="Lax",
                secure=False  # Em produção: secure=True com HTTPS
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                max_age=refresh_exp,
                samesite="Lax",
                secure=False
            )

            return response

        return Response({'error': LOGIN_MESSAGES['invalid_credentials']}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response({'message': LOGOUT_MESSAGES['success']})

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response


# -------------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                'message': REGISTER_MESSAGES['success'],
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)

        if 'email' in serializer.errors:
            return Response({'error': REGISTER_MESSAGES['email_exists']}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                User.objects.get(email=email)
                # Aqui seria o envio do e-mail com token
                return Response({'message': PASSWORD_RESET_MESSAGES['email_sent']})
            except User.DoesNotExist:
                return Response({'error': PASSWORD_RESET_MESSAGES['email_not_found']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(serializer.validated_data['uidb64']).decode()
                user = User.objects.get(pk=uid)
                if default_token_generator.check_token(user, serializer.validated_data['token']):
                    user.set_password(serializer.validated_data['password'])
                    user.save()
                    return Response({'message': PASSWORD_CONFIRM_MESSAGES['success']})
                else:
                    return Response({'error': PASSWORD_CONFIRM_MESSAGES['invalid_token']}, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({'error': PASSWORD_CONFIRM_MESSAGES['invalid_token']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'error': CHANGE_PASSWORD_MESSAGES['wrong_old_password']}, status=400)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': CHANGE_PASSWORD_MESSAGES['success']})
        return Response(serializer.errors, status=400)

# -------------------------------
class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = ProfileUpdateSerializer(instance=request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': PROFILE_MESSAGES['update_success'], 'user': serializer.data})
        return Response({'error': PROFILE_MESSAGES['update_error'], 'details': serializer.errors}, status=400)


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    

#=========================================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
