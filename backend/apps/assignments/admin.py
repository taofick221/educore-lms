from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.html import format_html

from unfold.admin import ModelAdmin

from .models import Assignment, Submission


# ============================================================
# SUBMISSION FORM
# ============================================================


class SubmissionAdminForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        score = cleaned_data.get("score")
        assignment = cleaned_data.get("assignment")
        status = cleaned_data.get("status")

        # Validate score
        if score is not None and assignment:
            if score < 0:
                raise ValidationError(
                    "Score cannot be negative."
                )

            if score > assignment.max_score:
                raise ValidationError(
                    f"Score cannot be greater than "
                    f"{assignment.max_score}."
                )

        # A graded submission must have a score
        if status == "graded" and score is None:
            raise ValidationError(
                "Please enter a score before marking "
                "the submission as graded."
            )

        return cleaned_data


# ============================================================
# ASSIGNMENT ADMIN
# ============================================================


@admin.register(Assignment)
class AssignmentAdmin(ModelAdmin):

    list_display = (
        "title_display",
        "course",
        "max_score_display",
        "deadline_display",
        "publication_status",
        "submission_count_display",
        "created_at",
    )

    list_filter = (
        "is_published",
        "course",
        "due_at",
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
        "submission_summary",
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
            "Submission Overview",
            {
                "fields": (
                    "submission_summary",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    # --------------------------------------------------------
    # TITLE
    # --------------------------------------------------------

    @admin.display(
        description="Assignment",
        ordering="title",
    )
    def title_display(self, obj):
        return format_html(
            '<div style="font-weight:700;color:#111827;">'
            "{}"
            "</div>",
            obj.title,
        )

    # --------------------------------------------------------
    # MAX SCORE
    # --------------------------------------------------------

    @admin.display(
        description="Max Score",
        ordering="max_score",
    )
    def max_score_display(self, obj):
        return format_html(
            '<span style="'
            "display:inline-flex;"
            "align-items:center;"
            "padding:4px 10px;"
            "border-radius:999px;"
            "background:#eff6ff;"
            "color:#1d4ed8;"
            "font-weight:700;"
            '">'
            "{} points"
            "</span>",
            obj.max_score,
        )

    # --------------------------------------------------------
    # DEADLINE
    # --------------------------------------------------------

    @admin.display(
        description="Deadline",
        ordering="due_at",
    )
    def deadline_display(self, obj):
        if not obj.due_at:
            return format_html(
                '<span style="color:#6b7280;">'
                "No deadline"
                "</span>"
            )

        if obj.due_at < timezone.now():
            return format_html(
                '<span style="'
                "display:inline-flex;"
                "padding:4px 10px;"
                "border-radius:999px;"
                "background:#fef2f2;"
                "color:#dc2626;"
                "font-weight:700;"
                '">'
                "Expired"
                "</span>"
            )

        # Format the datetime BEFORE passing it to format_html.
        formatted_deadline = obj.due_at.strftime(
            "%d %b %Y, %I:%M %p"
        )

        return format_html(
            '<span style="'
            "display:inline-flex;"
            "padding:4px 10px;"
            "border-radius:999px;"
            "background:#ecfdf5;"
            "color:#047857;"
            "font-weight:700;"
            '">'
            "{}"
            "</span>",
            formatted_deadline,
        )

    # --------------------------------------------------------
    # PUBLICATION STATUS
    # --------------------------------------------------------

    @admin.display(
        description="Status",
        ordering="is_published",
    )
    def publication_status(self, obj):
        if obj.is_published:
            return format_html(
                '<span style="'
                "display:inline-flex;"
                "align-items:center;"
                "gap:5px;"
                "padding:4px 10px;"
                "border-radius:999px;"
                "background:#ecfdf5;"
                "color:#047857;"
                "font-weight:700;"
                '">'
                "● Published"
                "</span>"
            )

        return format_html(
            '<span style="'
            "display:inline-flex;"
            "align-items:center;"
            "gap:5px;"
            "padding:4px 10px;"
            "border-radius:999px;"
            "background:#f3f4f6;"
            "color:#6b7280;"
            "font-weight:700;"
            '">'
            "● Draft"
            "</span>"
        )

    # --------------------------------------------------------
    # SUBMISSION COUNT
    # --------------------------------------------------------

    @admin.display(
        description="Submissions",
    )
    def submission_count_display(self, obj):
        count = obj.submissions.count()

        if count == 0:
            return format_html(
                '<span style="'
                "color:#9ca3af;"
                "font-weight:600;"
                '">'
                "0"
                "</span>"
            )

        return format_html(
            '<span style="'
            "display:inline-flex;"
            "min-width:30px;"
            "justify-content:center;"
            "padding:4px 9px;"
            "border-radius:999px;"
            "background:#f5f3ff;"
            "color:#6d28d9;"
            "font-weight:800;"
            '">'
            "{}"
            "</span>",
            count,
        )

    # --------------------------------------------------------
    # SUBMISSION SUMMARY
    # --------------------------------------------------------

    @admin.display(
        description="Submission Overview",
    )
    def submission_summary(self, obj):
        total = obj.submissions.count()

        graded = obj.submissions.filter(
            status="graded"
        ).count()

        pending = total - graded

        return format_html(
            """
            <div style="
                display:grid;
                grid-template-columns:
                    repeat(3,minmax(120px,1fr));
                gap:12px;
                max-width:700px;
            ">

                <div style="
                    padding:16px;
                    border-radius:12px;
                    background:#f5f3ff;
                    border:1px solid #ddd6fe;
                ">
                    <div style="
                        font-size:12px;
                        color:#6b7280;
                        font-weight:600;
                    ">
                        Total
                    </div>

                    <div style="
                        margin-top:4px;
                        font-size:24px;
                        font-weight:800;
                        color:#6d28d9;
                    ">
                        {}
                    </div>
                </div>

                <div style="
                    padding:16px;
                    border-radius:12px;
                    background:#fffbeb;
                    border:1px solid #fde68a;
                ">
                    <div style="
                        font-size:12px;
                        color:#6b7280;
                        font-weight:600;
                    ">
                        Pending
                    </div>

                    <div style="
                        margin-top:4px;
                        font-size:24px;
                        font-weight:800;
                        color:#d97706;
                    ">
                        {}
                    </div>
                </div>

                <div style="
                    padding:16px;
                    border-radius:12px;
                    background:#ecfdf5;
                    border:1px solid #a7f3d0;
                ">
                    <div style="
                        font-size:12px;
                        color:#6b7280;
                        font-weight:600;
                    ">
                        Graded
                    </div>

                    <div style="
                        margin-top:4px;
                        font-size:24px;
                        font-weight:800;
                        color:#047857;
                    ">
                        {}
                    </div>
                </div>

            </div>
            """,
            total,
            pending,
            graded,
        )


# ============================================================
# SUBMISSION ADMIN
# ============================================================


@admin.register(Submission)
class SubmissionAdmin(ModelAdmin):

    form = SubmissionAdminForm

    list_display = (
        "student_display",
        "assignment_display",
        "status_display",
        "score_display",
        "attachment_display",
        "graded_at",
        "created_at",
    )

    list_filter = (
        "status",
        "assignment",
        "graded_at",
        "created_at",
    )

    search_fields = (
        "student__email",
        "student__first_name",
        "student__last_name",
        "assignment__title",
        "assignment__course__title",
        "feedback",
        "text",
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
        "attachment_preview",
        "submission_information",
    )

    fieldsets = (
        (
            "Submission Information",
            {
                "fields": (
                    "submission_information",
                    "assignment",
                    "enrollment",
                    "student",
                ),
            },
        ),
        (
            "Student Answer",
            {
                "fields": (
                    "text",
                    "attachment",
                    "attachment_preview",
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
                "classes": ("collapse",),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    # --------------------------------------------------------
    # STUDENT
    # --------------------------------------------------------

    @admin.display(
        description="Student",
        ordering="student__email",
    )
    def student_display(self, obj):
        name = (
            f"{obj.student.first_name} "
            f"{obj.student.last_name}"
        ).strip()

        if not name:
            name = obj.student.email

        return format_html(
            """
            <div>
                <div style="
                    font-weight:700;
                    color:#111827;
                ">
                    {}
                </div>

                <div style="
                    margin-top:2px;
                    font-size:12px;
                    color:#6b7280;
                ">
                    {}
                </div>
            </div>
            """,
            name,
            obj.student.email,
        )

    # --------------------------------------------------------
    # ASSIGNMENT
    # --------------------------------------------------------

    @admin.display(
        description="Assignment",
        ordering="assignment__title",
    )
    def assignment_display(self, obj):
        return format_html(
            '<span style="'
            "font-weight:700;"
            "color:#374151;"
            '">'
            "{}"
            "</span>",
            obj.assignment.title,
        )

    # --------------------------------------------------------
    # STATUS
    # --------------------------------------------------------

    @admin.display(
        description="Status",
        ordering="status",
    )
    def status_display(self, obj):
        status = obj.status

        if status == "graded":
            return format_html(
                '<span style="'
                "display:inline-flex;"
                "padding:5px 11px;"
                "border-radius:999px;"
                "background:#ecfdf5;"
                "color:#047857;"
                "font-size:12px;"
                "font-weight:800;"
                '">'
                "✓ Graded"
                "</span>"
            )

        if status == "returned":
            return format_html(
                '<span style="'
                "display:inline-flex;"
                "padding:5px 11px;"
                "border-radius:999px;"
                "background:#eff6ff;"
                "color:#1d4ed8;"
                "font-size:12px;"
                "font-weight:800;"
                '">'
                "↩ Returned"
                "</span>"
            )

        return format_html(
            '<span style="'
            "display:inline-flex;"
            "padding:5px 11px;"
            "border-radius:999px;"
            "background:#fffbeb;"
            "color:#b45309;"
            "font-size:12px;"
            "font-weight:800;"
            '">'
            "● Submitted"
            "</span>"
        )

    # --------------------------------------------------------
    # SCORE
    # --------------------------------------------------------

    @admin.display(
        description="Score",
        ordering="score",
    )
    def score_display(self, obj):
        if obj.score is None:
            return format_html(
                '<span style="'
                "color:#9ca3af;"
                "font-weight:600;"
                '">'
                "Not graded"
                "</span>"
            )

        max_score = obj.assignment.max_score
        score = obj.score

        percentage = (
            (score / max_score) * 100
            if max_score
            else 0
        )

        if percentage >= 80:
            background = "#ecfdf5"
            color = "#047857"
        elif percentage >= 50:
            background = "#fffbeb"
            color = "#b45309"
        else:
            background = "#fef2f2"
            color = "#dc2626"

        return format_html(
            '<span style="'
            "display:inline-flex;"
            "padding:5px 11px;"
            "border-radius:999px;"
            "background:{};"
            "color:{};"
            "font-weight:800;"
            '">'
            "{}/{} ({:.0f}%)"
            "</span>",
            background,
            color,
            score,
            max_score,
            percentage,
        )

    # --------------------------------------------------------
    # ATTACHMENT
    # --------------------------------------------------------

    @admin.display(
        description="Attachment",
    )
    def attachment_display(self, obj):
        if not obj.attachment:
            return format_html(
                '<span style="'
                "color:#9ca3af;"
                "font-size:12px;"
                '">'
                "No file"
                "</span>"
            )

        return format_html(
            '<a href="{}" target="_blank" '
            'style="'
            "display:inline-flex;"
            "align-items:center;"
            "gap:5px;"
            "padding:5px 10px;"
            "border-radius:8px;"
            "background:#eff6ff;"
            "color:#2563eb;"
            "font-size:12px;"
            "font-weight:700;"
            "text-decoration:none;"
            '">'
            "↗ View File"
            "</a>",
            obj.attachment.url,
        )

    # --------------------------------------------------------
    # SUBMISSION INFORMATION
    # --------------------------------------------------------

    @admin.display(
        description="Submission Details",
    )
    def submission_information(self, obj):
        submitted_at = obj.created_at.strftime(
            "%d %b %Y, %I:%M %p"
        )

        return format_html(
            """
            <div style="
                display:grid;
                grid-template-columns:
                    repeat(2,minmax(180px,1fr));
                gap:12px;
                max-width:760px;
            ">

                <div style="
                    padding:14px;
                    border-radius:12px;
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                ">
                    <div style="
                        font-size:11px;
                        color:#6b7280;
                        font-weight:700;
                        text-transform:uppercase;
                    ">
                        Student
                    </div>

                    <div style="
                        margin-top:5px;
                        color:#111827;
                        font-weight:700;
                    ">
                        {}
                    </div>
                </div>

                <div style="
                    padding:14px;
                    border-radius:12px;
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                ">
                    <div style="
                        font-size:11px;
                        color:#6b7280;
                        font-weight:700;
                        text-transform:uppercase;
                    ">
                        Assignment
                    </div>

                    <div style="
                        margin-top:5px;
                        color:#111827;
                        font-weight:700;
                    ">
                        {}
                    </div>
                </div>

                <div style="
                    padding:14px;
                    border-radius:12px;
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                ">
                    <div style="
                        font-size:11px;
                        color:#6b7280;
                        font-weight:700;
                        text-transform:uppercase;
                    ">
                        Maximum Score
                    </div>

                    <div style="
                        margin-top:5px;
                        color:#2563eb;
                        font-weight:800;
                    ">
                        {} points
                    </div>
                </div>

                <div style="
                    padding:14px;
                    border-radius:12px;
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                ">
                    <div style="
                        font-size:11px;
                        color:#6b7280;
                        font-weight:700;
                        text-transform:uppercase;
                    ">
                        Submitted
                    </div>

                    <div style="
                        margin-top:5px;
                        color:#111827;
                        font-weight:700;
                    ">
                        {}
                    </div>
                </div>

            </div>
            """,
            obj.student.email,
            obj.assignment.title,
            obj.assignment.max_score,
            submitted_at,
        )

    # --------------------------------------------------------
    # ATTACHMENT PREVIEW
    # --------------------------------------------------------

    @admin.display(
        description="Attachment Preview",
    )
    def attachment_preview(self, obj):
        if not obj.attachment:
            return format_html(
                '<span style="color:#9ca3af;">'
                "No attachment submitted."
                "</span>"
            )

        file_url = obj.attachment.url
        file_name = obj.attachment.name.split("/")[-1]

        return format_html(
            """
            <div style="
                max-width:700px;
                padding:16px;
                border-radius:12px;
                border:1px solid #e5e7eb;
                background:#f9fafb;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:12px;
                ">

                    <div>
                        <div style="
                            font-weight:800;
                            color:#111827;
                        ">
                            📎 {}
                        </div>

                        <div style="
                            margin-top:4px;
                            font-size:12px;
                            color:#6b7280;
                        ">
                            Student attachment
                        </div>
                    </div>

                    <a
                        href="{}"
                        target="_blank"
                        style="
                            display:inline-flex;
                            align-items:center;
                            padding:8px 14px;
                            border-radius:9px;
                            background:#2563eb;
                            color:white;
                            font-size:12px;
                            font-weight:700;
                            text-decoration:none;
                        "
                    >
                        Open / Download
                    </a>

                </div>

            </div>
            """,
            file_name,
            file_url,
        )

    # --------------------------------------------------------
    # SAVE / GRADING LOGIC
    # --------------------------------------------------------

    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):
        status = form.cleaned_data.get("status")

        if status == "graded":
            if not obj.graded_by:
                obj.graded_by = request.user

            if not obj.graded_at:
                obj.graded_at = timezone.now()

        else:
            obj.graded_by = None
            obj.graded_at = None

        super().save_model(
            request,
            obj,
            form,
            change,
        )