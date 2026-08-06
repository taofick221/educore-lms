import django_filters

from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)


# ==========================================================
# Enrollment Filter
# ==========================================================


class EnrollmentFilter(
    django_filters.FilterSet,
):
    enrolled_after = django_filters.DateFilter(
        field_name="enrolled_at",
        lookup_expr="date__gte",
    )

    enrolled_before = django_filters.DateFilter(
        field_name="enrolled_at",
        lookup_expr="date__lte",
    )

    class Meta:
        model = Enrollment

        fields = {
            "student": [
                "exact",
            ],
            "course": [
                "exact",
            ],
            "status": [
                "exact",
            ],
            "certificate_issued": [
                "exact",
            ],
            "is_active": [
                "exact",
            ],
        }


# ==========================================================
# Lesson Progress Filter
# ==========================================================


class LessonProgressFilter(
    django_filters.FilterSet,
):
    class Meta:
        model = LessonProgress

        fields = {
            "enrollment": [
                "exact",
            ],
            "lecture": [
                "exact",
            ],
            "is_completed": [
                "exact",
            ],
        }


# ==========================================================
# Course Progress Filter
# ==========================================================


class CourseProgressFilter(
    django_filters.FilterSet,
):
    min_progress = django_filters.NumberFilter(
        field_name="progress_percentage",
        lookup_expr="gte",
    )

    max_progress = django_filters.NumberFilter(
        field_name="progress_percentage",
        lookup_expr="lte",
    )

    class Meta:
        model = CourseProgress

        fields = {
            "enrollment": [
                "exact",
            ],
            "completed_at": [
                "isnull",
            ],
        }