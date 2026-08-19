import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel
from apps.enrollments.models import Enrollment


class Certificate(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="certificate",
    )

    certificate_number = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    issued_at = models.DateTimeField(
        auto_now_add=True,
    )

    verification_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        db_index=True,
        editable=False,
    )

    class Meta:
        ordering = ["-issued_at"]
        verbose_name = "Certificate"
        verbose_name_plural = "Certificates"

        indexes = [
            models.Index(fields=["issued_at"]),
        ]

    @property
    def student(self):
        return self.enrollment.student

    @property
    def course(self):
        return self.enrollment.course

    def __str__(self):
        return (
            f"{self.certificate_number} - "
            f"{self.enrollment.student.email}"
        )