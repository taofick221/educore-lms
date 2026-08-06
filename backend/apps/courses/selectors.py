from django.shortcuts import get_object_or_404

from .choices import CourseStatus
from .models import (
    Category,
    Course,
    Lecture,
    Resource,
    Section,
)


# ==========================================================
# Category Selectors
# ==========================================================


def get_categories():
    """
    Retrieve all active categories.
    """

    return Category.objects.active()


def get_category_by_id(category_id):
    """
    Retrieve category by ID.
    """

    return get_object_or_404(
        get_categories(),
        id=category_id,
    )


def get_category_by_slug(slug):
    """
    Retrieve category by slug.
    """

    return get_object_or_404(
        get_categories(),
        slug=slug,
    )


# ==========================================================
# Course Selectors
# ==========================================================


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
            "sections",
        )
    )


def get_course_by_id(course_id):
    """
    Retrieve course by ID.
    """

    return get_object_or_404(
        get_courses(),
        id=course_id,
    )


def get_course_by_slug(slug):
    """
    Retrieve course by slug.
    """

    return get_object_or_404(
        get_courses(),
        slug=slug,
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


# ==========================================================
# Course Utility Selectors
# ==========================================================


def get_instructor_courses(instructor):
    """
    Retrieve all courses created by an instructor.
    """

    return (
        get_courses()
        .filter(
            instructor=instructor,
        )
    )


def get_category_courses(category):
    """
    Retrieve all published courses in a category.
    """

    return (
        get_published_courses()
        .filter(
            category=category,
        )
    )


# ==========================================================
# Section Selectors
# ==========================================================


def get_sections():
    """
    Retrieve all active sections.
    """

    return (
        Section.objects.active()
        .select_related(
            "course",
        )
        .prefetch_related(
            "lectures",
        )
    )


def get_section_by_id(section_id):
    """
    Retrieve section by ID.
    """

    return get_object_or_404(
        get_sections(),
        id=section_id,
    )


def get_section_by_slug(slug):
    """
    Retrieve section by slug.
    """

    return get_object_or_404(
        get_sections(),
        slug=slug,
    )


def get_course_sections(course):
    """
    Retrieve all sections of a course.
    """

    return (
        get_sections()
        .filter(
            course=course,
        )
        .order_by(
            "order",
        )
    )


def get_published_sections(course):
    """
    Retrieve published sections of a course.
    """

    return (
        get_course_sections(
            course,
        )
        .filter(
            is_published=True,
        )
    )

# ==========================================================
# Lecture Selectors
# ==========================================================


def get_lectures():
    """
    Retrieve all active lectures.
    """

    return (
        Lecture.objects.active()
        .select_related(
            "section",
            "section__course",
        )
        .prefetch_related(
            "resources",
        )
    )


def get_lecture_by_id(lecture_id):
    """
    Retrieve lecture by ID.
    """

    return get_object_or_404(
        get_lectures(),
        id=lecture_id,
    )


def get_lecture_by_slug(slug):
    """
    Retrieve lecture by slug.
    """

    return get_object_or_404(
        get_lectures(),
        slug=slug,
    )


def get_section_lectures(section):
    """
    Retrieve lectures of a section.
    """

    return (
        get_lectures()
        .filter(
            section=section,
        )
        .order_by(
            "order",
        )
    )


def get_preview_lectures():
    """
    Retrieve preview lectures.
    """

    return (
        get_lectures()
        .filter(
            is_preview=True,
            is_published=True,
        )
    )


# ==========================================================
# Resource Selectors
# ==========================================================


def get_resources():
    """
    Retrieve all active resources.
    """

    return (
        Resource.objects.filter(
            is_active=True,
        )
        .select_related(
            "lecture",
            "lecture__section",
            "lecture__section__course",
        )
    )


def get_resource_by_id(resource_id):
    """
    Retrieve resource by ID.
    """

    return get_object_or_404(
        get_resources(),
        id=resource_id,
    )


def get_lecture_resources(lecture):
    """
    Retrieve resources of a lecture.
    """

    return (
        get_resources()
        .filter(
            lecture=lecture,
        )
        .order_by(
            "order",
        )
    )


def get_resource_by_type(resource_type):
    """
    Retrieve resources by type.
    """

    return (
        get_resources()
        .filter(
            resource_type=resource_type,
        )
    )