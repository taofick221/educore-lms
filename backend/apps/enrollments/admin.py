from django.contrib import admin

from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
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

    ordering = (
        "-enrolled_at",
    )


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
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

    ordering = (
        "-updated_at",
    )


@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = (
        "enrollment",
        "progress_percentage",
        "completed_lectures",
        "total_lectures",
        "completed_at",
    )

    list_filter = (
        "completed_at",
    )

    search_fields = (
        "enrollment__student__email",
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

    ordering = (
        "-updated_at",
    )