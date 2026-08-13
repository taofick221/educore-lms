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

    CourseProgress is immediately initialized from
    the actual published course structure.
    """

    enrollment = Enrollment.objects.create(
        **validated_data,
    )

    CourseProgress.objects.create(
        enrollment=enrollment,
    )

    # Initialize total sections, total lectures,
    # and progress using the actual course content.
    update_course_completion(
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

    enrollment.status = (
        EnrollmentStatus.ACTIVE
    )

    enrollment.is_active = True

    if enrollment.started_at is None:
        enrollment.started_at = timezone.now()

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
            "started_at",
            "updated_at",
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

    enrollment.status = (
        EnrollmentStatus.CANCELLED
    )

    enrollment.is_active = False

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
            "updated_at",
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

    enrollment.status = (
        EnrollmentStatus.EXPIRED
    )

    enrollment.is_active = False

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
            "updated_at",
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

    if (
        enrollment.status
        == EnrollmentStatus.COMPLETED
    ):
        return enrollment

    enrollment.status = (
        EnrollmentStatus.COMPLETED
    )

    enrollment.completed_at = (
        timezone.now()
    )

    enrollment.certificate_issued = True

    enrollment.save(
        update_fields=[
            "status",
            "completed_at",
            "certificate_issued",
            "updated_at",
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
            "updated_at",
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
    Create or update lesson progress.

    When watch percentage reaches 100%,
    the lesson is marked as completed.

    Course progress is recalculated afterwards.
    """

    enrollment = validated_data[
        "enrollment"
    ]

    lecture = validated_data[
        "lecture"
    ]

    last_watched_second = (
        validated_data.get(
            "last_watched_second",
            0,
        )
    )

    watch_percentage = (
        validated_data.get(
            "watch_percentage",
            0,
        )
    )

    # ------------------------------------------------------
    # Lock enrollment
    # ------------------------------------------------------

    enrollment = (
        Enrollment.objects
        .select_for_update()
        .get(
            pk=enrollment.pk,
        )
    )

    # ------------------------------------------------------
    # Find existing progress
    # ------------------------------------------------------

    lesson_progress = (
        LessonProgress.objects
        .select_for_update()
        .filter(
            enrollment=enrollment,
            lecture=lecture,
        )
        .first()
    )

    # ------------------------------------------------------
    # Create progress
    # ------------------------------------------------------

    if lesson_progress is None:
        lesson_progress = (
            LessonProgress.objects.create(
                enrollment=enrollment,
                lecture=lecture,
                last_watched_second=(
                    last_watched_second
                ),
                watch_percentage=(
                    watch_percentage
                ),
            )
        )

    # ------------------------------------------------------
    # Update existing progress
    # ------------------------------------------------------

    else:
        lesson_progress.last_watched_second = (
            max(
                lesson_progress.last_watched_second,
                last_watched_second,
            )
        )

        lesson_progress.watch_percentage = (
            max(
                lesson_progress.watch_percentage,
                watch_percentage,
            )
        )

    # ------------------------------------------------------
    # Mark completed
    # ------------------------------------------------------

    if (
        lesson_progress.watch_percentage >= 100
        and not lesson_progress.is_completed
    ):
        lesson_progress.is_completed = True

        lesson_progress.completed_at = (
            timezone.now()
        )

    lesson_progress.save()

    # ------------------------------------------------------
    # Recalculate course progress
    # ------------------------------------------------------

    update_course_completion(
        enrollment=enrollment,
    )

    return lesson_progress


