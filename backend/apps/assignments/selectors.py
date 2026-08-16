from django.db.models import QuerySet

from apps.enrollments.models import Enrollment

from .models import Assignment, Submission


def get_published_course_assignments(
    *,
    course_id,
    student,
) -> QuerySet[Assignment]:
    is_enrolled = Enrollment.objects.filter(
        student=student,
        course_id=course_id,
        is_active=True,
    ).exists()

    if not is_enrolled:
        return Assignment.objects.none()

    return (
        Assignment.objects
        .filter(
            course_id=course_id,
            is_published=True,
        )
        .select_related("course")
        .order_by("due_at", "created_at")
    )


def get_assignment_for_student(
    *,
    assignment_id,
    student,
) -> Assignment | None:
    return (
        Assignment.objects
        .filter(
            pk=assignment_id,
            is_published=True,
            course__enrollments__student=student,
            course__enrollments__is_active=True,
        )
        .select_related("course")
        .first()
    )


def get_student_submission(
    *,
    assignment_id,
    student,
) -> Submission | None:
    return (
        Submission.objects
        .filter(
            assignment_id=assignment_id,
            student=student,
        )
        .select_related(
            "assignment",
            "student",
            "graded_by",
        )
        .first()
    )


def get_instructor_submissions(
    *,
    assignment_id,
    instructor,
) -> QuerySet[Submission]:
    return (
        Submission.objects
        .filter(
            assignment_id=assignment_id,
            assignment__course__instructor=instructor,
        )
        .select_related(
            "assignment",
            "student",
            "enrollment",
            "graded_by",
        )
        .order_by("-created_at")
    )