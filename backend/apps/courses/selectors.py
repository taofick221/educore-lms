from django.shortcuts import get_object_or_404

from .choices import CourseStatus
from .models import (
    Category,
    Course,
)


def get_category_by_id(category_id):
    """
    Retrieve a category by ID.
    """

    return get_object_or_404(
        Category,
        id=category_id,
        is_active=True,
    )


def get_category_by_slug(slug):
    """
    Retrieve a category by slug.
    """

    return get_object_or_404(
        Category,
        slug=slug,
        is_active=True,
    )


def get_course_by_id(course_id):
    """
    Retrieve a course by ID.
    """

    return get_object_or_404(
        Course.objects.select_related(
            "category",
            "instructor",
        ),
        id=course_id,
        is_active=True,
    )


def get_course_by_slug(slug):
    """
    Retrieve a course by slug.
    """

    return get_object_or_404(
        Course.objects.select_related(
            "category",
            "instructor",
        ),
        slug=slug,
        is_active=True,
    )
def get_courses():
    """
    Retrieve all active courses.
    """

    return (
        Course.objects.active()
        .select_related(
            "category",
            "instructor",
        )
        .prefetch_related(
            "features",
            "learning_outcomes",
            "requirements",
        )
    )


def get_published_courses():
    """
    Retrieve published courses.
    """

    return (
        get_courses()
        .filter(
            status=CourseStatus.PUBLISHED,
            is_published=True,
        )
    )


def get_featured_courses():
    """
    Retrieve featured courses.
    """

    return (
        get_published_courses()
        .filter(
            is_featured=True,
        )
    )


def get_instructor_courses(instructor):
    """
    Retrieve courses created by an instructor.
    """

    return (
        get_courses()
        .filter(
            instructor=instructor,
        )
    )


def get_category_courses(category):
    """
    Retrieve all courses in a category.
    """

    return (
        get_published_courses()
        .filter(
            category=category,
        )
    )