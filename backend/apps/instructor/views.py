from decimal import Decimal

from django.db.models import Sum
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from rest_framework.response import Response

from apps.courses.models import Course
from apps.courses.selectors import get_instructor_courses
from apps.courses.serializers import (
    CourseDetailSerializer,
    CreateCourseSerializer,
    UpdateCourseSerializer,
)
from apps.enrollments.models import Enrollment

from .permissions import IsInstructor
from .serializers import (
    InstructorCourseSerializer,
    InstructorDashboardSerializer,
)


# ==========================================================
# Instructor Dashboard
# ==========================================================


@extend_schema(
    tags=["Instructor"],
    summary="Instructor Dashboard",
    description=(
        "Return dashboard statistics for the "
        "authenticated instructor."
    ),
    responses={
        200: InstructorDashboardSerializer,
    },
)
class InstructorDashboardAPIView(
    generics.GenericAPIView,
):
    permission_classes = (
        permissions.IsAuthenticated,
        IsInstructor,
    )

    serializer_class = InstructorDashboardSerializer

    def get(self, request, *args, **kwargs):
        instructor = request.user

        courses = Course.objects.filter(
            instructor=instructor,
        )

        enrollments = Enrollment.objects.filter(
            course__instructor=instructor,
        )

        course_count = courses.count()

        published_course_count = courses.filter(
            is_published=True,
            is_active=True,
        ).count()

        enrollment_count = enrollments.count()

        completed_enrollment_count = enrollments.filter(
            status="completed",
        ).count()

        student_count = (
            enrollments
            .values("student_id")
            .distinct()
            .count()
        )

        revenue = Decimal("0.00")

        if hasattr(Enrollment, "price_paid"):
            revenue = (
                enrollments.aggregate(
                    total=Sum("price_paid"),
                )["total"]
                or Decimal("0.00")
            )

        data = {
            "course_count": course_count,
            "published_course_count": (
                published_course_count
            ),
            "student_count": student_count,
            "enrollment_count": enrollment_count,
            "completed_enrollment_count": (
                completed_enrollment_count
            ),
            "revenue": revenue,
        }

        serializer = self.get_serializer(data)

        return Response(serializer.data)


# ==========================================================
# Instructor Course List
# ==========================================================


@extend_schema(
    tags=["Instructor"],
    summary="List Instructor Courses",
    description=(
        "Retrieve courses owned by the "
        "authenticated instructor."
    ),
    responses={
        200: InstructorCourseSerializer(many=True),
    },
)
class InstructorCourseListAPIView(
    generics.ListCreateAPIView,
):
    permission_classes = (
        permissions.IsAuthenticated,
        IsInstructor,
    )

    def get_queryset(self):
        return get_instructor_courses(
            instructor=self.request.user,
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCourseSerializer

        return InstructorCourseSerializer


# ==========================================================
# Instructor Course Detail
# ==========================================================


@extend_schema(
    tags=["Instructor"],
    summary="Instructor Course Detail",
    description=(
        "Retrieve or update a course owned by "
        "the authenticated instructor."
    ),
)
class InstructorCourseDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    permission_classes = (
        permissions.IsAuthenticated,
        IsInstructor,
    )

    lookup_field = "slug"

    def get_queryset(self):
        return get_instructor_courses(
            instructor=self.request.user,
        )

    def get_serializer_class(self):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateCourseSerializer

        return CourseDetailSerializer