import uuid

from django.db import models
from django.utils.text import slugify

from apps.common.models import TimeStampedModel

from ..constants import (
    DEFAULT_VIDEO_DURATION,
    MAX_LECTURE_TITLE_LENGTH,
    MAX_SLUG_LENGTH,
)
from ..managers import LectureManager
from .section import Section


class Lecture(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="lectures",
    )

    title = models.CharField(
        max_length=MAX_LECTURE_TITLE_LENGTH,
    )

    slug = models.SlugField(
        max_length=MAX_SLUG_LENGTH,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    video_url = models.URLField(
        blank=True,
    )

    duration = models.PositiveIntegerField(
        default=DEFAULT_VIDEO_DURATION,
        help_text="Duration in seconds.",
    )

    order = models.PositiveIntegerField(
        default=1,
    )

    is_preview = models.BooleanField(
        default=False,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    is_published = models.BooleanField(
        default=False,
        db_index=True,
    )

    objects = LectureManager()

    class Meta:
        ordering = [
            "order",
        ]

        indexes = [
            models.Index(
                fields=[
                    "section",
                    "order",
                ]
            ),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "section",
                    "title",
                ],
                name="unique_lecture_title_per_section",
            ),
            models.UniqueConstraint(
                fields=[
                    "section",
                    "order",
                ],
                name="unique_lecture_order_per_section",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
