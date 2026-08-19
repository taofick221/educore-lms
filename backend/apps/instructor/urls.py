from django.urls import path

from .views import (
    InstructorCourseDetailAPIView,
    InstructorCourseListAPIView,
    InstructorDashboardAPIView,
)


urlpatterns = [
    # ------------------------------------------------------
    # Dashboard
    # ------------------------------------------------------

    path(
        "dashboard/",
        InstructorDashboardAPIView.as_view(),
        name="dashboard",
    ),

    # ------------------------------------------------------
    # Courses
    # ------------------------------------------------------

    path(
        "courses/",
        InstructorCourseListAPIView.as_view(),
        name="course-list",
    ),

    path(
        "courses/<slug:slug>/",
        InstructorCourseDetailAPIView.as_view(),
        name="course-detail",
    ),
]