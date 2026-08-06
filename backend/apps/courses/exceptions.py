from rest_framework import status
from rest_framework.exceptions import APIException


# ==========================================================
# Course Exceptions
# ==========================================================


class CourseAlreadyPublished(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "This course is already published."
    )
    default_code = "course_already_published"


class CourseNotPublished(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "This course is not published."
    )
    default_code = "course_not_published"


class CourseArchived(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "This course has been archived."
    )
    default_code = "course_archived"


# ==========================================================
# Section Exceptions
# ==========================================================


class DuplicateSectionOrder(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Section order already exists."
    )
    default_code = "duplicate_section_order"


class SectionAlreadyPublished(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Section is already published."
    )
    default_code = "section_already_published"


# ==========================================================
# Lecture Exceptions
# ==========================================================


class DuplicateLectureOrder(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Lecture order already exists."
    )
    default_code = "duplicate_lecture_order"


class LectureAlreadyPublished(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Lecture is already published."
    )
    default_code = "lecture_already_published"


class InvalidLectureDuration(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Invalid lecture duration."
    )
    default_code = "invalid_lecture_duration"


# ==========================================================
# Resource Exceptions
# ==========================================================


class InvalidResource(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Invalid resource."
    )
    default_code = "invalid_resource"


class ResourceFileRequired(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = (
        "Either file or external URL is required."
    )
    default_code = "resource_required"


# ==========================================================
# Permission Exceptions
# ==========================================================


class NotCourseOwner(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = (
        "You do not have permission to manage this course."
    )
    default_code = "not_course_owner"


class NotInstructor(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = (
        "Only instructors can perform this action."
    )
    default_code = "not_instructor"