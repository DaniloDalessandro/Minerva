from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser,DjangoModelPermissions,IsAuthenticated
from .models import Employee
from .utils.access_control import get_employee_queryset
from .serializers import EmployeeSerializer, EmployeeWriteSerializer
from .utils.messages import EMPLOYEE_MESSAGES

# Listar funcionarios - SEM FILTRO HIERARQUICO (todos podem ver todos)
class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(f"Usuario fazendo requisicao: {self.request.user.email}")
        queryset = Employee.objects.select_related('direction', 'management', 'coordination').all()
        
        # Apply status filter - show only ATIVO by default unless specified
        status_filter = self.request.query_params.get('status', 'ATIVO')
        if status_filter and status_filter != 'ALL':
            queryset = queryset.filter(status=status_filter)
        
        # Apply search filter if provided
        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(cpf__icontains=search) |
                Q(email__icontains=search) |
                Q(direction__name__icontains=search) |
                Q(management__name__icontains=search) |
                Q(coordination__name__icontains=search)
            )
        
        print(f"Total employees retornados: {queryset.count()}")
        return queryset

# Criar funcionario
class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeWriteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        instance = write_serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )
        read_serializer = EmployeeSerializer(instance)
        return Response({
            'message': EMPLOYEE_MESSAGES['created'],
            'data': read_serializer.data
        }, status=status.HTTP_201_CREATED)


# Visualizar funcionario
class EmployeeRetrieveView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

# Atualizar funcionario
class EmployeeUpdateView(generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeWriteSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        write_serializer.is_valid(raise_exception=True)
        updated_instance = write_serializer.save(updated_by=request.user)
        read_serializer = EmployeeSerializer(updated_instance)
        return Response({
            'message': EMPLOYEE_MESSAGES['updated'],
            **read_serializer.data
        })

# Inativar/Ativar funcionario
class EmployeeToggleStatusView(generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = 'INATIVO' if instance.status == 'ATIVO' else 'ATIVO'
        
        instance.status = new_status
        instance.updated_by = request.user
        instance.save()
        
        read_serializer = EmployeeSerializer(instance)
        action = 'ativado' if new_status == 'ATIVO' else 'inativado'
        
        return Response({
            'message': f'Colaborador {action} com sucesso.',
            **read_serializer.data
        })

# Excluir funcionario
class EmployeeDeleteView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({'message': EMPLOYEE_MESSAGES['deleted']}, status=status.HTTP_204_NO_CONTENT)