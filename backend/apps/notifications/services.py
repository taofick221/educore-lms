from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.utils import timezone

from .choices import NotificationType
from .models import Notification


@transaction.atomic
def create_notification(
    *,
    recipient,
    notification_type: NotificationType,
    title: str,
    message: str,
    related_object=None,
) -> Notification:
    """
    Create an in-app notification.
    """

    notification_data = {
        "recipient": recipient,
        "notification_type": notification_type,
        "title": title,
        "message": message,
    }

    if related_object is not None:
        notification_data.update(
            {
                "content_type": (
                    ContentType.objects.get_for_model(
                        related_object,
                    )
                ),
                "object_id": str(
                    related_object.pk,
                ),
            }
        )

    return Notification.objects.create(
        **notification_data,
    )


@transaction.atomic
def create_notification_once(
    *,
    recipient,
    notification_type: NotificationType,
    title: str,
    message: str,
    related_object=None,
):
    """
    Create a notification only once for the
    same recipient, type and related object.
    """

    content_type = None
    object_id = None

    if related_object is not None:
        content_type = (
            ContentType.objects.get_for_model(
                related_object,
            )
        )

        object_id = str(
            related_object.pk,
        )

    existing = Notification.objects.filter(
        recipient=recipient,
        notification_type=notification_type,
        content_type=content_type,
        object_id=object_id,
    ).first()

    if existing:
        return existing

    return Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
        content_type=content_type,
        object_id=object_id,
    )


@transaction.atomic
def mark_notification_as_read(
    *,
    notification,
) -> Notification:
    notification.mark_as_read()

    return notification


@transaction.atomic
def mark_all_notifications_as_read(
    *,
    user,
) -> int:
    updated_count = (
        Notification.objects
        .filter(
            recipient=user,
            is_read=False,
        )
        .update(
            is_read=True,
            read_at=timezone.now(),
        )
    )

    return updated_count