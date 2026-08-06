from django.db import transaction
from django.utils import timezone

from .choices import EnrollmentStatus
from .models import (
    CourseProgress,
    Enrollment,
    LessonProgress,
)


# ==========================================================
# Enrollment Services
# ==========================================================


@transaction.atomic
def create_enrollment(
    *,
    validated_data,
):
    """
    Create enrollment with initial course progress.
    """

    enrollment = Enrollment.objects.create(
        **validated_data,
    )

    CourseProgress.objects.create(
        enrollment=enrollment,
    )

    return enrollment


@transaction.atomic
def activate_enrollment(
    *,
    enrollment,
):
    """
    Activate enrollment.
    """

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    if enrollment.status == EnrollmentStatus.ACTIVE:
        return enrollment

    enrollment.status = EnrollmentStatus.ACTIVE

    enrollment.is_active = True

    if enrollment.started_at is None:
        enrollment.started_at = timezone.now()

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
            "started_at",
        ],
    )

    return enrollment


@transaction.atomic
def cancel_enrollment(
    *,
    enrollment,
):
    """
    Cancel enrollment.
    """

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    enrollment.status = EnrollmentStatus.CANCELLED

    enrollment.is_active = False

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
        ],
    )

    return enrollment


@transaction.atomic
def expire_enrollment(
    *,
    enrollment,
):
    """
    Expire enrollment.
    """

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    enrollment.status = EnrollmentStatus.EXPIRED

    enrollment.is_active = False

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
        ],
    )

    return enrollment


@transaction.atomic
def complete_enrollment(
    *,
    enrollment,
):
    """
    Complete enrollment.
    """

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    if enrollment.status == EnrollmentStatus.COMPLETED:
        return enrollment

    enrollment.status = EnrollmentStatus.COMPLETED

    enrollment.completed_at = timezone.now()

    enrollment.certificate_issued = True

    enrollment.save(
        update_fields=[
            "status",
            "completed_at",
            "certificate_issued",
        ],
    )

    return enrollment


@transaction.atomic
def issue_certificate(
    *,
    enrollment,
):
    """
    Issue certificate.
    """

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    if enrollment.certificate_issued:
        return enrollment

    enrollment.certificate_issued = True

    enrollment.save(
        update_fields=[
            "certificate_issued",
        ],
    )

    return enrollment


# ==========================================================
# Lesson Progress Services
# ==========================================================


@transaction.atomic
def create_lesson_progress(
    *,
    validated_data,
):
    """
    Create lesson progress.
    """

    return LessonProgress.objects.create(
        **validated_data,
    )


@transaction.atomic
def update_lesson_progress(
    *,
    lesson_progress,
    validated_data,
):
    """
    Update lesson progress.
    """

    lesson_progress = (
        LessonProgress.objects
        .select_for_update()
        .select_related(
            "enrollment",
            "lecture",
        )
        .get(
            pk=lesson_progress.pk,
        )
    )

    for field, value in validated_data.items():
        setattr(
            lesson_progress,
            field,
            value,
        )

    if (
        lesson_progress.watch_percentage >= 100
        and not lesson_progress.is_completed
    ):
        lesson_progress.is_completed = True

        lesson_progress.completed_at = (
            timezone.now()
        )

    lesson_progress.save()

    return lesson_progress


@transaction.atomic
def complete_lesson(
    *,
    lesson_progress,
):
    """
    Complete lesson and recalculate course progress.
    """

    lesson_progress = (
        LessonProgress.objects
        .select_for_update()
        .select_related(
            "enrollment",
            "lecture",
        )
        .get(
            pk=lesson_progress.pk,
        )
    )

    if lesson_progress.is_completed:
        return lesson_progress

    lesson_progress.is_completed = True

    lesson_progress.watch_percentage = 100

    lesson_progress.completed_at = (
        timezone.now()
    )

    lesson_progress.save(
        update_fields=[
            "is_completed",
            "watch_percentage",
            "completed_at",
        ],
    )

    update_course_completion(
        enrollment=lesson_progress.enrollment,
    )

    return lesson_progress


