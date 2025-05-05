from django.urls import path
from .views import *

urlpatterns = [
    # DIRECTIONS
    path('directions/', DirectionListView.as_view(), name='direction-list'),
    path('directions/create/', DirectionCreateView.as_view(), name='direction-create'),
    path('directions/<int:pk>/', DirectionDetailView.as_view(), name='direction-detail'),
    path('directions/<int:pk>/update/', DirectionUpdateView.as_view(), name='direction-update'),
    path('directions/<int:pk>/delete/', DirectionDeleteView.as_view(), name='direction-delete'),

    # MANAGEMENTS
    path('managements/', ManagementListView.as_view(), name='management-list'),
    path('managements/create/', ManagementCreateView.as_view(), name='management-create'),
    path('managements/<int:pk>/', ManagementDetailView.as_view(), name='management-detail'),
    path('managements/<int:pk>/update/', ManagementUpdateView.as_view(), name='management-update'),
    path('managements/<int:pk>/delete/', ManagementDeleteView.as_view(), name='management-delete'),

    # COORDINATIONS
    path('coordinations/', CoordinationListView.as_view(), name='coordination-list'),
    path('coordinations/create/', CoordinationCreateView.as_view(), name='coordination-create'),
    path('coordinations/<int:pk>/', CoordinationDetailView.as_view(), name='coordination-detail'),
    path('coordinations/<int:pk>/update/', CoordinationUpdateView.as_view(), name='coordination-update'),
    path('coordinations/<int:pk>/delete/', CoordinationDeleteView.as_view(), name='coordination-delete'),
]
