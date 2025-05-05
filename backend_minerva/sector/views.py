from .models import Direction,Management,Coordination
from .serializers import DirectionSerializer,ManagementSerializer,CoordinationSerializer
from rest_framework import generics, permissions

class DirectionListView(generics.ListAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer

class DirectionCreateView(generics.CreateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [permissions.IsAuthenticated]  # Garante que só usuários autenticados possam criar

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )
class DirectionDetailView(generics.RetrieveAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

class DirectionUpdateView(generics.UpdateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

class DirectionDeleteView(generics.DestroyAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    lookup_field = 'pk'

#===========================================================================

class ManagementListView(generics.ListAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer

class ManagementCreateView(generics.CreateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer

class ManagementDetailView(generics.RetrieveAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

class ManagementUpdateView(generics.UpdateAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

class ManagementDeleteView(generics.DestroyAPIView):
    queryset = Management.objects.all()
    serializer_class = ManagementSerializer
    lookup_field = 'pk'

#===========================================================================

class CoordinationListView(generics.ListAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer

class CoordinationCreateView(generics.CreateAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer

class CoordinationDetailView(generics.RetrieveAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'

class CoordinationUpdateView(generics.UpdateAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'

class CoordinationDeleteView(generics.DestroyAPIView):
    queryset = Coordination.objects.all()
    serializer_class = CoordinationSerializer
    lookup_field = 'pk'