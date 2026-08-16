from django.db import transaction
from django.utils import timezone

from .models import Assignment, Submission


@transaction.atomic
def submit_assignment(
    *,
    assignment,
    enrollment,
    student,
    text="",
    attachment=None,
):
    if not assignment.is_published:
        raise ValueError(
            "This assignment is not published."
        )

    if (
        enrollment.student_id
        != student.id
        or enrollment.course_id
        != assignment.course_id
        or not enrollment.is_active
    ):
        raise ValueError(
            "You do not have access to this assignment."
        )

    if (
        assignment.due_at
        and timezone.now() > assignment.due_at
    ):
        raise ValueError(
            "The assignment deadline has passed."
        )

    submission = (
        Submission.objects
        .select_for_update()
        .filter(
            assignment=assignment,
            student=student,
        )
        .first()
    )

    if submission:
        if (
            submission.status
            == Submission.Status.GRADED
        ):
            raise ValueError(
                "This assignment has already been graded."
            )

        submission.enrollment = enrollment
        submission.text = text
        submission.status = (
            Submission.Status.SUBMITTED
        )

        if attachment is not None:
            submission.attachment = attachment

        submission.score = None
        submission.feedback = ""
        submission.graded_by = None
        submission.graded_at = None

        submission.save(
            update_fields=[
                "enrollment",
                "text",
                "attachment",
                "status",
                "score",
                "feedback",
                "graded_by",
                "graded_at",
                "updated_at",
            ]
        )

        return submission

    return Submission.objects.create(
        assignment=assignment,
        enrollment=enrollment,
        student=student,
        text=text,
        attachment=attachment,
        status=Submission.Status.SUBMITTED,
    )


@transaction.atomic
def grade_submission(
    *,
    submission,
    grader,
    score,
    feedback="",
):
    submission = (
        Submission.objects
        .select_for_update()
        .select_related(
            "assignment",
        )
        .get(
            pk=submission.pk,
        )
    )

    if score < 0:
        raise ValueError(
            "Score cannot be negative."
        )

    if (
        score
        > submission.assignment.max_score
    ):
        raise ValueError(
            "Score is outside the allowed range."
        )

    submission.score = score
    submission.feedback = feedback.strip()
    submission.status = (
        Submission.Status.GRADED
    )
    submission.graded_by = grader
    submission.graded_at = timezone.now()

    submission.save(
        update_fields=[
            "score",
            "feedback",
            "status",
            "graded_by",
            "graded_at",
            "updated_at",
        ]
    )

    return submission