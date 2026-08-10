from rest_framework import status
from rest_framework.exceptions import APIException


# ==========================================================
# Enrollment Exceptions
# ==========================================================


class EnrollmentAlreadyExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Student is already enrolled in this course."
    )

    default_code = "enrollment_already_exists"


class EnrollmentNotActive(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Enrollment is not active."
    )

    default_code = "enrollment_not_active"


class EnrollmentAlreadyCompleted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Enrollment has already been completed."
    )

    default_code = "enrollment_already_completed"


class EnrollmentCancelled(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Enrollment has been cancelled."
    )

    default_code = "enrollment_cancelled"


class EnrollmentExpired(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Enrollment has expired."
    )

    default_code = "enrollment_expired"


# ==========================================================
# Payment Exceptions
# ==========================================================


class PaymentRequired(APIException):
    status_code = status.HTTP_402_PAYMENT_REQUIRED

    default_detail = (
        "Payment is required to access this course."
    )

    default_code = "payment_required"


class PaymentAlreadyCompleted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Payment has already been completed."
    )

    default_code = "payment_already_completed"


class RefundNotAllowed(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Refund is not allowed."
    )

    default_code = "refund_not_allowed"


# ==========================================================
# Lesson Progress Exceptions
# ==========================================================


class LessonAlreadyCompleted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Lesson has already been completed."
    )

    default_code = "lesson_already_completed"


class InvalidLessonProgress(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Invalid lesson progress."
    )

    default_code = "invalid_lesson_progress"


# ==========================================================
# Course Progress Exceptions
# ==========================================================


class CourseAlreadyCompleted(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Course has already been completed."
    )

    default_code = "course_already_completed"


class InvalidCourseProgress(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    default_detail = (
        "Invalid course progress."
    )

    default_code = "invalid_course_progress"


# ==========================================================
# Permission Exceptions
# ==========================================================


class EnrollmentPermissionDenied(APIException):
    status_code = status.HTTP_403_FORBIDDEN

    default_detail = (
        "You do not have permission to access this enrollment."
    )

    default_code = "enrollment_permission_denied"