from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Assistance
from .serializers import AidSerializer
from .utils.exceptions import AidNotFound
from .utils.messages import AID_MESSAGES



class AidListAPIView(generics.ListAPIView):
    queryset = Assistance.objects.all()
    serializer_class = AidSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]



class AidCreateAPIView(generics.CreateAPIView):
    queryset = Assistance.objects.all()
    serializer_class = AidSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            'message': AID_MESSAGES['success_created'],
            'data': response.data
        }
        return response



class AidRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Assistance.objects.all()
    serializer_class = AidSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_object(self):
        try:
            return Assistance.objects.get(pk=self.kwargs['pk'])
        except Assistance.DoesNotExist:
            raise AidNotFound



class AidUpdateAPIView(generics.UpdateAPIView):
    queryset = Assistance.objects.all()
    serializer_class = AidSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = {
            'message': AID_MESSAGES['success_updated'],
            'data': response.data
        }
        return response



class AidDestroyAPIView(generics.DestroyAPIView):
    queryset = Assistance.objects.all()
    serializer_class = AidSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': AID_MESSAGES['success_deleted']}, status=status.HTTP_204_NO_CONTENT)
