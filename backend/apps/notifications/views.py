from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .selectors import (
    get_notification_by_id,
    get_unread_notifications,
    get_user_notifications,
)
from .serializers import NotificationSerializer
from .services import (
    mark_all_notifications_as_read,
    mark_notification_as_read,
)


class NotificationViewSet(
    ReadOnlyModelViewSet,
):
    serializer_class = NotificationSerializer
    permission_classes = (
        IsAuthenticated,
    )

    def get_queryset(self):
        return get_user_notifications(
            self.request.user,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="unread",
    )
    def unread(self, request):
        notifications = (
            get_unread_notifications(
                request.user,
            )
        )

        serializer = self.get_serializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="unread-count",
    )
    def unread_count(self, request):
        count = (
            get_unread_notifications(
                request.user,
            ).count()
        )

        return Response(
            {
                "count": count,
            }
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="mark-read",
    )
    def mark_read(
        self,
        request,
        pk=None,
    ):
        notification = (
            get_notification_by_id(pk)
        )

        if (
            notification is None
            or notification.recipient_id
            != request.user.id
        ):
            return Response(
                {
                    "detail": (
                        "Notification not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        mark_notification_as_read(
            notification=notification,
        )

        serializer = self.get_serializer(
            notification,
        )

        return Response(
            serializer.data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="mark-all-read",
    )
    def mark_all_read(
        self,
        request,
    ):
        updated_count = (
            mark_all_notifications_as_read(
                user=request.user,
            )
        )

        return Response(
            {
                "detail": (
                    "All notifications "
                    "marked as read."
                ),
                "updated_count": updated_count,
            }
        )