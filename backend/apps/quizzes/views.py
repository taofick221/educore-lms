from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from apps.enrollments.models import Enrollment

from .models import Attempt, Quiz
from .serializers import AttemptSerializer, QuizSerializer, SubmitAttemptSerializer
from .services import start_attempt, submit_attempt


class CourseQuizListAPIView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        if not Enrollment.objects.filter(
            student=self.request.user, course_id=course_id, is_active=True
        ).exists():
            return Quiz.objects.none()
        return Quiz.objects.filter(course_id=course_id, is_published=True).prefetch_related("questions__options")


class StartQuizAttemptAPIView(generics.CreateAPIView):
    serializer_class = AttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=kwargs["quiz_id"], is_published=True)
        if not Enrollment.objects.filter(student=request.user, course=quiz.course, is_active=True).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You must be enrolled in this course.")
        attempt = start_attempt(quiz=quiz, student=request.user)
        return self.create_response(attempt)

    def create_response(self, attempt):
        from rest_framework.response import Response
        from rest_framework import status
        return Response(self.get_serializer(attempt).data, status=status.HTTP_201_CREATED)


class SubmitQuizAttemptAPIView(generics.UpdateAPIView):
    serializer_class = SubmitAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        from rest_framework.response import Response
        from rest_framework import status
        attempt = get_object_or_404(Attempt, pk=kwargs["attempt_id"], student=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            attempt = submit_attempt(attempt=attempt, answers=serializer.validated_data["answers"])
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(AttemptSerializer(attempt).data, status=status.HTTP_200_OK)
