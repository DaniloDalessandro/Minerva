from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser,DjangoModelPermissions,IsAuthenticated
from .utils.messages import CENTRO_GESTOR_MSGS,CENTRO_SOLICITANTE_MSGS
from .models import CentroDeCustoGestor,CentroDeCustoSolicitante
from .serializers import CentroDeCustoGestorSerializer,CentroDeCustoSolicitanteSerializer

# Create your views here.
class CentroGestorListView(generics.ListAPIView):
    queryset = CentroDeCustoGestor.objects.all()
    serializer_class = CentroDeCustoGestorSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CentroGestorCreateView(generics.CreateAPIView):
    queryset = CentroDeCustoGestor.objects.all()
    serializer_class = CentroDeCustoGestorSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': CENTRO_GESTOR_MSGS['success_created'],
            'data': response.data
        }
        return response


class CentroGestorDetailView(generics.RetrieveAPIView):
    queryset = CentroDeCustoGestor.objects.all()
    serializer_class = CentroDeCustoGestorSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CentroGestorUpdateView(generics.UpdateAPIView):
    queryset = CentroDeCustoGestor.objects.all()
    serializer_class = CentroDeCustoGestorSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': CENTRO_GESTOR_MSGS['success_updated'],
            'data': response.data
        }
        return response


class CentroGestorDeleteView(generics.DestroyAPIView):
    queryset = CentroDeCustoGestor.objects.all()
    serializer_class = CentroDeCustoGestorSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': CENTRO_GESTOR_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)


class CentroSolicitanteListView(generics.ListAPIView):
    queryset = CentroDeCustoSolicitante.objects.all()
    serializer_class = CentroDeCustoSolicitanteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CentroSolicitanteCreateView(generics.CreateAPIView):
    queryset = CentroDeCustoSolicitante.objects.all()
    serializer_class = CentroDeCustoSolicitanteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': CENTRO_SOLICITANTE_MSGS['success_created'],
            'data': response.data
        }
        return response


class CentroSolicitanteDetailView(generics.RetrieveAPIView):
    queryset = CentroDeCustoSolicitante.objects.all()
    serializer_class = CentroDeCustoSolicitanteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]


class CentroSolicitanteUpdateView(generics.UpdateAPIView):
    queryset = CentroDeCustoSolicitante.objects.all()
    serializer_class = CentroDeCustoSolicitanteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': CENTRO_SOLICITANTE_MSGS['success_updated'],
            'data': response.data
        }
        return response


class CentroSolicitanteDeleteView(generics.DestroyAPIView):
    queryset = CentroDeCustoSolicitante.objects.all()
    serializer_class = CentroDeCustoSolicitanteSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': CENTRO_SOLICITANTE_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)
