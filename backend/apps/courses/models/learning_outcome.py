import uuid

from django.db import models

from apps.common.models import TimeStampedModel

from ..constants import MAX_LEARNING_OUTCOME_LENGTH
from .course import Course


class LearningOutcome(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="learning_outcomes",
    )

    title = models.CharField(
        max_length=MAX_LEARNING_OUTCOME_LENGTH,
    )

    class Meta:
        ordering = ["id"]
        verbose_name = "Learning Outcome"
        verbose_name_plural = "Learning Outcomes"

    def __str__(self):
        return self.title