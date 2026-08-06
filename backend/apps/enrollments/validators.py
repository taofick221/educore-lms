from django.core.exceptions import ValidationError


# ==========================================================
# Enrollment Validators
# ==========================================================


def validate_progress_percentage(
    progress_percentage,
):
    """
    Validate enrollment progress percentage.
    """

    if progress_percentage < 0:
        raise ValidationError(
            "Progress percentage cannot be less than 0."
        )

    if progress_percentage > 100:
        raise ValidationError(
            "Progress percentage cannot be greater than 100."
        )


def validate_price_paid(
    price_paid,
):
    """
    Validate paid amount.
    """

    if price_paid < 0:
        raise ValidationError(
            "Price paid cannot be negative."
        )


# ==========================================================
# Lesson Progress Validators
# ==========================================================


def validate_watch_percentage(
    watch_percentage,
):
    """
    Validate lesson watch percentage.
    """

    if watch_percentage < 0:
        raise ValidationError(
            "Watch percentage cannot be less than 0."
        )

    if watch_percentage > 100:
        raise ValidationError(
            "Watch percentage cannot be greater than 100."
        )


def validate_last_watched_second(
    last_watched_second,
):
    """
    Validate last watched second.
    """

    if last_watched_second < 0:
        raise ValidationError(
            "Last watched second cannot be negative."
        )


# ==========================================================
# Course Progress Validators
# ==========================================================


def validate_completed_sections(
    completed_sections,
    total_sections,
):
    """
    Validate completed sections.
    """

    if completed_sections > total_sections:
        raise ValidationError(
            "Completed sections cannot exceed total sections."
        )


def validate_completed_lectures(
    completed_lectures,
    total_lectures,
):
    """
    Validate completed lectures.
    """

    if completed_lectures > total_lectures:
        raise ValidationError(
            "Completed lectures cannot exceed total lectures."
        )


def validate_course_progress(
    completed_lectures,
    total_lectures,
):
    """
    Validate overall course progress.
    """

    if total_lectures == 0:
        return

    if completed_lectures > total_lectures:
        raise ValidationError(
            "Completed lectures cannot exceed total lectures."
        )