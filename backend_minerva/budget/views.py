from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db import IntegrityError
import logging

from .models import Budget, BudgetMovement
from .serializers import BudgetSerializer, BudgetMovementSerializer
from .utils.messages import BUDGET_MSGS, BUDGET_MOVEMENT_MSGS
from center.models import Management_Center
from center.serializers import ManagementCenterSerializer


# Budget Views
class BudgetListView(generics.ListAPIView):
    queryset = Budget.objects.select_related('management_center', 'created_by', 'updated_by')
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['year', 'category', 'management_center__name']
    ordering_fields = ['year', 'category', 'total_amount', 'management_center__name', 'created_at', 'updated_at']
    ordering = ['-created_at']


class BudgetCreateView(generics.CreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"Budget creation attempt with data: {request.data}")
        
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Budget creation validation errors: {serializer.errors}")
                return Response({
                    'error': 'Dados inválidos fornecidos',
                    'validation_errors': serializer.errors,
                    'message': 'Por favor, verifique os dados e tente novamente.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            self.perform_create(serializer)
            logger.info(f"Budget created successfully with ID: {serializer.data.get('id')}")
            
            return Response({
                'message': BUDGET_MSGS['success_created'],
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except IntegrityError as e:
            logger.error(f"Database integrity error during budget creation: {str(e)}")
            return Response({
                'error': 'Erro de integridade dos dados',
                'message': 'Já existe um orçamento com essas características. Verifique ano, categoria e centro gestor.',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Unexpected error during budget creation: {str(e)}")
            return Response({
                'error': 'Erro interno do servidor',
                'message': 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BudgetDetailView(generics.RetrieveAPIView):
    queryset = Budget.objects.select_related('management_center', 'created_by', 'updated_by')
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    
    def get_object(self):
        logger = logging.getLogger(__name__)
        pk = self.kwargs.get('pk')
        logger.info(f"Trying to retrieve budget with ID: {pk}")
        
        try:
            obj = super().get_object()
            logger.info(f"Budget found: {obj}")
            return obj
        except Exception as e:
            logger.error(f"Budget with ID {pk} not found: {str(e)}")
            all_budgets = Budget.objects.all()
            logger.info(f"Available budgets: {[budget.id for budget in all_budgets]}")
            raise


class BudgetUpdateView(generics.UpdateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.info(f"Budget update attempt with data: {request.data}")
        
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            
            if not serializer.is_valid():
                logger.error(f"Budget update validation errors: {serializer.errors}")
                return Response({
                    'error': 'Dados inválidos fornecidos',
                    'validation_errors': serializer.errors,
                    'message': 'Por favor, verifique os dados e tente novamente.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            self.perform_update(serializer)
            logger.info(f"Budget updated successfully with ID: {instance.id}")
            
            return Response({
                'message': BUDGET_MSGS['success_updated'],
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except IntegrityError as e:
            logger.error(f"Database integrity error during budget update: {str(e)}")
            return Response({
                'error': 'Erro de integridade dos dados',
                'message': 'Já existe um orçamento com essas características. Verifique ano, categoria e centro gestor.',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Unexpected error during budget update: {str(e)}")
            return Response({
                'error': 'Erro interno do servidor',
                'message': 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BudgetDeleteView(generics.DestroyAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': BUDGET_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)


# Budget Movement Views
class BudgetMovementListView(generics.ListAPIView):
    queryset = BudgetMovement.objects.select_related('source', 'destination', 'created_by', 'updated_by')
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['notes']
    ordering_fields = ['amount', 'movement_date', 'created_at', 'updated_at']
    ordering = ['-created_at']


class BudgetMovementCreateView(generics.CreateAPIView):
    queryset = BudgetMovement.objects.all()
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': BUDGET_MOVEMENT_MSGS['success_created'],
            'data': response.data
        }
        return response


class BudgetMovementDetailView(generics.RetrieveAPIView):
    queryset = BudgetMovement.objects.all()
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class BudgetMovementUpdateView(generics.UpdateAPIView):
    queryset = BudgetMovement.objects.all()
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': BUDGET_MOVEMENT_MSGS['success_updated'],
            'data': response.data
        }
        return response


class BudgetMovementDeleteView(generics.DestroyAPIView):
    queryset = BudgetMovement.objects.all()
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': BUDGET_MOVEMENT_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)


# Utility API for Budget Forms
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def budget_form_metadata(request):
    """
    API endpoint to provide metadata for budget forms including available management centers.
    This endpoint helps populate dropdown fields in frontend forms.
    """
    try:
        # Get all active management centers
        management_centers = Management_Center.objects.all().order_by('name')
        centers_serializer = ManagementCenterSerializer(management_centers, many=True)
        
        # Budget categories choices
        budget_categories = Budget.BUDGET_CLASSES
        
        # Budget status choices  
        budget_status = Budget.STATUS
        
        metadata = {
            'management_centers': centers_serializer.data,
            'budget_categories': [{'value': choice[0], 'label': choice[1]} for choice in budget_categories],
            'budget_status_choices': [{'value': choice[0], 'label': choice[1]} for choice in budget_status],
            'message': 'Metadata para formulário de orçamento carregada com sucesso.'
        }
        
        return Response(metadata, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': 'Erro ao carregar metadata do formulário', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
