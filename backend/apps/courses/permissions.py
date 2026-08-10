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
    Anyone can read.
    Only instructors can create.
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
    Instructor can manage only their own course.
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


# ==========================================================
# Section Permissions
# ==========================================================


class IsSectionOwner(BasePermission):
    """
    Allow only the course owner to manage sections.
    """

    message = "You do not own this section."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return obj.course.instructor == request.user


class IsInstructorOrSectionReadOnly(BasePermission):
    """
    Anyone can read.
    Only instructors can create/update sections.
    """

    message = "Only instructors can manage sections."

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


# ==========================================================
# Lecture Permissions
# ==========================================================


class IsLectureOwner(BasePermission):
    """
    Allow only the course owner to manage lectures.
    """

    message = "You do not own this lecture."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.section.course.instructor
            == request.user
        )


class IsInstructorOrLectureReadOnly(BasePermission):
    """
    Anyone can read.
    Only instructors can manage lectures.
    """

    message = "Only instructors can manage lectures."

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


# ==========================================================
# Resource Permissions
# ==========================================================


class IsResourceOwner(BasePermission):
    """
    Allow only the course owner to manage resources.
    """

    message = "You do not own this resource."

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        if request.user.is_staff:
            return True

        return (
            obj.lecture.section.course.instructor
            == request.user
        )


class IsInstructorOrResourceReadOnly(BasePermission):
    """
    Anyone can read.
    Only instructors can manage resources.
    """

    message = "Only instructors can manage resources."

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