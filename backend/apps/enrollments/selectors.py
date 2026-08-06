from django.shortcuts import get_object_or_404

from .choices import EnrollmentStatus
from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)


# ==========================================================
# Enrollment Selectors
# ==========================================================


def get_enrollments():
    """
    Retrieve all active enrollments.
    """

    return (
        Enrollment.objects.active()
        .select_related(
            "student",
            "course",
            "course__category",
            "course__instructor",
        )
    )


def get_enrollment_by_id(
    enrollment_id,
):
    """
    Retrieve enrollment by ID.
    """

    return get_object_or_404(
        get_enrollments(),
        id=enrollment_id,
    )


def get_student_enrollments(
    student,
):
    """
    Retrieve all enrollments of a student.
    """

    return (
        get_enrollments()
        .filter(
            student=student,
        )
    )


def get_course_enrollments(
    course,
):
    """
    Retrieve all enrollments of a course.
    """

    return (
        get_enrollments()
        .filter(
            course=course,
        )
    )


def get_completed_enrollments():
    """
    Retrieve completed enrollments.
    """

    return (
        get_enrollments()
        .filter(
            status=EnrollmentStatus.COMPLETED,
        )
    )


def get_pending_enrollments():
    """
    Retrieve pending enrollments.
    """

    return (
        get_enrollments()
        .filter(
            status=EnrollmentStatus.PENDING,
        )
    )


def get_active_enrollments():
    """
    Retrieve active enrollments.
    """

    return (
        get_enrollments()
        .filter(
            status=EnrollmentStatus.ACTIVE,
        )
    )


# ==========================================================
# Lesson Progress Selectors
# ==========================================================


def get_lesson_progress():
    """
    Retrieve all lesson progress records.
    """

    return (
        LessonProgress.objects.select_related(
            "enrollment",
            "enrollment__student",
            "enrollment__course",
            "lecture",
            "lecture__section",
        )
    )


def get_lesson_progress_by_id(
    progress_id,
):
    """
    Retrieve lesson progress by ID.
    """

    return get_object_or_404(
        get_lesson_progress(),
        id=progress_id,
    )


def get_enrollment_lesson_progress(
    enrollment,
):
    """
    Retrieve all lesson progress of an enrollment.
    """

    return (
        get_lesson_progress()
        .filter(
            enrollment=enrollment,
        )
        .order_by(
            "lecture__section__order",
            "lecture__order",
        )
    )


def get_completed_lessons(
    enrollment,
):
    """
    Retrieve completed lessons.
    """

    return (
        get_enrollment_lesson_progress(
            enrollment,
        )
        .filter(
            is_completed=True,
        )
    )


def get_incomplete_lessons(
    enrollment,
):
    """
    Retrieve incomplete lessons.
    """

    return (
        get_enrollment_lesson_progress(
            enrollment,
        )
        .filter(
            is_completed=False,
        )
    )


def get_lecture_progress(
    enrollment,
    lecture,
):
    """
    Retrieve progress for a specific lecture.
    """

    return get_object_or_404(
        LessonProgress,
        enrollment=enrollment,
        lecture=lecture,
    )


# ==========================================================
# Course Progress Selectors
# ==========================================================


def get_course_progress():
    """
    Retrieve all course progress records.
    """

    return (
        CourseProgress.objects.select_related(
            "enrollment",
            "enrollment__student",
            "enrollment__course",
            "last_completed_lecture",
        )
    )


def get_course_progress_by_id(
    progress_id,
):
    """
    Retrieve course progress by ID.
    """

    return get_object_or_404(
        get_course_progress(),
        id=progress_id,
    )


def get_enrollment_course_progress(
    enrollment,
):
    """
    Retrieve course progress for an enrollment.
    """

    return get_object_or_404(
        get_course_progress(),
        enrollment=enrollment,
    )


def get_completed_course_progress():
    """
    Retrieve completed course progress.
    """

    return (
        get_course_progress()
        .completed()
    )


def get_in_progress_courses():
    """
    Retrieve courses that are currently in progress.
    """

    return (
        get_course_progress()
        .in_progress()
    )


def get_not_started_courses():
    """
    Retrieve courses that have not been started.
    """

    return (
        get_course_progress()
        .not_started()
    )