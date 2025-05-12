from django.urls import path
from .views import (
    BudgetListView, BudgetCreateView, BudgetDetailView,
    BudgetUpdateView, BudgetDeleteView,
    BudgetMovementListView, BudgetMovementCreateView,
    BudgetMovementDetailView, BudgetMovementUpdateView,
    BudgetMovementDeleteView
)

urlpatterns = [
    # Budget URLs
    path('budgets/', BudgetListView.as_view(), name='budget-list'),
    path('budgets/create/', BudgetCreateView.as_view(), name='budget-create'),
    path('budgets/<int:pk>/', BudgetDetailView.as_view(), name='budget-detail'),
    path('budgets/<int:pk>/update/', BudgetUpdateView.as_view(), name='budget-update'),
    path('budgets/<int:pk>/delete/', BudgetDeleteView.as_view(), name='budget-delete'),

    # Budget Movement URLs
    path('movements/', BudgetMovementListView.as_view(), name='movement-list'),
    path('movements/create/', BudgetMovementCreateView.as_view(), name='movement-create'),
    path('movements/<int:pk>/', BudgetMovementDetailView.as_view(), name='movement-detail'),
    path('movements/<int:pk>/update/', BudgetMovementUpdateView.as_view(), name='movement-update'),
    path('movements/<int:pk>/delete/', BudgetMovementDeleteView.as_view(), name='movement-delete'),
]
