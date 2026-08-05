import django_filters

from .choices import (
    CourseLanguage,
    CourseLevel,
    CourseStatus,
)
from .models import Course


class CourseFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(
        field_name="price",
        lookup_expr="gte",
    )

    max_price = django_filters.NumberFilter(
        field_name="price",
        lookup_expr="lte",
    )

    category = django_filters.UUIDFilter(
        field_name="category__id",
    )

    instructor = django_filters.UUIDFilter(
        field_name="instructor__id",
    )

    level = django_filters.ChoiceFilter(
        choices=CourseLevel.choices,
    )

    language = django_filters.ChoiceFilter(
        choices=CourseLanguage.choices,
    )

    status = django_filters.ChoiceFilter(
        choices=CourseStatus.choices,
    )

    is_featured = django_filters.BooleanFilter()

    is_published = django_filters.BooleanFilter()

    created_after = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_before = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    ordering = django_filters.OrderingFilter(
        fields=(
            ("created_at", "created_at"),
            ("price", "price"),
            ("title", "title"),
        ),
    )

    class Meta:
        model = Course

        fields = (
            "category",
            "instructor",
            "level",
            "language",
            "status",
            "is_featured",
            "is_published",
        )