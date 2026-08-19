from rest_framework import serializers

from apps.courses.serializers import CourseListSerializer


class InstructorDashboardSerializer(
    serializers.Serializer,
):
    course_count = serializers.IntegerField()
    published_course_count = serializers.IntegerField()
    student_count = serializers.IntegerField()
    enrollment_count = serializers.IntegerField()
    completed_enrollment_count = serializers.IntegerField()
    revenue = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )


class InstructorCourseSerializer(
    CourseListSerializer,
):
    """
    Lightweight course representation for
    the instructor course list.
    """

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields