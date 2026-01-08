from django.contrib import admin
from django.urls import path
from api.views import RegisterView, LoginView, LogoutView, StatusView 


urlpatterns = [
    path('admin/', admin.site.urls),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/status/", StatusView.as_view(), name="status"),
]
