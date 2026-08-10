import uuid

from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel
from apps.courses.models import Course

from ..choices import EnrollmentStatus
from ..constants import (
    DEFAULT_CERTIFICATE_ISSUED,
    DEFAULT_ENROLLMENT_ACTIVE,
)
from ..managers import EnrollmentManager


class Enrollment(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    status = models.CharField(
        max_length=20,
        choices=EnrollmentStatus.choices,
        default=EnrollmentStatus.ACTIVE,
        db_index=True,
    )

    enrolled_at = models.DateTimeField(
        auto_now_add=True,
    )

    started_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    expires_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    last_accessed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    certificate_issued = models.BooleanField(
        default=DEFAULT_CERTIFICATE_ISSUED,
        db_index=True,
    )

    is_active = models.BooleanField(
        default=DEFAULT_ENROLLMENT_ACTIVE,
        db_index=True,
    )

    objects = EnrollmentManager()

    class Meta:
        ordering = [
            "-enrolled_at",
        ]

        verbose_name = "Enrollment"
        verbose_name_plural = "Enrollments"

        indexes = [
            models.Index(
                fields=[
                    "student",
                ]
            ),
            models.Index(
                fields=[
                    "course",
                ]
            ),
            models.Index(
                fields=[
                    "student",
                    "course",
                ]
            ),
            models.Index(
                fields=[
                    "status",
                ]
            ),
            models.Index(
                fields=[
                    "is_active",
                ]
            ),
            models.Index(
                fields=[
                    "enrolled_at",
                ]
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "student",
                    "course",
                ],
                name="unique_student_course_enrollment",
            ),
        ]

    @property
    def is_completed(self):
        return (
            self.status
            == EnrollmentStatus.COMPLETED
        )

    @property
    def can_access(self):
        return (
            self.is_active
            and self.status
            == EnrollmentStatus.ACTIVE
        )

    def __str__(self):
        return (
            f"{self.student.email} → "
            f"{self.course.title}"
        )