from rest_framework.permissions import (
    SAFE_METHODS,
    BasePermission,
)


class IsInstructor(BasePermission):
    """
    Allow access only to instructors.
    """

    message = "Only instructors can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "instructor"
        )


class IsCourseOwner(BasePermission):
    """
    Allow access only to the course owner.
    """

    message = "You do not own this course."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return obj.instructor == request.user


class IsInstructorOrReadOnly(BasePermission):
    """
    Everyone can read.
    Only instructors can create/update.
    """

    message = "Only instructors can modify courses."

    def has_permission(
        self,
        request,
        view,
    ):
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == "instructor"
        )


class IsAdminOrCourseOwner(BasePermission):
    """
    Admin has full access.
    Instructor can manage only their own courses.
    """

    message = "Permission denied."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return obj.instructor == request.user