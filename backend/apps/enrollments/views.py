from django_filters.rest_framework import (
    DjangoFilterBackend,
)
from drf_spectacular.utils import (
    extend_schema,
)
from rest_framework import (
    filters,
    generics,
    permissions,
)

from .filters import EnrollmentFilter
from .permissions import (
    IsAdminOrEnrollmentOwner,
    IsStudentOrReadOnly,
)
from .selectors import (
    get_enrollment_by_id,
    get_enrollments,
)
from .serializers import (
    CreateEnrollmentSerializer,
    EnrollmentDetailSerializer,
    EnrollmentListSerializer,
    UpdateEnrollmentSerializer,
)


# ==========================================================
# Enrollment List / Create
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class EnrollmentListCreateAPIView(
    generics.ListCreateAPIView,
):
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )

    filterset_class = EnrollmentFilter

    search_fields = (
        "student__first_name",
        "student__last_name",
        "student__email",
        "course__title",
    )

    ordering_fields = (
        "enrolled_at",
        "created_at",
    )

    ordering = (
        "-enrolled_at",
    )

    def get_queryset(
        self,
    ):
        queryset = (
            get_enrollments()
            .select_related(
                "student",
                "course",
                "course_progress",
            )
        )

        user = self.request.user

        if user.is_staff:
            return queryset

        if getattr(user, "role", None) == "instructor":
            return queryset.filter(
                course__instructor=user,
            )

        return queryset.filter(
            student=user,
        )

    def get_serializer_class(
        self,
    ):
        if self.request.method == "POST":
            return CreateEnrollmentSerializer

        return EnrollmentListSerializer

    def get_permissions(
        self,
    ):
        if self.request.method == "POST":
            return [
                IsStudentOrReadOnly(),
            ]

        return [
            permissions.IsAuthenticated(),
        ]

    def perform_create(
        self,
        serializer,
    ):
        serializer.save()


# ==========================================================
# Enrollment Detail
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class EnrollmentRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminOrEnrollmentOwner,
    ]

    lookup_field = "pk"

    def get_object(
        self,
    ):
        return get_enrollment_by_id(
            self.kwargs["pk"],
        )

    def get_serializer_class(
        self,
    ):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateEnrollmentSerializer

        return EnrollmentDetailSerializer

    def perform_update(
        self,
        serializer,
    ):
        serializer.save()

    def perform_destroy(
        self,
        instance,
    ):
        instance.delete()


from drf_spectacular.utils import (
    extend_schema,
)
from rest_framework import (
    generics,
    permissions,
    status,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import (
    IsAdminOrEnrollmentOwner,
    IsCourseProgressOwner,
    IsLessonProgressOwner,
)
from .selectors import (
    get_course_progress,
    get_enrollment_by_id,
    get_lesson_progress,
)
from .serializers import (
    ActivateEnrollmentSerializer,
    CancelEnrollmentSerializer,
    CompleteEnrollmentSerializer,
    CourseProgressSerializer,
    EnrollmentDetailSerializer,
    IssueCertificateSerializer,
    LessonProgressSerializer,
    UpdateCourseProgressSerializer,
    UpdateLessonProgressSerializer,
)


# ==========================================================
# Lesson Progress
# ==========================================================


@extend_schema(
    tags=["Lesson Progress"],
)
class LessonProgressRetrieveUpdateAPIView(
    generics.RetrieveUpdateAPIView,
):
    permission_classes = [
        permissions.IsAuthenticated,
        IsLessonProgressOwner,
    ]

    lookup_field = "pk"

    def get_queryset(
        self,
    ):
        return (
            get_lesson_progress()
            .select_related(
                "enrollment",
                "lecture",
                "lecture__section",
                "lecture__section__course",
            )
        )

    def get_serializer_class(
        self,
    ):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateLessonProgressSerializer

        return LessonProgressSerializer

    def perform_update(
        self,
        serializer,
    ):
        serializer.save()


# ==========================================================
# Course Progress
# ==========================================================


@extend_schema(
    tags=["Course Progress"],
)
class CourseProgressRetrieveUpdateAPIView(
    generics.RetrieveUpdateAPIView,
):
    permission_classes = [
        permissions.IsAuthenticated,
        IsCourseProgressOwner,
    ]

    lookup_field = "pk"

    def get_queryset(
        self,
    ):
        return (
            get_course_progress()
            .select_related(
                "enrollment",
                "enrollment__student",
                "enrollment__course",
                "last_completed_lecture",
            )
        )

    def get_serializer_class(
        self,
    ):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateCourseProgressSerializer

        return CourseProgressSerializer

    def perform_update(
        self,
        serializer,
    ):
        serializer.save()


# ==========================================================
# Enrollment Actions
# ==========================================================


class BaseEnrollmentActionAPIView(
    APIView,
):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminOrEnrollmentOwner,
    ]

    serializer_class = None

    def post(
        self,
        request,
        pk,
    ):
        enrollment = get_enrollment_by_id(
            pk,
        )

        self.check_object_permissions(
            request,
            enrollment,
        )

        serializer = self.serializer_class(
            enrollment,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        enrollment = serializer.save()

        return Response(
            EnrollmentDetailSerializer(
                enrollment,
            ).data,
            status=status.HTTP_200_OK,
        )


# ==========================================================
# Activate Enrollment
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class ActivateEnrollmentAPIView(
    BaseEnrollmentActionAPIView,
):
    serializer_class = (
        ActivateEnrollmentSerializer
    )


# ==========================================================
# Complete Enrollment
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class CompleteEnrollmentAPIView(
    BaseEnrollmentActionAPIView,
):
    serializer_class = (
        CompleteEnrollmentSerializer
    )


# ==========================================================
# Cancel Enrollment
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class CancelEnrollmentAPIView(
    BaseEnrollmentActionAPIView,
):
    serializer_class = (
        CancelEnrollmentSerializer
    )


# ==========================================================
# Issue Certificate
# ==========================================================


@extend_schema(
    tags=["Enrollments"],
)
class IssueCertificateAPIView(
    BaseEnrollmentActionAPIView,
):
    permission_classes = [
        permissions.IsAdminUser,
    ]

    serializer_class = (
        IssueCertificateSerializer
    )