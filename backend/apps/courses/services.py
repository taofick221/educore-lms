from django.db import transaction

from .models import (
    Category,
    Course,
)
from django.db import transaction
from django.utils import timezone



@transaction.atomic
def create_category(*, validated_data):
    """
    Create a new course category.
    """

    return Category.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_category(*, category, validated_data):
    """
    Update category information.
    """

    for field, value in validated_data.items():
        setattr(category, field, value)

    category.save()

    return category


@transaction.atomic
def deactivate_category(*, category):
    """
    Soft deactivate category.
    """

    category.is_active = False

    category.save(
        update_fields=[
            "is_active",
        ],
    )

    return category


@transaction.atomic
def activate_category(*, category):
    """
    Activate category.
    """

    category.is_active = True

    category.save(
        update_fields=[
            "is_active",
        ],
    )

    return category


@transaction.atomic
def create_course(*, validated_data):
    """
    Create a new course.
    """

    return Course.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_course(*, course, validated_data):
    """
    Update course information.
    """

    for field, value in validated_data.items():
        setattr(course, field, value)

    course.save()

    return course


@transaction.atomic
def publish_course(*, course):
    """
    Publish course.
    """

    course.status = "published"
    course.is_published = True
    course.published_at = timezone.now()

    course.save(
        update_fields=[
            "status",
            "is_published",
            "published_at",
        ],
    )

    return course


@transaction.atomic
def unpublish_course(*, course):
    """
    Unpublish course.
    """

    course.status = "draft"
    course.is_published = False
    course.published_at = None

    course.save(
        update_fields=[
            "status",
            "is_published",
            "published_at",
        ],
    )

    return course


@transaction.atomic
def archive_course(*, course):
    """
    Archive course.
    """

    course.status = "archived"
    course.is_active = False

    course.save(
        update_fields=[
            "status",
            "is_active",
        ],
    )

    return course


@transaction.atomic
def feature_course(*, course):
    """
    Mark course as featured.
    """

    course.is_featured = True

    course.save(
        update_fields=[
            "is_featured",
        ],
    )

    return course


@transaction.atomic
def unfeature_course(*, course):
    """
    Remove featured status.
    """

    course.is_featured = False

    course.save(
        update_fields=[
            "is_featured",
        ],
    )

    return course