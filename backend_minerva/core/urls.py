from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/sector/', include('sector.urls')),
    path('api/v1/employee/', include('employee.urls')),
    path('api/v1/center/', include('center.urls')),
    path('api/v1/budget/', include('budget.urls')),
    path('api/v1/budgetline/', include('budgetline.urls')),


]