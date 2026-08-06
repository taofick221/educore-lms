from rest_framework import serializers

from apps.courses.choices import CourseStatus

from .choices import EnrollmentStatus
from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)
from .services import (
    activate_enrollment,
    cancel_enrollment,
    complete_enrollment,
    create_enrollment,
    create_lesson_progress,
    issue_certificate,
    update_course_completion,
    update_course_progress,
    update_lesson_progress,
)


# ==========================================================
# Enrollment Serializers
# ==========================================================


class EnrollmentListSerializer(
    serializers.ModelSerializer,
):
    student_name = serializers.CharField(
        source="student.get_full_name",
        read_only=True,
    )

    student_email = serializers.EmailField(
        source="student.email",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    progress_percentage = serializers.IntegerField(
        source="course_progress.progress_percentage",
        read_only=True,
    )

    class Meta:
        model = Enrollment

        fields = (
            "id",
            "student_name",
            "student_email",
            "course_title",
            "status",
            "progress_percentage",
            "certificate_issued",
            "is_active",
            "enrolled_at",
        )

        read_only_fields = fields


class EnrollmentDetailSerializer(
    serializers.ModelSerializer,
):
    student_name = serializers.CharField(
        source="student.get_full_name",
        read_only=True,
    )

    student_email = serializers.EmailField(
        source="student.email",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    progress_percentage = serializers.IntegerField(
        source="course_progress.progress_percentage",
        read_only=True,
    )

    class Meta:
        model = Enrollment

        fields = (
            "id",
            "student",
            "student_name",
            "student_email",
            "course",
            "course_title",
            "status",
            "progress_percentage",
            "certificate_issued",
            "is_active",
            "enrolled_at",
            "started_at",
            "completed_at",
            "expires_at",
            "last_accessed_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "student",
            "student_name",
            "student_email",
            "course",
            "course_title",
            "status",
            "progress_percentage",
            "certificate_issued",
            "enrolled_at",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        )


class CreateEnrollmentSerializer(
    serializers.ModelSerializer,
):
    class Meta:
        model = Enrollment

        fields = (
            "course",
        )

    def validate(
        self,
        attrs,
    ):
        student = self.context[
            "request"
        ].user

        course = attrs["course"]

        if not course.is_active:
            raise serializers.ValidationError(
                {
                    "course": (
                        "This course is inactive."
                    )
                }
            )

        if not course.is_published:
            raise serializers.ValidationError(
                {
                    "course": (
                        "This course is not published."
                    )
                }
            )

        if (
            course.status
            != CourseStatus.PUBLISHED
        ):
            raise serializers.ValidationError(
                {
                    "course": (
                        "Course is unavailable."
                    )
                }
            )

        if (
            course.instructor
            == student
        ):
            raise serializers.ValidationError(
                {
                    "course": (
                        "You cannot enroll in your own course."
                    )
                }
            )

        if Enrollment.objects.filter(
            student=student,
            course=course,
        ).exists():
            raise serializers.ValidationError(
                {
                    "course": (
                        "You are already enrolled."
                    )
                }
            )

        return attrs

    def create(
        self,
        validated_data,
    ):
        validated_data[
            "student"
        ] = self.context[
            "request"
        ].user

        return create_enrollment(
            validated_data=validated_data,
        )


class UpdateEnrollmentSerializer(
    serializers.ModelSerializer,
):
    class Meta:
        model = Enrollment

        fields = (
            "status",
            "certificate_issued",
            "is_active",
            "expires_at",
        )

    def update(
        self,
        instance,
        validated_data,
    ):
        status = validated_data.pop(
            "status",
            None,
        )

        if (
            status
            == EnrollmentStatus.ACTIVE
        ):
            activate_enrollment(
                enrollment=instance,
            )

        elif (
            status
            == EnrollmentStatus.COMPLETED
        ):
            complete_enrollment(
                enrollment=instance,
            )

        elif (
            status
            == EnrollmentStatus.CANCELLED
        ):
            cancel_enrollment(
                enrollment=instance,
            )

        if validated_data.pop(
            "certificate_issued",
            False,
        ):
            issue_certificate(
                enrollment=instance,
            )

        for (
            field,
            value,
        ) in validated_data.items():
            setattr(
                instance,
                field,
                value,
            )

        instance.save()

        return instance



# ==========================================================
# Lesson Progress Serializers
# ==========================================================


class LessonProgressSerializer(
    serializers.ModelSerializer,
):
    lecture_title = serializers.CharField(
        source="lecture.title",
        read_only=True,
    )

    section_title = serializers.CharField(
        source="lecture.section.title",
        read_only=True,
    )

    course_title = serializers.CharField(
        source="lecture.section.course.title",
        read_only=True,
    )

    class Meta:
        model = LessonProgress

        fields = (
            "id",
            "lecture",
            "lecture_title",
            "section_title",
            "course_title",
            "last_watched_second",
            "watch_percentage",
            "is_completed",
            "completed_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "completed_at",
            "created_at",
            "updated_at",
        )


class CreateLessonProgressSerializer(
    serializers.ModelSerializer,
):
    class Meta:
        model = LessonProgress

        fields = (
            "enrollment",
            "lecture",
            "last_watched_second",
            "watch_percentage",
        )

    def validate(
        self,
        attrs,
    ):
        enrollment = attrs["enrollment"]

        lecture = attrs["lecture"]

        if (
            lecture.section.course
            != enrollment.course
        ):
            raise serializers.ValidationError(
                {
                    "lecture": (
                        "Lecture does not belong "
                        "to this course."
                    )
                }
            )

        return attrs

    def create(
        self,
        validated_data,
    ):
        return create_lesson_progress(
            validated_data=validated_data,
        )


class UpdateLessonProgressSerializer(
    serializers.ModelSerializer,
):
    class Meta:
        model = LessonProgress

        fields = (
            "last_watched_second",
            "watch_percentage",
        )

    def update(
        self,
        instance,
        validated_data,
    ):
        return update_lesson_progress(
            lesson_progress=instance,
            validated_data=validated_data,
        )


# ==========================================================
# Course Progress Serializers
# ==========================================================


class CourseProgressSerializer(
    serializers.ModelSerializer,
):
    student_name = serializers.CharField(
        source="enrollment.student.get_full_name",
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

    last_completed_lecture_title = (
        serializers.CharField(
            source="last_completed_lecture.title",
            read_only=True,
        )
    )

    class Meta:
        model = CourseProgress

        fields = (
            "id",
            "course_title",
            "student_name",
            "student_email",
            "completed_sections",
            "completed_lectures",
            "total_sections",
            "total_lectures",
            "progress_percentage",
            "last_completed_lecture",
            "last_completed_lecture_title",
            "completed_at",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields


class UpdateCourseProgressSerializer(
    serializers.Serializer,
):
    def update(
        self,
        instance,
        validated_data,
    ):
        return update_course_completion(
            enrollment=instance.enrollment,
        )

    def create(
        self,
        validated_data,
    ):
        raise NotImplementedError


# ==========================================================
# Enrollment Action Serializers
# ==========================================================


class ActivateEnrollmentSerializer(
    serializers.Serializer,
):
    def update(
        self,
        instance,
        validated_data,
    ):
        return activate_enrollment(
            enrollment=instance,
        )

    def create(
        self,
        validated_data,
    ):
        raise NotImplementedError


class CompleteEnrollmentSerializer(
    serializers.Serializer,
):
    def update(
        self,
        instance,
        validated_data,
    ):
        return complete_enrollment(
            enrollment=instance,
        )

    def create(
        self,
        validated_data,
    ):
        raise NotImplementedError


class CancelEnrollmentSerializer(
    serializers.Serializer,
):
    def update(
        self,
        instance,
        validated_data,
    ):
        return cancel_enrollment(
            enrollment=instance,
        )

    def create(
        self,
        validated_data,
    ):
        raise NotImplementedError


class IssueCertificateSerializer(
    serializers.Serializer,
):
    def update(
        self,
        instance,
        validated_data,
    ):
        return issue_certificate(
            enrollment=instance,
        )

    def create(
        self,
        validated_data,
    ):
        raise NotImplementedError