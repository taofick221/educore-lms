from django.urls import path

from .views import CourseQuizListAPIView, StartQuizAttemptAPIView, SubmitQuizAttemptAPIView

urlpatterns = [
    path("courses/<uuid:course_id>/", CourseQuizListAPIView.as_view(), name="course-quizzes"),
    path("<uuid:quiz_id>/attempts/", StartQuizAttemptAPIView.as_view(), name="start-attempt"),
    path("attempts/<uuid:attempt_id>/submit/", SubmitQuizAttemptAPIView.as_view(), name="submit-attempt"),
]
