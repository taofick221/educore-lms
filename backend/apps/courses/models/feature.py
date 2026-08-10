import uuid

from django.db import models

from apps.common.models import TimeStampedModel

from ..constants import MAX_FEATURE_LENGTH
from .course import Course


class CourseFeature(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="features",
    )

    title = models.CharField(
        max_length=MAX_FEATURE_LENGTH,
    )

    class Meta:
        ordering = ["id"]
        verbose_name = "Course Feature"
        verbose_name_plural = "Course Features"

    def __str__(self):
        return self.title