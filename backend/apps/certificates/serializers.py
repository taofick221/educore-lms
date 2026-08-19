from rest_framework import serializers

from .models import Certificate


class CertificateSerializer(
    serializers.ModelSerializer,
):
    student_name = serializers.CharField(
        source="enrollment.student.full_name",
        read_only=True,
    )

    student_email = serializers.EmailField(
        source="enrollment.student.email",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="enrollment.course.title",
        read_only=True,
    )

    class Meta:
        model = Certificate
        fields = (
            "id",
            "certificate_number",
            "verification_code",
            "student_name",
            "student_email",
            "course_title",
            "issued_at",
        )
        read_only_fields = fields