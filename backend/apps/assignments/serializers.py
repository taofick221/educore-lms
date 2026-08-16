from rest_framework import serializers

from .models import Assignment, Submission


class AssignmentSerializer(
    serializers.ModelSerializer,
):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model = Assignment

        fields = (
            "id",
            "course",
            "course_title",
            "title",
            "description",
            "max_score",
            "due_at",
            "is_published",
        )

        read_only_fields = fields


class SubmissionSerializer(
    serializers.ModelSerializer,
):
    assignment_title = serializers.CharField(
        source="assignment.title",
        read_only=True,
    )

    max_score = serializers.IntegerField(
        source="assignment.max_score",
        read_only=True,
    )

    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Submission

        fields = (
            "id",
            "assignment",
            "assignment_title",
            "text",
            "attachment",
            "attachment_url",
            "status",
            "score",
            "max_score",
            "feedback",
            "graded_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "assignment",
            "assignment_title",
            "attachment_url",
            "status",
            "score",
            "max_score",
            "feedback",
            "graded_at",
            "created_at",
            "updated_at",
        )

    def get_attachment_url(
        self,
        obj,
    ):
        if not obj.attachment:
            return None

        request = self.context.get(
            "request",
        )

        if request:
            return request.build_absolute_uri(
                obj.attachment.url,
            )

        return obj.attachment.url


class SubmissionCreateSerializer(
    serializers.ModelSerializer,
):
    class Meta:
        model = Submission

        fields = (
            "text",
            "attachment",
        )

    def validate(self, attrs):
        text = (
            attrs.get("text", "")
            .strip()
        )

        attachment = attrs.get(
            "attachment",
        )

        if not text and not attachment:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "Please provide an answer "
                        "or attach a file before submitting."
                    )
                }
            )

        attrs["text"] = text

        return attrs

    def validate_attachment(
        self,
        value,
    ):
        max_size = 10 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Attachment size cannot exceed 10 MB."
            )

        return value


class GradeSubmissionSerializer(
    serializers.Serializer,
):
    score = serializers.IntegerField(
        min_value=0,
    )

    feedback = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    def validate_score(self, value):
        submission = self.context.get(
            "submission",
        )

        if (
            submission
            and value
            > submission.assignment.max_score
        ):
            raise serializers.ValidationError(
                (
                    "Score cannot be greater than "
                    f"{submission.assignment.max_score}."
                )
            )

        return value