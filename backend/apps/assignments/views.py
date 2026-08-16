from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from apps.enrollments.models import Enrollment

from .models import Assignment, Submission
from .permissions import IsSubmissionInstructorOrStaff
from .selectors import (
    get_instructor_submissions,
    get_published_course_assignments,
    get_student_submission,
)
from .serializers import (
    AssignmentSerializer,
    GradeSubmissionSerializer,
    SubmissionCreateSerializer,
    SubmissionSerializer,
)
from .services import grade_submission, submit_assignment


# ============================================================
# COURSE ASSIGNMENTS
# ============================================================

class CourseAssignmentListAPIView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return get_published_course_assignments(
            course_id=self.kwargs["course_id"],
            student=self.request.user,
        )


# ============================================================
# STUDENT SUBMISSION
# ============================================================

class StudentAssignmentSubmissionAPIView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        assignment = get_object_or_404(
            Assignment,
            pk=self.kwargs["assignment_id"],
            is_published=True,
        )

        # Make sure the student is enrolled in the assignment's course.
        enrollment = get_object_or_404(
            Enrollment,
            student=self.request.user,
            course=assignment.course,
            is_active=True,
        )

        submission = get_student_submission(
            assignment_id=assignment.id,
            student=self.request.user,
        )

        # IMPORTANT:
        # get_object() must return a model instance.
        # Never return Response() from get_object().
        if not submission:
            raise NotFound(
                "You have not submitted this assignment yet."
            )

        return submission


# ============================================================
# CREATE / UPDATE STUDENT SUBMISSION
# ============================================================

class AssignmentSubmissionCreateAPIView(generics.CreateAPIView):
    serializer_class = SubmissionCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        assignment = get_object_or_404(
            Assignment,
            pk=kwargs["assignment_id"],
            is_published=True,
        )

        enrollment = get_object_or_404(
            Enrollment,
            student=request.user,
            course=assignment.course,
            is_active=True,
        )

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            submission = submit_assignment(
                assignment=assignment,
                enrollment=enrollment,
                student=request.user,
                text=serializer.validated_data.get(
                    "text",
                    "",
                ),
                attachment=serializer.validated_data.get(
                    "attachment",
                ),
            )

        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            SubmissionSerializer(
                submission,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# INSTRUCTOR SUBMISSIONS
# ============================================================

class InstructorSubmissionListAPIView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        assignment = get_object_or_404(
            Assignment,
            pk=self.kwargs["assignment_id"],
        )

        if not (
            self.request.user.is_staff
            or assignment.course.instructor_id
            == self.request.user.id
        ):
            return Submission.objects.none()

        return get_instructor_submissions(
            assignment_id=assignment.id,
            instructor=self.request.user,
        )


# ============================================================
# GRADE SUBMISSION
# ============================================================

class GradeSubmissionAPIView(generics.UpdateAPIView):
    serializer_class = GradeSubmissionSerializer

    permission_classes = (
        permissions.IsAuthenticated,
        IsSubmissionInstructorOrStaff,
    )

    http_method_names = [
        "patch",
    ]

    def get_queryset(self):
        return (
            Submission.objects
            .select_related(
                "assignment__course",
                "student",
            )
        )

    def get_object(self):
        submission = super().get_object()

        self.check_object_permissions(
            self.request,
            submission,
        )

        return submission

    def patch(self, request, *args, **kwargs):
        submission = self.get_object()

        serializer = self.get_serializer(
            data=request.data,
            context={
                "submission": submission,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            updated_submission = grade_submission(
                submission=submission,
                grader=request.user,
                score=serializer.validated_data["score"],
                feedback=serializer.validated_data.get(
                    "feedback",
                    "",
                ),
            )

        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            SubmissionSerializer(
                updated_submission,
                context={
                    "request": request,
                },
            ).data,
            status=status.HTTP_200_OK,
        )