import uuid

from django.db import models

from apps.common.models import TimeStampedModel
from apps.courses.models import Lecture

from ..constants import (
    DEFAULT_LAST_WATCHED_SECOND,
    DEFAULT_LESSON_COMPLETED,
    DEFAULT_WATCH_PERCENTAGE,
)
from ..managers import LessonProgressManager
from .enrollment import Enrollment


class LessonProgress(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )

    lecture = models.ForeignKey(
        Lecture,
        on_delete=models.CASCADE,
        related_name="lesson_progress",
    )

    last_watched_second = models.PositiveIntegerField(
        default=DEFAULT_LAST_WATCHED_SECOND,
    )

    watch_percentage = models.PositiveSmallIntegerField(
        default=DEFAULT_WATCH_PERCENTAGE,
    )

    is_completed = models.BooleanField(
        default=DEFAULT_LESSON_COMPLETED,
        db_index=True,
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    objects = LessonProgressManager()

    class Meta:
        ordering = [
            "-updated_at",
        ]

        verbose_name = "Lesson Progress"
        verbose_name_plural = "Lesson Progress"

        indexes = [
            models.Index(
                fields=[
                    "enrollment",
                ],
            ),
            models.Index(
                fields=[
                    "lecture",
                ],
            ),
            models.Index(
                fields=[
                    "is_completed",
                ],
            ),
            models.Index(
                fields=[
                    "watch_percentage",
                ],
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "enrollment",
                    "lecture",
                ],
                name="unique_enrollment_lecture_progress",
            ),

            models.CheckConstraint(
                check=(
                    models.Q(
                        watch_percentage__gte=0,
                    )
                    & models.Q(
                        watch_percentage__lte=100,
                    )
                ),
                name="valid_watch_percentage",
            ),

            models.CheckConstraint(
                check=models.Q(
                    last_watched_second__gte=0,
                ),
                name="valid_last_watched_second",
            ),
        ]

    @property
    def is_finished(self):
        """
        Returns True when the lesson is completed.
        """
        return self.is_completed or self.watch_percentage >= 100

    def __str__(self):
        return (
            f"{self.enrollment.student} - "
            f"{self.lecture.title}"
        )