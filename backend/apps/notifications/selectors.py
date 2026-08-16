from django.db.models import QuerySet

from .models import Notification


def get_notifications() -> QuerySet:
    """
    Retrieve all notifications.
    """

    return Notification.objects.select_related(
        "recipient",
        "content_type",
    )


def get_user_notifications(
    user,
) -> QuerySet:
    """
    Retrieve notifications belonging to a user.
    """

    return (
        get_notifications()
        .for_user(user)
    )


def get_unread_notifications(
    user,
) -> QuerySet:
    """
    Retrieve unread notifications for a user.
    """

    return (
        get_user_notifications(user)
        .unread()
    )


def get_notification_by_id(
    notification_id,
):
    """
    Retrieve a notification by ID.
    """

    return get_notifications().filter(
        id=notification_id,
    ).first()