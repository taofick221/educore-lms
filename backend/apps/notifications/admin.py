from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "recipient",
        "notification_type",
        "is_read",
        "created_at",
    )

    list_filter = (
        "notification_type",
        "is_read",
        "created_at",
    )

    search_fields = (
        "title",
        "message",
        "recipient__email",
        "recipient__first_name",
        "recipient__last_name",
    )

    autocomplete_fields = (
        "recipient",
    )

    readonly_fields = (
        "id",
        "content_type",
        "object_id",
        "read_at",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    fieldsets = (
        (
            "Notification",
            {
                "fields": (
                    "recipient",
                    "notification_type",
                    "title",
                    "message",
                ),
            },
        ),
        (
            "Read Status",
            {
                "fields": (
                    "is_read",
                    "read_at",
                ),
            },
        ),
        (
            "Related Object",
            {
                "classes": ("collapse",),
                "fields": (
                    "content_type",
                    "object_id",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )