from rest_framework.permissions import BasePermission


class IsInstructor(BasePermission):
    message = "Only instructors can access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "instructor"
        )