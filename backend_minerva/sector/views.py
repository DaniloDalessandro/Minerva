from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from .models import Direction, Management, Coordination
from .serializers import DirectionSerializer, ManagementSerializer, CoordinationSerializer
from .utils.messages import DIRECTION_MSGS, MANAGEMENT_MSGS, COORDINATION_MSGS


# ===================== DIREÇÕES =====================

class DirectionCreate(CreateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer

    def perform_create(self, serializer):
        serializer.save()
        return Response({'message': DIRECTION_MSGS['success_created'], 'data': serializer.data}, status=status.HTTP_201_CREATED)


class DirectionRetrieve(RetrieveAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Direction.DoesNotExist):
            return Response({'message': DIRECTION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class DirectionUpdate(UpdateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()
        return Response({'message': DIRECTION_MSGS['success_updated'], 'data': serializer.data})

    def handle_exception(self, exc):
        if isinstance(exc, Direction.DoesNotExist):
            return Response({'message': DIRECTION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class DirectionDestroy(DestroyAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        instance.delete()
        return Response({'message': DIRECTION_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)

    def handle_exception(self, exc):
        if isinstance(exc, Direction.DoesNotExist):
            return Response({'message': DIRECTION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


# ===================== GERÊNCIAS =====================

class ManagementCreate(CreateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer

    def perform_create(self, serializer):
        serializer.save()
        return Response({'message': MANAGEMENT_MSGS['success_created'], 'data': serializer.data}, status=status.HTTP_201_CREATED)


class ManagementRetrieve(RetrieveAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Management.DoesNotExist):
            return Response({'message': MANAGEMENT_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class ManagementUpdate(UpdateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()
        return Response({'message': MANAGEMENT_MSGS['success_updated'], 'data': serializer.data})

    def handle_exception(self, exc):
        if isinstance(exc, Management.DoesNotExist):
            return Response({'message': MANAGEMENT_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class ManagementDestroy(DestroyAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        instance.delete()
        return Response({'message': MANAGEMENT_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)

    def handle_exception(self, exc):
        if isinstance(exc, Management.DoesNotExist):
            return Response({'message': MANAGEMENT_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


# ===================== COORDENAÇÕES =====================

class CoordinationCreate(CreateAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer

    def perform_create(self, serializer):
        serializer.save()
        return Response({'message': COORDINATION_MSGS['success_created'], 'data': serializer.data}, status=status.HTTP_201_CREATED)


class CoordinationRetrieve(RetrieveAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def handle_exception(self, exc):
        if isinstance(exc, Coordination.DoesNotExist):
            return Response({'message': COORDINATION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class CoordinationUpdate(UpdateAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()
        return Response({'message': COORDINATION_MSGS['success_updated'], 'data': serializer.data})

    def handle_exception(self, exc):
        if isinstance(exc, Coordination.DoesNotExist):
            return Response({'message': COORDINATION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)


class CoordinationDestroy(DestroyAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        instance.delete()
        return Response({'message': COORDINATION_MSGS['success_deleted']}, status=status.HTTP_204_NO_CONTENT)

    def handle_exception(self, exc):
        if isinstance(exc, Coordination.DoesNotExist):
            return Response({'message': COORDINATION_MSGS['error_not_found']}, status=status.HTTP_404_NOT_FOUND)
        return super().handle_exception(exc)
