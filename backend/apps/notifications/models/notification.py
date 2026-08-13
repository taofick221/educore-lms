import uuid

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.common.models import TimeStampedModel

from ..choices import NotificationType
from ..constants import (
    DEFAULT_IS_READ,
    NOTIFICATION_MESSAGE_MAX_LENGTH,
    NOTIFICATION_TITLE_MAX_LENGTH,
)
from ..managers import NotificationManager


class Notification(TimeStampedModel):
    """
    Stores an in-app notification for a user.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
        db_index=True,
    )

    title = models.CharField(
        max_length=NOTIFICATION_TITLE_MAX_LENGTH,
    )

    message = models.TextField(
        max_length=NOTIFICATION_MESSAGE_MAX_LENGTH,
    )

    is_read = models.BooleanField(
        default=DEFAULT_IS_READ,
        db_index=True,
    )

    read_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    # ------------------------------------------------------
    # Optional related object
    # ------------------------------------------------------

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notification_objects",
    )

    object_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )

    related_object = GenericForeignKey(
        "content_type",
        "object_id",
    )

    objects = NotificationManager()

    class Meta:
        ordering = (
            "-created_at",
        )

        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

        indexes = [
            models.Index(
                fields=[
                    "recipient",
                    "is_read",
                ],
            ),
            models.Index(
                fields=[
                    "recipient",
                    "-created_at",
                ],
            ),
            models.Index(
                fields=[
                    "notification_type",
                ],
            ),
        ]

    def mark_as_read(self):
        """
        Mark this notification as read.
        """
        if self.is_read:
            return

        from django.utils import timezone

        self.is_read = True
        self.read_at = timezone.now()

        self.save(
            update_fields=[
                "is_read",
                "read_at",
                "updated_at",
            ],
        )

    def __str__(self):
        return (
            f"{self.recipient.email} - "
            f"{self.title}"
        )