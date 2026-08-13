from django.contrib.contenttypes.models import ContentType
from django.db import transaction

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
    Create a notification for a user.
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
                "content_type": ContentType.objects.get_for_model(
                    related_object,
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
def mark_notification_as_read(
    *,
    notification,
) -> Notification:
    """
    Mark a notification as read.
    """

    notification.mark_as_read()

    return notification


@transaction.atomic
def mark_all_notifications_as_read(
    *,
    user,
) -> int:
    """
    Mark all unread notifications of a user as read.
    """

    from django.utils import timezone

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