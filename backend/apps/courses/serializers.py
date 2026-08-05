from rest_framework import serializers

from .models import (
    Category,
    Course,
    CourseFeature,
    LearningOutcome,
    Requirement,
)
from .services import (
    create_category,
    create_course,
    update_category,
    update_course,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "slug",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        return create_category(
            validated_data=validated_data,
        )

    def update(self, instance, validated_data):
        return update_category(
            category=instance,
            validated_data=validated_data,
        )


class CourseFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseFeature
        fields = (
            "id",
            "title",
        )

        read_only_fields = (
            "id",
        )


class LearningOutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningOutcome
        fields = (
            "id",
            "title",
        )

        read_only_fields = (
            "id",
        )


class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirement
        fields = (
            "id",
            "title",
        )

        read_only_fields = (
            "id",
        )

class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(
        read_only=True,
    )

    instructor_name = serializers.CharField(
        source="instructor.full_name",
        read_only=True,
    )

    class Meta:
        model = Course

        fields = (
            "id",
            "title",
            "slug",
            "subtitle",
            "short_description",
            "thumbnail",
            "category",
            "instructor_name",
            "level",
            "language",
            "duration",
            "price",
            "discount_price",
            "status",
            "is_featured",
            "is_published",
            "published_at",
            "created_at",
        )

        read_only_fields = fields

class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(
        read_only=True,
    )

    instructor_id = serializers.UUIDField(
        source="instructor.id",
        read_only=True,
    )

    instructor_name = serializers.CharField(
        source="instructor.full_name",
        read_only=True,
    )

    instructor_email = serializers.EmailField(
        source="instructor.email",
        read_only=True,
    )

    features = CourseFeatureSerializer(
        many=True,
        read_only=True,
    )

    learning_outcomes = LearningOutcomeSerializer(
        many=True,
        read_only=True,
    )

    requirements = RequirementSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Course

        fields = (
            "id",
            "title",
            "slug",
            "subtitle",
            "short_description",
            "description",
            "thumbnail",
            "intro_video",
            "category",
            "instructor_id",
            "instructor_name",
            "instructor_email",
            "level",
            "language",
            "duration",
            "price",
            "discount_price",
            "features",
            "learning_outcomes",
            "requirements",
            "status",
            "is_featured",
            "is_published",
            "published_at",
            "meta_title",
            "meta_description",
            "created_at",
            "updated_at",
        )

        read_only_fields = fields

class CreateCourseSerializer(serializers.ModelSerializer):
    features = CourseFeatureSerializer(
        many=True,
        required=False,
    )

    learning_outcomes = LearningOutcomeSerializer(
        many=True,
        required=False,
    )

    requirements = RequirementSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Course

        fields = (
            "title",
            "subtitle",
            "short_description",
            "description",
            "thumbnail",
            "intro_video",
            "category",
            "level",
            "language",
            "duration",
            "price",
            "discount_price",
            "features",
            "learning_outcomes",
            "requirements",
            "meta_title",
            "meta_description",
        )

    def validate(self, attrs):
        price = attrs.get("price")
        discount_price = attrs.get("discount_price")

        if (
            discount_price is not None
            and discount_price > price
        ):
            raise serializers.ValidationError(
                {
                    "discount_price": (
                        "Discount price cannot be greater than price."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        features = validated_data.pop(
            "features",
            [],
        )

        learning_outcomes = validated_data.pop(
            "learning_outcomes",
            [],
        )

        requirements = validated_data.pop(
            "requirements",
            [],
        )

        validated_data["instructor"] = (
            self.context["request"].user
        )

        course = create_course(
            validated_data=validated_data,
        )

        CourseFeature.objects.bulk_create(
            [
                CourseFeature(
                    course=course,
                    **feature,
                )
                for feature in features
            ]
        )

        LearningOutcome.objects.bulk_create(
            [
                LearningOutcome(
                    course=course,
                    **item,
                )
                for item in learning_outcomes
            ]
        )

        Requirement.objects.bulk_create(
            [
                Requirement(
                    course=course,
                    **item,
                )
                for item in requirements
            ]
        )

        return course

class UpdateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course

        fields = (
            "title",
            "subtitle",
            "short_description",
            "description",
            "thumbnail",
            "intro_video",
            "category",
            "level",
            "language",
            "duration",
            "price",
            "discount_price",
            "status",
            "is_featured",
            "is_published",
            "is_active",
            "meta_title",
            "meta_description",
        )

    def validate(self, attrs):
        price = attrs.get(
            "price",
            self.instance.price,
        )

        discount_price = attrs.get(
            "discount_price",
            self.instance.discount_price,
        )

        if (
            discount_price is not None
            and discount_price > price
        ):
            raise serializers.ValidationError(
                {
                    "discount_price": (
                        "Discount price cannot be greater than price."
                    )
                }
            )

        return attrs

    def update(self, instance, validated_data):
        return update_course(
            course=instance,
            validated_data=validated_data,
        )