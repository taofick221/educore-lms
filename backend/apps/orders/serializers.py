from rest_framework import serializers

from apps.courses.choices import CourseStatus
from apps.courses.models import Course
from apps.enrollments.models import Enrollment

from .choices import PaymentMethod
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "course",
            "course_title",
            "price",
        )
        read_only_fields = (
            "id",
            "course_title",
            "price",
        )


class OrderListSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "payment_method",
            "transaction_reference",
            "total_amount",
            "payment_verified",
            "items",
            "created_at",
        )
        read_only_fields = fields


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    student_email = serializers.EmailField(
        source="student.email",
        read_only=True,
    )

    verified_by_email = serializers.EmailField(
        source="verified_by.email",
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "student_email",
            "status",
            "payment_method",
            "transaction_reference",
            "total_amount",
            "payment_verified",
            "verified_by_email",
            "verified_at",
            "notes",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class CreateOrderSerializer(serializers.Serializer):
    courses = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.filter(
            is_active=True,
            is_published=True,
            status=CourseStatus.PUBLISHED,
        ),
        many=True,
        write_only=True,
    )

    payment_method = serializers.ChoiceField(
        choices=PaymentMethod.choices,
    )

    transaction_reference = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )

    notes = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
    )

    def validate_courses(self, courses):
        student = self.context["request"].user

        unique_courses = {
            course.id: course
            for course in courses
        }

        if len(unique_courses) != len(courses):
            raise serializers.ValidationError(
                "Duplicate courses are not allowed."
            )

        for course in courses:
            if course.instructor_id == student.id:
                raise serializers.ValidationError(
                    f"You cannot purchase your own course: "
                    f"{course.title}"
                )

            if Enrollment.objects.filter(
                student=student,
                course=course,
            ).exists():
                raise serializers.ValidationError(
                    f"You are already enrolled in: "
                    f"{course.title}"
                )

        return list(unique_courses.values())