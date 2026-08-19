from rest_framework import generics, permissions

from .models import Certificate
from .serializers import CertificateSerializer


class CertificateListAPIView(
    generics.ListAPIView,
):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    serializer_class = CertificateSerializer

    def get_queryset(self):
        return (
            Certificate.objects
            .filter(
                enrollment__student=self.request.user,
            )
            .select_related(
                "enrollment",
                "enrollment__student",
                "enrollment__course",
            )
        )


class CertificateDetailAPIView(
    generics.RetrieveAPIView,
):
    permission_classes = (
        permissions.IsAuthenticated,
    )

    serializer_class = CertificateSerializer

    lookup_field = "id"

    def get_queryset(self):
        return (
            Certificate.objects
            .filter(
                enrollment__student=self.request.user,
            )
            .select_related(
                "enrollment",
                "enrollment__student",
                "enrollment__course",
            )
        )