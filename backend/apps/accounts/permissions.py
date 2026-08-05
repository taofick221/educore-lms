from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Allows access only to the owner of the object.
    """

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsVerifiedUser(BasePermission):
    """
    Allows access only to verified users.
    """

    message = "Your account is not verified."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_verified
        )


class IsStudent(BasePermission):
    message = "Only students can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "student"
        )


class IsInstructor(BasePermission):
    message = "Only instructors can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "instructor"
        )


class IsAdmin(BasePermission):
    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsInstructorOrAdmin(BasePermission):
    message = "Only instructors or administrators can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "instructor",
                "admin",
            ]
        )


class IsStudentOrInstructor(BasePermission):
    message = "Only students or instructors can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "student",
                "instructor",
            ]
        )