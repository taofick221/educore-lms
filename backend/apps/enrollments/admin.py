from django.contrib import admin

from unfold.admin import ModelAdmin

from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)


# ==========================================================
# Enrollment Admin
# ==========================================================


@admin.register(Enrollment)
class EnrollmentAdmin(ModelAdmin):
    list_display = (
        "student",
        "course",
        "status",
        "certificate_issued",
        "is_active",
        "enrolled_at",
    )

    list_filter = (
        "status",
        "certificate_issued",
        "is_active",
        "enrolled_at",
    )

    search_fields = (
        "student__email",
        "student__first_name",
        "student__last_name",
        "course__title",
    )

    readonly_fields = (
        "id",
        "enrolled_at",
        "started_at",
        "completed_at",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "student",
        "course",
    )

    ordering = ("-enrolled_at",)

    list_per_page = 25


# ==========================================================
# Lesson Progress Admin
# ==========================================================


@admin.register(LessonProgress)
class LessonProgressAdmin(ModelAdmin):
    list_display = (
        "enrollment",
        "lecture",
        "watch_percentage",
        "is_completed",
        "updated_at",
    )

    list_filter = (
        "is_completed",
    )

    search_fields = (
        "enrollment__student__email",
        "enrollment__student__first_name",
        "enrollment__student__last_name",
        "enrollment__course__title",
        "lecture__title",
    )

    readonly_fields = (
        "id",
        "completed_at",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "enrollment",
        "lecture",
    )

    ordering = ("-updated_at",)

    list_per_page = 25


# ==========================================================
# Course Progress Admin
# ==========================================================


@admin.register(CourseProgress)
class CourseProgressAdmin(ModelAdmin):
    list_display = (
        "enrollment",
        "progress_percentage",
        "completed_lectures",
        "total_lectures",
        "completed_at",
        "updated_at",
    )

    list_filter = (
        "completed_at",
    )

    search_fields = (
        "enrollment__student__email",
        "enrollment__student__first_name",
        "enrollment__student__last_name",
        "enrollment__course__title",
    )

    readonly_fields = (
        "id",
        "completed_at",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "enrollment",
        "last_completed_lecture",
    )

    ordering = ("-updated_at",)

    list_per_page = 25