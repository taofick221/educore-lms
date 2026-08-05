from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiResponse,
    extend_schema,
)
from rest_framework import filters, generics, permissions

from .filters import CourseFilter
from .models import (
    Category,
    Course,
)
from .permissions import (
    IsAdminOrCourseOwner,
    IsInstructorOrReadOnly,
)
from .selectors import (
    get_courses,
)
from .serializers import (
    CategorySerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    CreateCourseSerializer,
    UpdateCourseSerializer,
)


@extend_schema(
    tags=["Categories"],
    summary="List Categories",
    description="Retrieve all active course categories.",
    responses={
        200: CategorySerializer(many=True),
    },
)
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.active()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                permissions.IsAdminUser(),
            ]

        return [
            permissions.AllowAny(),
        ]

    @extend_schema(
        summary="Create Category",
        description="Create a new course category.",
        request=CategorySerializer,
        responses={
            201: CategorySerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(
            request,
            *args,
            **kwargs,
        )


@extend_schema(
    tags=["Categories"],
    summary="Category Details",
    description="Retrieve a category by slug.",
    responses={
        200: CategorySerializer,
        404: OpenApiResponse(
            description="Category not found.",
        ),
    },
)
class CategoryRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = Category.objects.active()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [
                permissions.AllowAny(),
            ]

        return [
            permissions.IsAdminUser(),
        ]

    @extend_schema(
        summary="Update Category",
        request=CategorySerializer,
        responses={
            200: CategorySerializer,
        },
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(
            request,
            *args,
            **kwargs,
        )

    @extend_schema(
        summary="Delete Category",
        responses={
            204: OpenApiResponse(
                description="Category deleted successfully.",
            ),
        },
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(
            request,
            *args,
            **kwargs,
        )


@extend_schema(
    tags=["Courses"],
    summary="List Courses",
    description="Retrieve all published courses.",
    responses={
        200: CourseListSerializer(many=True),
    },
)
class CourseListCreateAPIView(
    generics.ListCreateAPIView,
):
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )

    filterset_class = CourseFilter

    search_fields = (
        "title",
        "subtitle",
        "description",
        "category__name",
        "instructor__first_name",
        "instructor__last_name",
    )

    ordering_fields = (
        "created_at",
        "price",
        "title",
        "published_at",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        queryset = get_courses()

        if not self.request.user.is_authenticated:
            return queryset.filter(
                is_published=True,
                is_active=True,
            )

        if self.request.user.is_staff:
            return queryset

        if self.request.user.role == "instructor":
            return queryset.filter(
                instructor=self.request.user,
            )

        return queryset.filter(
            is_published=True,
            is_active=True,
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCourseSerializer

        return CourseListSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsInstructorOrReadOnly(),
            ]

        return [
            permissions.AllowAny(),
        ]

    @extend_schema(
        summary="Create Course",
        description="Create a new course.",
        request=CreateCourseSerializer,
        responses={
            201: CourseDetailSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):
        serializer.save()


@extend_schema(
    tags=["Courses"],
    summary="Course Details",
    description="Retrieve a course by slug.",
    responses={
        200: CourseDetailSerializer,
        404: OpenApiResponse(
            description="Course not found.",
        ),
    },
)
class CourseRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = get_courses()
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateCourseSerializer

        return CourseDetailSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [
                permissions.AllowAny(),
            ]

        return [
            permissions.IsAuthenticated(),
            IsAdminOrCourseOwner(),
        ]

    @extend_schema(
        summary="Update Course",
        description="Update an existing course.",
        request=UpdateCourseSerializer,
        responses={
            200: CourseDetailSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
            403: OpenApiResponse(
                description="Permission denied.",
            ),
            404: OpenApiResponse(
                description="Course not found.",
            ),
        },
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(
            request,
            *args,
            **kwargs,
        )

    @extend_schema(
        summary="Replace Course",
        description="Replace an existing course.",
        request=UpdateCourseSerializer,
        responses={
            200: CourseDetailSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
            403: OpenApiResponse(
                description="Permission denied.",
            ),
            404: OpenApiResponse(
                description="Course not found.",
            ),
        },
    )
    def put(self, request, *args, **kwargs):
        return super().put(
            request,
            *args,
            **kwargs,
        )

    def perform_update(self, serializer):
        serializer.save()

    @extend_schema(
        summary="Delete Course",
        description="Delete a course.",
        responses={
            204: OpenApiResponse(
                description="Course deleted successfully.",
            ),
            403: OpenApiResponse(
                description="Permission denied.",
            ),
            404: OpenApiResponse(
                description="Course not found.",
            ),
        },
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(
            request,
            *args,
            **kwargs,
        )

    def perform_destroy(self, instance):
        instance.delete()