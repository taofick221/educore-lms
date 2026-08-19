from django.urls import path

from .views import (
    CertificateDetailAPIView,
    CertificateListAPIView,
)


urlpatterns = [
    path(
        "",
        CertificateListAPIView.as_view(),
        name="certificate-list",
    ),
    path(
        "<uuid:id>/",
        CertificateDetailAPIView.as_view(),
        name="certificate-detail",
    ),
]