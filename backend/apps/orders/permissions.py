from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    message = "Only students can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "student"
        )


class IsOrderOwner(BasePermission):
    message = "You do not own this order."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return obj.student == request.user


class IsAdmin(BasePermission):
    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role == "admin"
                or request.user.is_staff
            )
        )


class IsOrderOwnerOrAdmin(BasePermission):
    message = "Permission denied."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        if request.user.role == "admin":
            return True

        return obj.student == request.user