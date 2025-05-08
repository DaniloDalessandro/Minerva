from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Direction, Management, Coordination
from .serializers import DirectionSerializer, ManagementSerializer, CoordinationSerializer
from .utils.messages import DIRECTION_MSGS, MANAGEMENT_MSGS, COORDINATION_MSGS

# ========== DIREÇÃO ==========

class DirectionListView(generics.ListAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class DirectionCreateView(generics.CreateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': DIRECTION_MSGS['success_created'],
            'data': response.data
        }
        return response


class DirectionDetailView(generics.RetrieveAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class DirectionUpdateView(generics.UpdateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': DIRECTION_MSGS['success_updated'],
            'data': response.data
        }
        return response


class DirectionDeleteView(generics.DestroyAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': DIRECTION_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)

# ========== GERÊNCIA ==========

class ManagementListView(generics.ListAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class ManagementCreateView(generics.CreateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': MANAGEMENT_MSGS['success_created'],
            'data': response.data
        }
        return response


class ManagementDetailView(generics.RetrieveAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class ManagementUpdateView(generics.UpdateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': MANAGEMENT_MSGS['success_updated'],
            'data': response.data
        }
        return response


class ManagementDeleteView(generics.DestroyAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': MANAGEMENT_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)

# =============================== COORDINATION ===============================

class CoordinationListView(generics.ListAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CoordinationCreateView(generics.CreateAPIView):
    serializer_class = CoordinationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': COORDINATION_MSGS['success_created'],
            'data': response.data
        }
        return response


class CoordinationDetailView(generics.RetrieveAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CoordinationUpdateView(generics.UpdateAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': COORDINATION_MSGS['success_updated'],
            'data': response.data
        }
        return response


class CoordinationDeleteView(generics.DestroyAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': COORDINATION_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)