from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Budget, BudgetMovement
from .serializers import BudgetSerializer, BudgetMovementSerializer
from .utils.messages import BUDGET_MSGS, BUDGET_MOVEMENT_MSGS


# Budget Views
class BudgetListView(generics.ListAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class BudgetCreateView(generics.CreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': BUDGET_MSGS['success_created'],
            'data': response.data
        }
        return response


class BudgetDetailView(generics.RetrieveAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class BudgetUpdateView(generics.UpdateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': BUDGET_MSGS['success_updated'],
            'data': response.data
        }
        return response


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
    queryset = BudgetMovement.objects.all()
    serializer_class = BudgetMovementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


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
