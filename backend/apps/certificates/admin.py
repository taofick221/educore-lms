from django.contrib import admin
from django.utils.html import format_html

from unfold.admin import ModelAdmin

from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(ModelAdmin):
    list_display = (
        "certificate_number_display",
        "student_display",
        "course_display",
        "issued_at",
        "verification_status",
    )

    list_filter = (
        "issued_at",
    )

    search_fields = (
        "certificate_number",
        "verification_code",
        "enrollment__student__email",
        "enrollment__student__first_name",
        "enrollment__student__last_name",
        "enrollment__course__title",
    )

    autocomplete_fields = (
        "enrollment",
    )

    readonly_fields = (
        "id",
        "certificate_number",
        "verification_code",
        "issued_at",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Certificate Information",
            {
                "fields": (
                    "certificate_number",
                    "enrollment",
                    "issued_at",
                ),
            },
        ),
        (
            "Verification",
            {
                "fields": (
                    "verification_code",
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

    @admin.display(description="Certificate")
    def certificate_number_display(self, obj):
        return format_html(
            '<span style="font-weight:600;">{}</span>',
            obj.certificate_number,
        )

    @admin.display(description="Student")
    def student_display(self, obj):
        return obj.enrollment.student.email

    @admin.display(description="Course")
    def course_display(self, obj):
        return obj.enrollment.course.title

    @admin.display(description="Status")
    def verification_status(self, obj):
        return format_html(
            '<span style="color:#059669;font-weight:600;">'
            "Verified"
            "</span>"
        )