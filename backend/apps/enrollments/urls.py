from django.urls import path

from .views import (
    ActivateEnrollmentAPIView,
    CancelEnrollmentAPIView,
    CompleteEnrollmentAPIView,
    CourseProgressRetrieveUpdateAPIView,
    EnrollmentListCreateAPIView,
    EnrollmentRetrieveUpdateDestroyAPIView,
    IssueCertificateAPIView,
    LessonProgressListCreateAPIView,
    LessonProgressRetrieveUpdateAPIView,
)

app_name = "enrollments"


urlpatterns = [
    # ==========================================================
    # Enrollments
    # ==========================================================

    path(
        "",
        EnrollmentListCreateAPIView.as_view(),
        name="enrollment-list-create",
    ),

    path(
        "<uuid:pk>/",
        EnrollmentRetrieveUpdateDestroyAPIView.as_view(),
        name="enrollment-detail",
    ),

    # ==========================================================
    # Lesson Progress
    # ==========================================================
    # ==========================================================
    # Lesson Progress
    # ==========================================================

    path(
        "lesson-progress/",
        LessonProgressListCreateAPIView.as_view(),
        name="lesson-progress-list-create",
    ),

    path(
        "lesson-progress/<uuid:pk>/",
        LessonProgressRetrieveUpdateAPIView.as_view(),
        name="lesson-progress-detail",
    ),

    # ==========================================================
    # Course Progress
    # ==========================================================

    path(
        "course-progress/<uuid:pk>/",
        CourseProgressRetrieveUpdateAPIView.as_view(),
        name="course-progress-detail",
    ),

    # ==========================================================
    # Enrollment Actions
    # ==========================================================

    path(
        "<uuid:pk>/activate/",
        ActivateEnrollmentAPIView.as_view(),
        name="activate-enrollment",
    ),

    path(
        "<uuid:pk>/complete/",
        CompleteEnrollmentAPIView.as_view(),
        name="complete-enrollment",
    ),

    path(
        "<uuid:pk>/cancel/",
        CancelEnrollmentAPIView.as_view(),
        name="cancel-enrollment",
    ),

    path(
        "<uuid:pk>/issue-certificate/",
        IssueCertificateAPIView.as_view(),
        name="issue-certificate",
    ),
]
