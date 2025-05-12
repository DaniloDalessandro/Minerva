from rest_framework import generics, status
from rest_framework.response import Response

from .models import BudgetLine, BudgetLineMovement
from .serializers import BudgetLineSerializer, BudgetLineMovementSerializer
from .utils.message import BUDGETSLINE_MESSAGES

#=======================================================================================================
# Budget Line Views
#=======================================================================================================

class BudgetLineListAPIView(generics.ListAPIView):
    queryset = BudgetLine.objects.all()
    serializer_class = BudgetLineSerializer


class BudgetLineCreateAPIView(generics.CreateAPIView):
    queryset = BudgetLine.objects.all()
    serializer_class = BudgetLineSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            created_by=user if user.is_authenticated else None,
            updated_by=user if user.is_authenticated else None
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': BUDGETSLINE_MESSAGES['CREATE_SUCCESS'],
            'data': response.data
        }
        return response


class BudgetLineRetrieveAPIView(generics.RetrieveAPIView):
    queryset = BudgetLine.objects.all()
    serializer_class = BudgetLineSerializer


class BudgetLineUpdateAPIView(generics.UpdateAPIView):
    queryset = BudgetLine.objects.all()
    serializer_class = BudgetLineSerializer

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': BUDGETSLINE_MESSAGES['UPDATE_SUCCESS'],
            'data': response.data
        }
        return response


class BudgetLineDestroyAPIView(generics.DestroyAPIView):
    queryset = BudgetLine.objects.all()
    serializer_class = BudgetLineSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': BUDGETSLINE_MESSAGES['DELETE_SUCCESS']},
            status=status.HTTP_204_NO_CONTENT
        )

    def perform_destroy(self, instance):
        instance.delete()

#=======================================================================================================
# Budget Line Movement Views
#=======================================================================================================

class BudgetLineMovementListAPIView(generics.ListAPIView):
    queryset = BudgetLineMovement.objects.all()
    serializer_class = BudgetLineMovementSerializer


class BudgetLineMovementCreateAPIView(generics.CreateAPIView):
    queryset = BudgetLineMovement.objects.all()
    serializer_class = BudgetLineMovementSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            created_by=user if user.is_authenticated else None,
            updated_by=user if user.is_authenticated else None
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': BUDGETSLINE_MESSAGES['CREATE_SUCCESS'],
            'data': response.data
        }
        return response


class BudgetLineMovementRetrieveAPIView(generics.RetrieveAPIView):
    queryset = BudgetLineMovement.objects.all()
    serializer_class = BudgetLineMovementSerializer


class BudgetLineMovementUpdateAPIView(generics.UpdateAPIView):
    queryset = BudgetLineMovement.objects.all()
    serializer_class = BudgetLineMovementSerializer

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': BUDGETSLINE_MESSAGES['UPDATE_SUCCESS'],
            'data': response.data
        }
        return response


class BudgetLineMovementDestroyAPIView(generics.DestroyAPIView):
    queryset = BudgetLineMovement.objects.all()
    serializer_class = BudgetLineMovementSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': BUDGETSLINE_MESSAGES['DELETE_SUCCESS']},
            status=status.HTTP_204_NO_CONTENT
        )

    def perform_destroy(self, instance):
        instance.delete()
