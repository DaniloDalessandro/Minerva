from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Management_Center, Requesting_Center
from .serializers import ManagementCenterSerializer, RequestingCenterSerializer
from .utils.messages import CENTRO_GESTOR_MSGS, CENTRO_SOLICITANTE_MSGS


# --------------------------------------------------------------------------------------------------------------------
# Management Center (antes CentroDeCustoGestor)
# --------------------------------------------------------------------------------------------------------------------

class ManagementCenterListView(generics.ListAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class ManagementCenterCreateView(generics.CreateAPIView):
    queryset = Management_Center.objects.all()
    serializer_class = ManagementCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        resp = super().create(request, *args, **kwargs)
        resp.data = {
            'message': CENTRO_GESTOR_MSGS['success_created'],
            'data': resp.data
        }
        return resp


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
        resp = super().update(request, *args, **kwargs)
        resp.data = {
            'message': CENTRO_GESTOR_MSGS['success_updated'],
            'data': resp.data
        }
        return resp


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
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class RequestingCenterCreateView(generics.CreateAPIView):
    queryset = Requesting_Center.objects.all()
    serializer_class = RequestingCenterSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        resp = super().create(request, *args, **kwargs)
        resp.data = {
            'message': CENTRO_SOLICITANTE_MSGS['success_created'],
            'data': resp.data
        }
        return resp


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
        resp = super().update(request, *args, **kwargs)
        resp.data = {
            'message': CENTRO_SOLICITANTE_MSGS['success_updated'],
            'data': resp.data
        }
        return resp


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