@transaction.atomic
def resume_lesson(
    *,
    lesson_progress,
    last_watched_second,
    watch_percentage,
):
    """
    Resume lesson.
    """

    lesson_progress = (
        LessonProgress.objects
        .select_for_update()
        .get(
            pk=lesson_progress.pk,
        )
    )

    lesson_progress.last_watched_second = (
        last_watched_second
    )

    lesson_progress.watch_percentage = (
        watch_percentage
    )

    if (
        watch_percentage >= 100
        and not lesson_progress.is_completed
    ):
        lesson_progress.is_completed = True

        lesson_progress.completed_at = (
            timezone.now()
        )

    lesson_progress.save()

    return lesson_progress


# ==========================================================
# Course Progress Services
# ==========================================================


@transaction.atomic
def update_course_progress(
    *,
    course_progress,
    validated_data,
):
    """
    Update course progress.
    """

    course_progress = (
        CourseProgress.objects
        .select_for_update()
        .get(
            pk=course_progress.pk,
        )
    )

    for field, value in validated_data.items():
        setattr(
            course_progress,
            field,
            value,
        )

    course_progress.save()

    return course_progress


@transaction.atomic
def update_course_completion(
    *,
    enrollment,
):
    """
    Recalculate course progress from lesson progress.
    """

    course_progress = (
        CourseProgress.objects
        .select_for_update()
        .select_related(
            "enrollment",
        )
        .get(
            enrollment=enrollment,
        )
    )

    lesson_progress = (
        LessonProgress.objects.filter(
            enrollment=enrollment,
        )
    )

    total_lectures = lesson_progress.count()

    completed_lectures = (
        lesson_progress.filter(
            is_completed=True,
        ).count()
    )

    total_sections = (
        enrollment.course.sections.count()
    )

    completed_sections = (
        enrollment.course.sections.filter(
            lectures__lesson_progress__enrollment=enrollment,
            lectures__lesson_progress__is_completed=True,
        )
        .distinct()
        .count()
    )

    progress = 0

    if total_lectures > 0:
        progress = int(
            (
                completed_lectures
                / total_lectures
            )
            * 100
        )

    last_completed = (
        lesson_progress.filter(
            is_completed=True,
        )
        .order_by(
            "-completed_at",
        )
        .first()
    )

    course_progress.completed_sections = (
        completed_sections
    )

    course_progress.completed_lectures = (
        completed_lectures
    )

    course_progress.total_sections = (
        total_sections
    )

    course_progress.total_lectures = (
        total_lectures
    )

    course_progress.progress_percentage = (
        progress
    )

    course_progress.last_completed_lecture = (
        last_completed.lecture
        if last_completed
        else None
    )

    if progress == 100:
        course_progress.completed_at = (
            timezone.now()
        )

    course_progress.save()

    if progress == 100:
        complete_enrollment(
            enrollment=enrollment,
        )

    return course_progress


@transaction.atomic
def reset_course_progress(
    *,
    course_progress,
):
    """
    Reset course progress.
    """

    course_progress = (
        CourseProgress.objects
        .select_for_update()
        .get(
            pk=course_progress.pk,
        )
    )

    LessonProgress.objects.filter(
        enrollment=course_progress.enrollment,
    ).update(
        is_completed=False,
        watch_percentage=0,
        last_watched_second=0,
        completed_at=None,
    )

    course_progress.completed_sections = 0

    course_progress.completed_lectures = 0

    course_progress.total_sections = (
        course_progress.enrollment.course.sections.count()
    )

    course_progress.total_lectures = (
        course_progress.enrollment.course.sections
        .prefetch_related("lectures")
        .values_list(
            "lectures",
            flat=True,
        )
        .count()
    )

    course_progress.progress_percentage = 0

    course_progress.last_completed_lecture = None

    course_progress.completed_at = None

    course_progress.save(
        update_fields=[
            "completed_sections",
            "completed_lectures",
            "total_sections",
            "total_lectures",
            "progress_percentage",
            "last_completed_lecture",
            "completed_at",
        ],
    )

    enrollment = course_progress.enrollment

    enrollment.status = EnrollmentStatus.ACTIVE

    enrollment.completed_at = None

    enrollment.certificate_issued = False

    enrollment.save(
        update_fields=[
            "status",
            "completed_at",
            "certificate_issued",
        ],
    )

    return course_progress

