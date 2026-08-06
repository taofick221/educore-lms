import uuid

from django.db import models
from django.utils.text import slugify

from apps.common.models import TimeStampedModel

from ..constants import (
    MAX_SECTION_TITLE_LENGTH,
    MAX_SLUG_LENGTH,
)
from ..managers import SectionManager
from .course import Course


class Section(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="sections",
    )

    title = models.CharField(
        max_length=MAX_SECTION_TITLE_LENGTH,
    )

    slug = models.SlugField(
        max_length=MAX_SLUG_LENGTH,
        blank=True,
    )

    description = models.TextField(
        blank=True,
    )

    order = models.PositiveIntegerField(
        default=1,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    is_published = models.BooleanField(
        default=False,
        db_index=True,
    )

    objects = SectionManager()

    class Meta:
        ordering = [
            "order",
        ]

        indexes = [
            models.Index(
                fields=[
                    "course",
                    "order",
                ]
            ),
            models.Index(
                fields=[
                    "slug",
                ]
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "course",
                    "title",
                ],
                name="unique_section_title_per_course",
            ),
            models.UniqueConstraint(
                fields=[
                    "course",
                    "order",
                ],
                name="unique_section_order_per_course",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
