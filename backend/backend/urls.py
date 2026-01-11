from django.contrib import admin
from django.urls import path
from api.views import RegisterView, LoginView, LogoutView, StatusView, ItemsView, QuizItemsView, RateItemView, StatsView, CreateStatsShareView, SharedStatsView

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/status/", StatusView.as_view(), name="status"),
    path("api/items/quiz/<str:category>/", QuizItemsView.as_view(), name="quiz"),
    path("api/items/rate/", RateItemView.as_view(), name="rate_item"),
    path("api/items/<str:category>/", ItemsView.as_view(), name="items"),
    path("api/stats/<str:category>/", StatsView.as_view(), name="stats"),
    path("api/stats/share/get/<str:share_id>/", SharedStatsView.as_view()),
    path("api/stats/share/<str:category>/", CreateStatsShareView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
