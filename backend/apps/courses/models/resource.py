import uuid

from django.db import models

from apps.common.models import TimeStampedModel

from ..choices import ResourceTypeChoices
from ..constants import MAX_RESOURCE_TITLE_LENGTH
from .lecture import Lecture


class Resource(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    lecture = models.ForeignKey(
        Lecture,
        on_delete=models.CASCADE,
        related_name="resources",
    )

    title = models.CharField(
        max_length=MAX_RESOURCE_TITLE_LENGTH,
    )

    file = models.FileField(
        upload_to="courses/resources/",
        blank=True,
        null=True,
    )

    external_url = models.URLField(
        blank=True,
    )

    resource_type = models.CharField(
        max_length=20,
        choices=ResourceTypeChoices.choices,
        default=ResourceTypeChoices.PDF,
    )

    order = models.PositiveIntegerField(
        default=1,
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    class Meta:
        ordering = [
            "order",
        ]

    indexes = [
        models.Index(
            fields=[
                "lecture",
                "order",
            ]
        ),
        models.Index(
            fields=[
                "resource_type",
            ]
        ),
        models.Index(
            fields=[
                "is_active",
            ]
        ),
    ]

    constraints = [
        models.UniqueConstraint(
            fields=[
                "lecture",
                "title",
            ],
            name="unique_resource_title_per_lecture",
        ),
        models.UniqueConstraint(
            fields=[
                "lecture",
                "order",
            ],
            name="unique_resource_order_per_lecture",
        ),
    ]
