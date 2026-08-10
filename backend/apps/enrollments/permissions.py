from rest_framework.permissions import (
    SAFE_METHODS,
    BasePermission,
)


# ==========================================================
# Enrollment Permissions
# ==========================================================


class IsStudent(BasePermission):
    """
    Allow access only to students.
    """

    message = "Only students can perform this action."

    def has_permission(
        self,
        request,
        view,
    ):
        return (
            request.user.is_authenticated
            and request.user.role == "student"
        )


class IsEnrollmentOwner(BasePermission):
    """
    Student can access only their own enrollment.
    """

    message = "You do not own this enrollment."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return obj.student == request.user


class IsInstructorEnrollmentOwner(
    BasePermission,
):
    """
    Instructor can access enrollments
    of their own courses.
    """

    message = (
        "You do not own this course."
    )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.course.instructor
            == request.user
        )


class IsStudentOrReadOnly(
    BasePermission,
):
    """
    Everyone can read.
    Only students can enroll.
    """

    message = (
        "Only students can perform this action."
    )

    def has_permission(
        self,
        request,
        view,
    ):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == "student"
        )


class IsAdminOrEnrollmentOwner(
    BasePermission,
):
    """
    Admin has full access.
    Student can manage
    only their own enrollment.
    """

    message = (
        "Permission denied."
    )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.student
            == request.user
        )


# ==========================================================
# Lesson Progress Permissions
# ==========================================================


class IsLessonProgressOwner(
    BasePermission,
):
    """
    Student can manage
    only their own lesson progress.
    """

    message = (
        "Permission denied."
    )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.enrollment.student
            == request.user
        )


# ==========================================================
# Course Progress Permissions
# ==========================================================


class IsCourseProgressOwner(
    BasePermission,
):
    """
    Student can access
    only their own course progress.
    """

    message = (
        "Permission denied."
    )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.enrollment.student
            == request.user
        )