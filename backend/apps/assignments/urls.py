from django.urls import path

from .views import (
    AssignmentSubmissionCreateAPIView,
    CourseAssignmentListAPIView,
    GradeSubmissionAPIView,
    InstructorSubmissionListAPIView,
    StudentAssignmentSubmissionAPIView,
)


urlpatterns = [
    path(
        "courses/<uuid:course_id>/",
        CourseAssignmentListAPIView.as_view(),
        name="course-assignments",
    ),

    path(
        "<uuid:assignment_id>/submission/",
        StudentAssignmentSubmissionAPIView.as_view(),
        name="my-assignment-submission",
    ),

    path(
        "<uuid:assignment_id>/submit/",
        AssignmentSubmissionCreateAPIView.as_view(),
        name="submit-assignment",
    ),

    path(
        "<uuid:assignment_id>/submissions/",
        InstructorSubmissionListAPIView.as_view(),
        name="assignment-submissions",
    ),

    path(
        "submissions/<uuid:submission_id>/grade/",
        GradeSubmissionAPIView.as_view(),
        name="grade-submission",
    ),
]