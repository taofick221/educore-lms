from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiResponse,
    extend_schema,
)
from rest_framework import (
    filters,
    generics,
    permissions,
)

from .filters import CourseFilter
from .models import (
    Category,
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


# ==========================================================
# Category List / Create
# ==========================================================


@extend_schema(
    tags=["Categories"],
    summary="List Categories",
    description="Retrieve all active course categories.",
    responses={
        200: CategorySerializer(many=True),
    },
)
class CategoryListCreateAPIView(
    generics.ListCreateAPIView,
):
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
    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().create(
            request,
            *args,
            **kwargs,
        )

# ==========================================================
# Category Retrieve / Update / Delete
# ==========================================================


@extend_schema(
    tags=["Categories"],
    summary="Category Details",
    description="Retrieve, update or delete a category.",
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
        description="Update an existing category.",
        request=CategorySerializer,
        responses={
            200: CategorySerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
            404: OpenApiResponse(
                description="Category not found.",
            ),
        },
    )
    def patch(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().patch(
            request,
            *args,
            **kwargs,
        )

    @extend_schema(
        summary="Replace Category",
        description="Replace an existing category.",
        request=CategorySerializer,
        responses={
            200: CategorySerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
            404: OpenApiResponse(
                description="Category not found.",
            ),
        },
    )
    def put(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().put(
            request,
            *args,
            **kwargs,
        )

    @extend_schema(
        summary="Delete Category",
        description="Delete a category.",
        responses={
            204: OpenApiResponse(
                description="Category deleted successfully.",
            ),
            404: OpenApiResponse(
                description="Category not found.",
            ),
        },
    )
    def delete(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().delete(
            request,
            *args,
            **kwargs,
        )

# ==========================================================
# Course List / Create
# ==========================================================


@extend_schema(
    tags=["Courses"],
    summary="List Courses",
    description="Retrieve all published courses or create a new course.",
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
        "published_at",
        "price",
        "title",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        queryset = get_courses()

        if not self.request.user.is_authenticated:
            return queryset.filter(
                is_active=True,
                is_published=True,
            )

        if self.request.user.is_staff:
            return queryset

        if self.request.user.role == "instructor":
            return queryset.filter(
                instructor=self.request.user,
            )

        return queryset.filter(
            is_active=True,
            is_published=True,
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
    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):
        serializer.save()


# ==========================================================
# Course Retrieve / Update / Delete
# ==========================================================


@extend_schema(
    tags=["Courses"],
    summary="Course Details",
    description="Retrieve, update or delete a course.",
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
        description="Partially update a course.",
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
    def patch(
        self,
        request,
        *args,
        **kwargs,
    ):
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
    def put(
        self,
        request,
        *args,
        **kwargs,
    ):
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
    def delete(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().delete(
            request,
            *args,
            **kwargs,
        )

    def perform_destroy(self, instance):
        instance.delete()


from .permissions import (
    IsInstructorOrSectionReadOnly,
    IsSectionOwner,
)
from .selectors import (
    get_sections,
)
from .serializers import (
    CreateSectionSerializer,
    SectionSerializer,
    UpdateSectionSerializer,
)


# ==========================================================
# Section List / Create
# ==========================================================


@extend_schema(
    tags=["Sections"],
    summary="List Sections",
    description="Retrieve all sections or create a new section.",
)
class SectionListCreateAPIView(
    generics.ListCreateAPIView,
):
    queryset = get_sections()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateSectionSerializer

        return SectionSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsInstructorOrSectionReadOnly(),
            ]

        return [
            permissions.AllowAny(),
        ]

    @extend_schema(
        summary="Create Section",
        request=CreateSectionSerializer,
        responses={
            201: SectionSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
        },
    )
    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):
        serializer.save()


# ==========================================================
# Section Retrieve / Update / Delete
# ==========================================================


@extend_schema(
    tags=["Sections"],
    summary="Section Details",
    description="Retrieve, update or delete a section.",
)
class SectionRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = get_sections()

    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateSectionSerializer

        return SectionSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [
                permissions.AllowAny(),
            ]

        return [
            permissions.IsAuthenticated(),
            IsSectionOwner(),
        ]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


from .permissions import (
    IsInstructorOrLectureReadOnly,
    IsLectureOwner,
)
from .selectors import (
    get_lectures,
)
from .serializers import (
    CreateLectureSerializer,
    LectureSerializer,
    UpdateLectureSerializer,
)


# ==========================================================
# Lecture List / Create
# ==========================================================


@extend_schema(
    tags=["Lectures"],
    summary="List Lectures",
    description="Retrieve all lectures or create a new lecture.",
)
class LectureListCreateAPIView(
    generics.ListCreateAPIView,
):
    queryset = get_lectures()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateLectureSerializer

        return LectureSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsInstructorOrLectureReadOnly(),
            ]

        return [
            permissions.AllowAny(),
        ]

    @extend_schema(
        summary="Create Lecture",
        request=CreateLectureSerializer,
        responses={
            201: LectureSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
        },
    )
    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):
        serializer.save()


# ==========================================================
# Lecture Retrieve / Update / Delete
# ==========================================================


@extend_schema(
    tags=["Lectures"],
    summary="Lecture Details",
    description="Retrieve, update or delete a lecture.",
)
class LectureRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = get_lectures()

    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateLectureSerializer

        return LectureSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [
                permissions.AllowAny(),
            ]

        return [
            permissions.IsAuthenticated(),
            IsLectureOwner(),
        ]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


from .permissions import (
    IsInstructorOrResourceReadOnly,
    IsResourceOwner,
)
from .selectors import (
    get_resources,
)
from .serializers import (
    CreateResourceSerializer,
    ResourceSerializer,
    UpdateResourceSerializer,
)


# ==========================================================
# Resource List / Create
# ==========================================================


@extend_schema(
    tags=["Resources"],
    summary="List Resources",
    description="Retrieve all resources or create a new resource.",
)
class ResourceListCreateAPIView(
    generics.ListCreateAPIView,
):
    queryset = get_resources()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateResourceSerializer

        return ResourceSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsInstructorOrResourceReadOnly(),
            ]

        return [
            permissions.AllowAny(),
        ]

    @extend_schema(
        summary="Create Resource",
        request=CreateResourceSerializer,
        responses={
            201: ResourceSerializer,
            400: OpenApiResponse(
                description="Validation error.",
            ),
        },
    )
    def create(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().create(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):
        serializer.save()


# ==========================================================
# Resource Retrieve / Update / Delete
# ==========================================================


@extend_schema(
    tags=["Resources"],
    summary="Resource Details",
    description="Retrieve, update or delete a resource.",
)
class ResourceRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = get_resources()

    serializer_class = ResourceSerializer

    lookup_field = "pk"

    def get_serializer_class(self):
        if self.request.method in (
            "PUT",
            "PATCH",
        ):
            return UpdateResourceSerializer

        return ResourceSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [
                permissions.AllowAny(),
            ]

        return [
            permissions.IsAuthenticated(),
            IsResourceOwner(),
        ]

    @extend_schema(
        summary="Update Resource",
        request=UpdateResourceSerializer,
        responses={
            200: ResourceSerializer,
        },
    )
    def patch(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().patch(
            request,
            *args,
            **kwargs,
        )

    @extend_schema(
        summary="Replace Resource",
        request=UpdateResourceSerializer,
        responses={
            200: ResourceSerializer,
        },
    )
    def put(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().put(
            request,
            *args,
            **kwargs,
        )

    def perform_update(self, serializer):
        serializer.save()

    @extend_schema(
        summary="Delete Resource",
        responses={
            204: OpenApiResponse(
                description="Resource deleted successfully.",
            ),
        },
    )
    def delete(
        self,
        request,
        *args,
        **kwargs,
    ):
        return super().delete(
            request,
            *args,
            **kwargs,
        )

    def perform_destroy(self, instance):
        instance.delete()



