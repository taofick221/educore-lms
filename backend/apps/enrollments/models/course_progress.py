import uuid

from django.db import models
from django.db.models import F

from apps.common.models import TimeStampedModel
from apps.courses.models import Lecture

from ..constants import (
    DEFAULT_COMPLETED_LECTURES,
    DEFAULT_COMPLETED_SECTIONS,
    DEFAULT_COURSE_PROGRESS,
    DEFAULT_TOTAL_LECTURES,
    DEFAULT_TOTAL_SECTIONS,
)
from ..managers import CourseProgressManager
from .enrollment import Enrollment


class CourseProgress(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="course_progress",
    )

    completed_sections = models.PositiveIntegerField(
        default=DEFAULT_COMPLETED_SECTIONS,
    )

    completed_lectures = models.PositiveIntegerField(
        default=DEFAULT_COMPLETED_LECTURES,
    )

    total_sections = models.PositiveIntegerField(
        default=DEFAULT_TOTAL_SECTIONS,
    )

    total_lectures = models.PositiveIntegerField(
        default=DEFAULT_TOTAL_LECTURES,
    )

    progress_percentage = models.PositiveSmallIntegerField(
        default=DEFAULT_COURSE_PROGRESS,
        db_index=True,
    )

    last_completed_lecture = models.ForeignKey(
        Lecture,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="course_progress_records",
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    objects = CourseProgressManager()

    class Meta:
        ordering = [
            "-updated_at",
        ]

        verbose_name = "Course Progress"
        verbose_name_plural = "Course Progress"

        indexes = [
            models.Index(
                fields=[
                    "enrollment",
                ]
            ),
            models.Index(
                fields=[
                    "progress_percentage",
                ]
            ),
            models.Index(
                fields=[
                    "completed_at",
                ]
            ),
        ]

        constraints = [
            models.CheckConstraint(
                check=models.Q(
                    progress_percentage__gte=0,
                )
                & models.Q(
                    progress_percentage__lte=100,
                ),
                name="valid_course_progress_percentage",
            ),
            models.CheckConstraint(
                check=models.Q(
                    completed_sections__gte=0,
                ),
                name="valid_completed_sections",
            ),
            models.CheckConstraint(
                check=models.Q(
                    completed_lectures__gte=0,
                ),
                name="valid_completed_lectures",
            ),
            models.CheckConstraint(
                check=models.Q(
                    total_sections__gte=0,
                ),
                name="valid_total_sections",
            ),
            models.CheckConstraint(
                check=models.Q(
                    total_lectures__gte=0,
                ),
                name="valid_total_lectures",
            ),
            models.CheckConstraint(
                check=models.Q(
                    completed_sections__lte=F(
                        "total_sections",
                    ),
                ),
                name="completed_sections_lte_total_sections",
            ),
            models.CheckConstraint(
                check=models.Q(
                    completed_lectures__lte=F(
                        "total_lectures",
                    ),
                ),
                name="completed_lectures_lte_total_lectures",
            ),
        ]

    @property
    def is_completed(self):
        return self.progress_percentage == 100

    @property
    def completion_rate(self):
        return self.progress_percentage

    def __str__(self):
        return (
            f"{self.enrollment.student.email} | "
            f"{self.enrollment.course.title} | "
            f"{self.progress_percentage}%"
        )