from django.db.models.signals import (
    post_save,
)
from django.dispatch import receiver

from .models import Enrollment


# ==========================================================
# Enrollment Signals
# ==========================================================


@receiver(
    post_save,
    sender=Enrollment,
)
def enrollment_created(
    sender,
    instance,
    created,
    **kwargs,
):
    """
    Future integration hook.

    Examples:
    - Send enrollment email
    - Create notification
    - Write audit log
    - Publish event
    """

    if not created:
        return

    # Intentionally left blank.
    # Future business integrations will be added here.
    return