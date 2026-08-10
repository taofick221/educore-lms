import uuid

from django.db import models

from apps.common.models import TimeStampedModel

from ..constants import MAX_REQUIREMENT_LENGTH
from .course import Course


class Requirement(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="requirements",
    )

    title = models.CharField(
        max_length=MAX_REQUIREMENT_LENGTH,
    )

    class Meta:
        ordering = ["id"]
        verbose_name = "Requirement"
        verbose_name_plural = "Requirements"

    def __str__(self):
        return self.title