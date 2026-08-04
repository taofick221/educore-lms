from django.contrib import admin
from django.http import JsonResponse
from django.urls import path,include


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health-check"),
    path("api/v1/", include("config.api_urls")),
]
