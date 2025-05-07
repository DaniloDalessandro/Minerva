from django.urls import path
from . import views

urlpatterns = [
    # Direções
    path('directions/', views.DirectionCreate.as_view(), name='direction-create'),
    path('directions/<int:pk>/', views.DirectionRetrieve.as_view(), name='direction-retrieve'),
    path('directions/update/<int:pk>/', views.DirectionUpdate.as_view(), name='direction-update'),
    path('directions/delete/<int:pk>/', views.DirectionDestroy.as_view(), name='direction-destroy'),

    # Gerências
    path('managements/', views.ManagementCreate.as_view(), name='management-create'),
    path('managements/<int:pk>/', views.ManagementRetrieve.as_view(), name='management-retrieve'),
    path('managements/update/<int:pk>/', views.ManagementUpdate.as_view(), name='management-update'),
    path('managements/delete/<int:pk>/', views.ManagementDestroy.as_view(), name='management-destroy'),

    # Coordenações
    path('coordinations/', views.CoordinationCreate.as_view(), name='coordination-create'),
    path('coordinations/<int:pk>/', views.CoordinationRetrieve.as_view(), name='coordination-retrieve'),
    path('coordinations/update/<int:pk>/', views.CoordinationUpdate.as_view(), name='coordination-update'),
    path('coordinations/delete/<int:pk>/', views.CoordinationDestroy.as_view(), name='coordination-destroy'),
]