@transaction.atomic
def update_lesson_progress(
    *,
    lesson_progress,
    validated_data,
):
    """
    Update lesson progress and recalculate
    course progress.
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

    for (
        field,
        value,
    ) in validated_data.items():
        setattr(
            lesson_progress,
            field,
            value,
        )

    if (
        lesson_progress.watch_percentage
        >= 100
        and not lesson_progress.is_completed
    ):
        lesson_progress.is_completed = True

        lesson_progress.completed_at = (
            timezone.now()
        )

    lesson_progress.save()

    update_course_completion(
        enrollment=lesson_progress.enrollment,
    )

    return lesson_progress


@transaction.atomic
def complete_lesson(
    *,
    lesson_progress,
):
    """
    Complete lesson and recalculate
    course progress.
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
            "updated_at",
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
        .select_related(
            "enrollment",
            "lecture",
        )
        .get(
            pk=lesson_progress.pk,
        )
    )

    lesson_progress.last_watched_second = (
        max(
            lesson_progress.last_watched_second,
            last_watched_second,
        )
    )

    lesson_progress.watch_percentage = (
        max(
            lesson_progress.watch_percentage,
            watch_percentage,
        )
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

    update_course_completion(
        enrollment=lesson_progress.enrollment,
    )

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
    Manually update course progress.
    """

    course_progress = (
        CourseProgress.objects
        .select_for_update()
        .get(
            pk=course_progress.pk,
        )
    )

    for (
        field,
        value,
    ) in validated_data.items():
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
    Recalculate complete course progress.

    Progress is calculated from actual active
    and published course sections and lectures.
    """

    # ------------------------------------------------------
    # Lock CourseProgress
    # ------------------------------------------------------

    course_progress = (
        CourseProgress.objects
        .select_for_update()
        .get(
            enrollment=enrollment,
        )
    )

    course = enrollment.course

    # ------------------------------------------------------
    # Published sections
    # ------------------------------------------------------

    sections = (
        course.sections
        .filter(
            is_active=True,
            is_published=True,
        )
        .prefetch_related("lectures")
    )

    total_sections = sections.count()

    # ------------------------------------------------------
    # Published lectures
    # ------------------------------------------------------

    published_lecture_ids = []

    total_lectures = 0

    for section in sections:
        section_lectures = [
            lecture
            for lecture in section.lectures.all()
            if (
                lecture.is_active
                and lecture.is_published
            )
        ]

        total_lectures += len(
            section_lectures
        )

        published_lecture_ids.extend(
            lecture.id
            for lecture in section_lectures
        )

    # ------------------------------------------------------
    # Completed lectures
    # ------------------------------------------------------

    completed_lecture_ids = set(
        LessonProgress.objects.filter(
            enrollment=enrollment,
            lecture_id__in=(
                published_lecture_ids
            ),
            is_completed=True,
        ).values_list(
            "lecture_id",
            flat=True,
        )
    )

    completed_lectures = len(
        completed_lecture_ids
    )

    # ------------------------------------------------------
    # Completed sections
    # ------------------------------------------------------

    completed_sections = 0

    for section in sections:
        section_lecture_ids = {
            lecture.id
            for lecture in section.lectures.all()
            if (
                lecture.is_active
                and lecture.is_published
            )
        }

        if not section_lecture_ids:
            continue

        if section_lecture_ids.issubset(
            completed_lecture_ids
        ):
            completed_sections += 1

    # ------------------------------------------------------
    # Calculate percentage
    # ------------------------------------------------------

    progress = 0

    if total_lectures > 0:
        progress = int(
            (
                completed_lectures
                / total_lectures
            )
            * 100
        )

    # ------------------------------------------------------
    # Last completed lecture
    # ------------------------------------------------------

    last_completed = (
        LessonProgress.objects.filter(
            enrollment=enrollment,
            lecture_id__in=(
                published_lecture_ids
            ),
            is_completed=True,
        )
        .select_related("lecture")
        .order_by(
            "-completed_at",
        )
        .first()
    )

    # ------------------------------------------------------
    # Update CourseProgress
    # ------------------------------------------------------

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

    # ------------------------------------------------------
    # Course completion
    # ------------------------------------------------------

    if progress >= 100 and total_lectures > 0:
        if (
            course_progress.completed_at
            is None
        ):
            course_progress.completed_at = (
                timezone.now()
            )
    else:
        course_progress.completed_at = None

    course_progress.save()

    # ------------------------------------------------------
    # Complete enrollment
    # ------------------------------------------------------

    if (
        progress >= 100
        and total_lectures > 0
    ):
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

    course = (
        course_progress.enrollment.course
    )

    sections = (
        course.sections
        .filter(
            is_active=True,
            is_published=True,
        )
        .prefetch_related("lectures")
    )

    total_sections = sections.count()

    total_lectures = 0

    for section in sections:
        total_lectures += sum(
            1
            for lecture in section.lectures.all()
            if (
                lecture.is_active
                and lecture.is_published
            )
        )

    course_progress.completed_sections = 0

    course_progress.completed_lectures = 0

    course_progress.total_sections = (
        total_sections
    )

    course_progress.total_lectures = (
        total_lectures
    )

    course_progress.progress_percentage = 0

    course_progress.last_completed_lecture = (
        None
    )

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
            "updated_at",
        ],
    )

    enrollment = (
        course_progress.enrollment
    )

    enrollment.status = (
        EnrollmentStatus.ACTIVE
    )

    enrollment.is_active = True

    enrollment.completed_at = None

    enrollment.certificate_issued = False

    enrollment.save(
        update_fields=[
            "status",
            "is_active",
            "completed_at",
            "certificate_issued",
            "updated_at",
        ],
    )

    return course_progress