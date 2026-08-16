from django.db import transaction
from django.utils import timezone

from .models import Answer, Attempt


@transaction.atomic
def start_attempt(*, quiz, student):
    if not quiz.is_published:
        raise ValueError("This quiz is not published.")

    # Reuse existing active attempt.
    # Refreshing the quiz page will NOT create a new attempt.
    attempt = (
        Attempt.objects
        .select_for_update()
        .filter(
            quiz=quiz,
            student=student,
            status=Attempt.Status.IN_PROGRESS,
        )
        .order_by("-started_at")
        .first()
    )

    if attempt:
        return attempt

    return Attempt.objects.create(
        quiz=quiz,
        student=student,
        status=Attempt.Status.IN_PROGRESS,
    )


@transaction.atomic
def submit_attempt(*, attempt, answers):
    attempt = (
        Attempt.objects
        .select_for_update()
        .select_related("quiz")
        .get(pk=attempt.pk)
    )

    if attempt.status == Attempt.Status.SUBMITTED:
        return attempt

    quiz = attempt.quiz

    questions = list(
        quiz.questions
        .prefetch_related("options")
        .all()
    )

    question_map = {
        question.id: question
        for question in questions
    }

    earned = 0
    total = sum(
        question.points
        for question in questions
    )

    submitted_questions = set()

    for item in answers:
        question = item["question"]
        option = item["selected_option"]

        # Make sure the question belongs to this quiz.
        if question.id not in question_map:
            raise ValueError(
                "Invalid quiz question."
            )

        # Make sure the option belongs to this question.
        if option.question_id != question.id:
            raise ValueError(
                "Invalid quiz answer."
            )

        # Prevent duplicate answers in the same submission.
        if question.id in submitted_questions:
            raise ValueError(
                "Duplicate answer for a question."
            )

        submitted_questions.add(question.id)

        Answer.objects.update_or_create(
            attempt=attempt,
            question=question,
            defaults={
                "selected_option": option,
            },
        )

        if option.is_correct:
            earned += question.points

    attempt.score = (
        round((earned / total) * 100, 2)
        if total
        else 0
    )

    attempt.status = Attempt.Status.SUBMITTED
    attempt.submitted_at = timezone.now()

    attempt.save(
        update_fields=[
            "score",
            "status",
            "submitted_at",
            "updated_at",
        ],
    )

    return attempt