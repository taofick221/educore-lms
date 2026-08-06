from urllib.parse import urlparse

from django.core.exceptions import ValidationError


# ==========================================================
# File Validators
# ==========================================================


MAX_VIDEO_SIZE = 1024 * 1024 * 1024  # 1 GB

MAX_RESOURCE_SIZE = 100 * 1024 * 1024  # 100 MB

ALLOWED_VIDEO_EXTENSIONS = (
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
)

ALLOWED_RESOURCE_EXTENSIONS = (
    ".pdf",
    ".zip",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
)


def validate_video_size(file):
    """
    Validate uploaded video size.
    """

    if file.size > MAX_VIDEO_SIZE:
        raise ValidationError(
            "Video size cannot exceed 1 GB."
        )


def validate_resource_size(file):
    """
    Validate uploaded resource size.
    """

    if file.size > MAX_RESOURCE_SIZE:
        raise ValidationError(
            "Resource size cannot exceed 100 MB."
        )


def validate_video_extension(file):
    """
    Validate uploaded video extension.
    """

    filename = file.name.lower()

    if not filename.endswith(
        ALLOWED_VIDEO_EXTENSIONS,
    ):
        raise ValidationError(
            "Unsupported video format."
        )


def validate_resource_extension(file):
    """
    Validate uploaded resource extension.
    """

    filename = file.name.lower()

    if not filename.endswith(
        ALLOWED_RESOURCE_EXTENSIONS,
    ):
        raise ValidationError(
            "Unsupported resource format."
        )


# ==========================================================
# URL Validators
# ==========================================================


def validate_video_url(url):
    """
    Validate video URL.
    """

    parsed = urlparse(url)

    if parsed.scheme not in (
        "http",
        "https",
    ):
        raise ValidationError(
            "Invalid video URL."
        )


def validate_external_url(url):
    """
    Validate external resource URL.
    """

    parsed = urlparse(url)

    if parsed.scheme not in (
        "http",
        "https",
    ):
        raise ValidationError(
            "Invalid external URL."
        )


# ==========================================================
# Course Validators
# ==========================================================


def validate_discount_price(
    *,
    price,
    discount_price,
):
    """
    Validate course discount price.
    """

    if (
        discount_price is not None
        and discount_price > price
    ):
        raise ValidationError(
            "Discount price cannot be greater than price."
        )


def validate_duration(duration):
    """
    Validate duration.
    """

    if duration < 0:
        raise ValidationError(
            "Duration cannot be negative."
        )


def validate_order(order):
    """
    Validate ordering field.
    """

    if order <= 0:
        raise ValidationError(
            "Order must be greater than zero."
        )