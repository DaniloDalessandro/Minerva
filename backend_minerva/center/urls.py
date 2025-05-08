from django.urls import path
from .views import (
    CentroGestorListView, CentroGestorCreateView, CentroGestorDetailView,
    CentroGestorUpdateView, CentroGestorDeleteView,
    CentroSolicitanteListView, CentroSolicitanteCreateView, CentroSolicitanteDetailView,
    CentroSolicitanteUpdateView, CentroSolicitanteDeleteView,
)

urlpatterns = [
    # Centro de Custo Gestor
    path('centros-gestores/', CentroGestorListView.as_view(), name='centro-gestor-list'),
    path('centros-gestores/novo/', CentroGestorCreateView.as_view(), name='centro-gestor-create'),
    path('centros-gestores/<int:pk>/', CentroGestorDetailView.as_view(), name='centro-gestor-detail'),
    path('centros-gestores/<int:pk>/editar/', CentroGestorUpdateView.as_view(), name='centro-gestor-update'),
    path('centros-gestores/<int:pk>/deletar/', CentroGestorDeleteView.as_view(), name='centro-gestor-delete'),

    # Centro de Custo Solicitante
    path('centros-solicitantes/', CentroSolicitanteListView.as_view(), name='centro-solicitante-list'),
    path('centros-solicitantes/novo/', CentroSolicitanteCreateView.as_view(), name='centro-solicitante-create'),
    path('centros-solicitantes/<int:pk>/', CentroSolicitanteDetailView.as_view(), name='centro-solicitante-detail'),
    path('centros-solicitantes/<int:pk>/editar/', CentroSolicitanteUpdateView.as_view(), name='centro-solicitante-update'),
    path('centros-solicitantes/<int:pk>/deletar/', CentroSolicitanteDeleteView.as_view(), name='centro-solicitante-delete'),
]
