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
    path(
        "certificates/",
        include("apps.certificates.urls"),
    ),
    path(
        "quizzes/",
        include("apps.quizzes.urls"),
    ),
    path(
        "assignments/",
        include("apps.assignments.urls"),
    ),
    path(
        "instructor/",
        include("apps.instructor.urls"),
    ),
]
