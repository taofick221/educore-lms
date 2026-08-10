from django.db import transaction
from django.utils import timezone

from .choices import CourseStatus
from .models import (
    Category,
    Course,
    Lecture,
    Resource,
    Section,
)


# ==========================================================
# Category Services
# ==========================================================


@transaction.atomic
def create_category(*, validated_data):
    """
    Create a new category.
    """

    return Category.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_category(*, category, validated_data):
    """
    Update category.
    """

    for field, value in validated_data.items():
        setattr(
            category,
            field,
            value,
        )

    category.save()

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
def deactivate_category(*, category):
    """
    Deactivate category.
    """

    category.is_active = False

    category.save(
        update_fields=[
            "is_active",
        ],
    )

    return category


# ==========================================================
# Course Services
# ==========================================================


@transaction.atomic
def create_course(*, validated_data):
    """
    Create course.
    """

    return Course.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_course(*, course, validated_data):
    """
    Update course.
    """

    for field, value in validated_data.items():
        setattr(
            course,
            field,
            value,
        )

    course.save()

    return course


@transaction.atomic
def publish_course(*, course):
    """
    Publish course.
    """

    course.status = CourseStatus.PUBLISHED
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

    course.status = CourseStatus.DRAFT
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

# ==========================================================
# Course Management Services
# ==========================================================


@transaction.atomic
def archive_course(*, course):
    """
    Archive course.
    """

    course.status = CourseStatus.ARCHIVED
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


# ==========================================================
# Section Services
# ==========================================================


@transaction.atomic
def create_section(*, validated_data):
    """
    Create section.
    """

    return Section.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_section(*, section, validated_data):
    """
    Update section.
    """

    for field, value in validated_data.items():
        setattr(
            section,
            field,
            value,
        )

    section.save()

    return section


@transaction.atomic
def publish_section(*, section):
    """
    Publish section.
    """

    section.is_published = True

    section.save(
        update_fields=[
            "is_published",
        ],
    )

    return section


@transaction.atomic
def unpublish_section(*, section):
    """
    Unpublish section.
    """

    section.is_published = False

    section.save(
        update_fields=[
            "is_published",
        ],
    )

    return section

# ==========================================================
# Lecture Services
# ==========================================================


@transaction.atomic
def create_lecture(*, validated_data):
    """
    Create lecture.
    """

    return Lecture.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_lecture(*, lecture, validated_data):
    """
    Update lecture.
    """

    for field, value in validated_data.items():
        setattr(
            lecture,
            field,
            value,
        )

    lecture.save()

    return lecture


@transaction.atomic
def publish_lecture(*, lecture):
    """
    Publish lecture.
    """

    lecture.is_published = True

    lecture.save(
        update_fields=[
            "is_published",
        ],
    )

    return lecture


@transaction.atomic
def unpublish_lecture(*, lecture):
    """
    Unpublish lecture.
    """

    lecture.is_published = False

    lecture.save(
        update_fields=[
            "is_published",
        ],
    )

    return lecture


# ==========================================================
# Resource Services
# ==========================================================


@transaction.atomic
def create_resource(*, validated_data):
    """
    Create resource.
    """

    return Resource.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_resource(*, resource, validated_data):
    """
    Update resource.
    """

    for field, value in validated_data.items():
        setattr(
            resource,
            field,
            value,
        )

    resource.save()

    return resource


@transaction.atomic
def activate_resource(*, resource):
    """
    Activate resource.
    """

    resource.is_active = True

    resource.save(
        update_fields=[
            "is_active",
        ],
    )

    return resource


@transaction.atomic
def deactivate_resource(*, resource):
    """
    Deactivate resource.
    """

    resource.is_active = False

    resource.save(
        update_fields=[
            "is_active",
        ],
    )

    return resource

