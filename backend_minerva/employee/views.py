from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser,DjangoModelPermissions,IsAuthenticated
from .models import Employee
from .serializers import EmployeeSerializer
from .utils.messages import EMPLOYEE_MESSAGES

# Listar funcionários
class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

# Criar funcionário
class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['message'] = EMPLOYEE_MESSAGES['created']
        return response

# Visualizar funcionário
class EmployeeRetrieveView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

# Atualizar funcionário
class EmployeeUpdateView(generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data['message'] = EMPLOYEE_MESSAGES['updated']
        return response

# Excluir funcionário
class EmployeeDeleteView(generics.DestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({'message': EMPLOYEE_MESSAGES['deleted']}, status=status.HTTP_204_NO_CONTENT)
