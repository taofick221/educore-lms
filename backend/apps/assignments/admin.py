from django.contrib import admin
from django.utils.html import format_html

from unfold.admin import ModelAdmin

from .models import Assignment, Submission


@admin.register(Assignment)
class AssignmentAdmin(ModelAdmin):
    list_display = (
        "title",
        "course",
        "max_score",
        "due_at",
        "publication_status",
        "submission_count",
        "created_at",
    )

    list_filter = (
        "is_published",
        "due_at",
        "course",
    )

    search_fields = (
        "title",
        "description",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Assignment Information",
            {
                "fields": (
                    "course",
                    "title",
                    "description",
                ),
            },
        ),
        (
            "Assessment Settings",
            {
                "fields": (
                    "max_score",
                    "due_at",
                    "is_published",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": (
                    "collapse",
                ),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    @admin.display(
        description="Status",
    )
    def publication_status(
        self,
        obj,
    ):
        if obj.is_published:
            return format_html(
                '<span style="color:#059669;font-weight:600;">'
                "Published"
                "</span>"
            )

        return format_html(
            '<span style="color:#6b7280;font-weight:600;">'
            "Draft"
            "</span>"
        )

    @admin.display(
        description="Submissions",
    )
    def submission_count(
        self,
        obj,
    ):
        return obj.submissions.count()


@admin.register(Submission)
class SubmissionAdmin(ModelAdmin):
    list_display = (
        "student",
        "assignment",
        "status",
        "score_display",
        "graded_at",
        "created_at",
    )

    list_filter = (
        "status",
        "assignment",
        "graded_at",
    )

    search_fields = (
        "student__email",
        "assignment__title",
        "feedback",
    )

    autocomplete_fields = (
        "assignment",
        "enrollment",
        "student",
        "graded_by",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
        "graded_at",
    )

    fieldsets = (
        (
            "Submission",
            {
                "fields": (
                    "assignment",
                    "enrollment",
                    "student",
                    "text",
                    "attachment",
                ),
            },
        ),
        (
            "Grading",
            {
                "fields": (
                    "status",
                    "score",
                    "feedback",
                    "graded_by",
                    "graded_at",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": (
                    "collapse",
                ),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    @admin.display(
        description="Score",
    )
    def score_display(
        self,
        obj,
    ):
        if obj.score is None:
            return "Not graded"

        return (
            f"{obj.score}/"
            f"{obj.assignment.max_score}"
        )