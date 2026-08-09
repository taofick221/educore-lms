from apps.courses.choices import CourseStatus

from .exceptions import (
    AlreadyEnrolled,
    CourseNotPurchasable,
)
from apps.enrollments.models import Enrollment


def validate_course_for_order(*, course, student):
    if not course.is_active:
        raise CourseNotPurchasable(
            "This course is inactive."
        )

    if not course.is_published:
        raise CourseNotPurchasable(
            "This course is not published."
        )

    if course.status != CourseStatus.PUBLISHED:
        raise CourseNotPurchasable(
            "This course is unavailable."
        )

    if course.instructor_id == student.id:
        raise CourseNotPurchasable(
            "You cannot purchase your own course."
        )

    if Enrollment.objects.filter(
        student=student,
        course=course,
    ).exists():
        raise AlreadyEnrolled(
            "You are already enrolled in this course."
        )

    return course