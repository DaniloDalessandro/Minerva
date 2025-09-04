from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import filters
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from django_filters.rest_framework import DjangoFilterBackend

from .models import Management_Center, Requesting_Center
from .serializers import ManagementCenterSerializer, RequestingCenterSerializer
from .utils.messages import CENTRO_GESTOR_MSGS, CENTRO_SOLICITANTE_MSGS


def format_validation_errors(errors):
    """
    Format validation errors in a Zod-like structure for consistent frontend handling
    """
    formatted_errors = {}
    
    for field, field_errors in errors.items():
        if isinstance(field_errors, list):
            # Handle simple list of error messages
            formatted_errors[field] = {
                'field': field,
                'code': 'validation_error',
                'message': field_errors[0] if field_errors else 'Erro de validação'
            }
        elif isinstance(field_errors, dict):
            # Handle structured error dict
            formatted_errors[field] = field_errors
        else:
            # Handle string error
            formatted_errors[field] = {
                'field': field,
                'code': 'validation_error',
                'message': str(field_errors)
            }
    
    return formatted_errors


# --------------------------------------------------------------------------------------------------------------------
# Management Center (antes CentroDeCustoGestor)
# --------------------------------------------------------------------------------------------------------------------

class ManagementCenterListView(generics.ListAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']


class ManagementCenterCreateView(generics.CreateAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            resp = super().create(request, *args, **kwargs)
            resp.data = {
                'success': True,
                'message': CENTRO_GESTOR_MSGS['success_created'],
                'data': resp.data
            }
            return resp
        except ValidationError as e:
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(e.detail)
            }, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            errors = e.message_dict if hasattr(e, 'message_dict') else {'non_field_errors': [str(e)]}
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(errors)
            }, status=status.HTTP_400_BAD_REQUEST)


class ManagementCenterDetailView(generics.RetrieveAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class ManagementCenterUpdateView(generics.UpdateAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        try:
            resp = super().update(request, *args, **kwargs)
            resp.data = {
                'success': True,
                'message': CENTRO_GESTOR_MSGS['success_updated'],
                'data': resp.data
            }
            return resp
        except ValidationError as e:
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(e.detail)
            }, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            errors = e.message_dict if hasattr(e, 'message_dict') else {'non_field_errors': [str(e)]}
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(errors)
            }, status=status.HTTP_400_BAD_REQUEST)


class ManagementCenterDeleteView(generics.DestroyAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': CENTRO_GESTOR_MSGS['success_deleted']},
            status=status.HTTP_204_NO_CONTENT
        )


# --------------------------------------------------------------------------------------------------------------------
# Requesting Center (antes CentroDeCustoSolicitante)
# --------------------------------------------------------------------------------------------------------------------

class RequestingCenterListView(generics.ListAPIView):
    queryset = Requesting_Center.objects.select_related('management_center')
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'management_center__name']
    ordering_fields = ['name', 'created_at', 'updated_at', 'management_center__name']
    ordering = ['-created_at']


class RequestingCenterCreateView(generics.CreateAPIView):
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            resp = super().create(request, *args, **kwargs)
            resp.data = {
                'success': True,
                'message': CENTRO_SOLICITANTE_MSGS['success_created'],
                'data': resp.data
            }
            return resp
        except ValidationError as e:
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(e.detail)
            }, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            errors = e.message_dict if hasattr(e, 'message_dict') else {'non_field_errors': [str(e)]}
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(errors)
            }, status=status.HTTP_400_BAD_REQUEST)


class RequestingCenterDetailView(generics.RetrieveAPIView):
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class RequestingCenterUpdateView(generics.UpdateAPIView):
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        try:
            resp = super().update(request, *args, **kwargs)
            resp.data = {
                'success': True,
                'message': CENTRO_SOLICITANTE_MSGS['success_updated'],
                'data': resp.data
            }
            return resp
        except ValidationError as e:
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(e.detail)
            }, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            errors = e.message_dict if hasattr(e, 'message_dict') else {'non_field_errors': [str(e)]}
            return Response({
                'success': False,
                'message': 'Erro de validação',
                'errors': format_validation_errors(errors)
            }, status=status.HTTP_400_BAD_REQUEST)


class RequestingCenterDeleteView(generics.DestroyAPIView):
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': CENTRO_SOLICITANTE_MSGS['success_deleted']},
            status=status.HTTP_204_NO_CONTENT
        )
