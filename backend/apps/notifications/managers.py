from django.db import models


class NotificationQuerySet(models.QuerySet):
    def unread(self):
        return self.filter(
            is_read=False,
        )

    def read(self):
        return self.filter(
            is_read=True,
        )

    def for_user(self, user):
        return self.filter(
            recipient=user,
        )


class NotificationManager(
    models.Manager.from_queryset(NotificationQuerySet),
):
    pass