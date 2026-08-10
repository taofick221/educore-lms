from rest_framework import serializers

from .models import (
    Category,
    Course,
    CourseFeature,
    LearningOutcome,
    Lecture,
    Requirement,
    Resource,
    Section,
)
from .services import (
    create_category,
    create_course,
    create_lecture,
    create_resource,
    create_section,
    update_category,
    update_course,
    update_lecture,
    update_resource,
    update_section,
)


# ==========================================================
# Category Serializer
# ==========================================================


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


# ==========================================================
# Course Feature Serializer
# ==========================================================


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


# ==========================================================
# Learning Outcome Serializer
# ==========================================================


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


# ==========================================================
# Requirement Serializer
# ==========================================================


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


# ==========================================================
# Resource Serializer
# ==========================================================


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource

        fields = (
            "id",
            "title",
            "resource_type",
            "file",
            "external_url",
            "order",
            "is_active",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        return create_resource(
            validated_data=validated_data,
        )

    def update(self, instance, validated_data):
        return update_resource(
            resource=instance,
            validated_data=validated_data,
        )

# ==========================================================
# Lecture Serializer
# ==========================================================


class LectureSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Lecture

        fields = (
            "id",
            "title",
            "slug",
            "description",
            "video_url",
            "duration",
            "order",
            "is_preview",
            "is_active",
            "is_published",
            "resources",
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
        return create_lecture(
            validated_data=validated_data,
        )

    def update(self, instance, validated_data):
        return update_lecture(
            lecture=instance,
            validated_data=validated_data,
        )


# ==========================================================
# Section Serializer
# ==========================================================


class SectionSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Section

        fields = (
            "id",
            "title",
            "slug",
            "description",
            "order",
            "is_active",
            "is_published",
            "lectures",
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
        return create_section(
            validated_data=validated_data,
        )

    def update(self, instance, validated_data):
        return update_section(
            section=instance,
            validated_data=validated_data,
        )

# ==========================================================
# Course List Serializer
# ==========================================================


class CourseListSerializer(serializers.ModelSerializer):
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
            "instructor_id",
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


# ==========================================================
# Course Detail Serializer
# ==========================================================


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

    sections = SectionSerializer(
        many=True,
        read_only=True,
    )

    total_sections = serializers.SerializerMethodField()

    total_lectures = serializers.SerializerMethodField()

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
            "sections",
            "total_sections",
            "total_lectures",
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

    def get_total_sections(self, obj):
        return obj.sections.count()

    def get_total_lectures(self, obj):
        return Lecture.objects.filter(
            section__course=obj,
        ).count()

# ==========================================================
# Create Course Serializer
# ==========================================================


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

        if features:
            CourseFeature.objects.bulk_create(
                [
                    CourseFeature(
                        course=course,
                        **feature,
                    )
                    for feature in features
                ]
            )

        if learning_outcomes:
            LearningOutcome.objects.bulk_create(
                [
                    LearningOutcome(
                        course=course,
                        **item,
                    )
                    for item in learning_outcomes
                ]
            )

        if requirements:
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

# ==========================================================
# Update Course Serializer
# ==========================================================


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


# ==========================================================
# Create Section Serializer
# ==========================================================


class CreateSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section

        fields = (
            "course",
            "title",
            "description",
            "order",
            "is_active",
            "is_published",
        )

    def create(self, validated_data):
        return create_section(
            validated_data=validated_data,
        )


# ==========================================================
# Update Section Serializer
# ==========================================================


class UpdateSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section

        fields = (
            "title",
            "description",
            "order",
            "is_active",
            "is_published",
        )

    def update(self, instance, validated_data):
        return update_section(
            section=instance,
            validated_data=validated_data,
        )

# ==========================================================
# Create Lecture Serializer
# ==========================================================


class CreateLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture

        fields = (
            "section",
            "title",
            "description",
            "video_url",
            "duration",
            "order",
            "is_preview",
            "is_active",
            "is_published",
        )

    def create(self, validated_data):
        return create_lecture(
            validated_data=validated_data,
        )


# ==========================================================
# Update Lecture Serializer
# ==========================================================


class UpdateLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture

        fields = (
            "title",
            "description",
            "video_url",
            "duration",
            "order",
            "is_preview",
            "is_active",
            "is_published",
        )

    def update(self, instance, validated_data):
        return update_lecture(
            lecture=instance,
            validated_data=validated_data,
        )


# ==========================================================
# Create Resource Serializer
# ==========================================================


class CreateResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource

        fields = (
            "lecture",
            "title",
            "resource_type",
            "file",
            "external_url",
            "order",
            "is_active",
        )

    def create(self, validated_data):
        return create_resource(
            validated_data=validated_data,
        )


# ==========================================================
# Update Resource Serializer
# ==========================================================


class UpdateResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource

        fields = (
            "title",
            "resource_type",
            "file",
            "external_url",
            "order",
            "is_active",
        )

    def update(self, instance, validated_data):
        return update_resource(
            resource=instance,
            validated_data=validated_data,
        )

