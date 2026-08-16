from rest_framework.permissions import BasePermission


class IsAssignmentInstructorOrStaff(
    BasePermission,
):
    message = (
        "You do not have permission to manage "
        "this assignment."
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
            obj.course.instructor_id
            == request.user.id
        )


class IsSubmissionInstructorOrStaff(
    BasePermission,
):
    message = (
        "You do not have permission to manage "
        "this submission."
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
            obj.assignment.course.instructor_id
            == request.user.id
        )