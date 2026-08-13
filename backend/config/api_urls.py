from django.urls import include, path


urlpatterns = [
    path(
        "accounts/",
        include("apps.accounts.urls"),
    ),

    path(
        "courses/",
        include("apps.courses.urls"),
    ),

    path(
        "orders/",
        include("apps.orders.urls"),
    ),
    path(
        "enrollments/",
        include("apps.enrollments.urls"),
    ),
    path(
        "notifications/",
        include("apps.notifications.urls"),
    ),
]
