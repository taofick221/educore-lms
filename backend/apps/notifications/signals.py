from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.enrollments.models import Enrollment, LessonProgress
from apps.orders.models import Order

from .choices import NotificationType
from .services import create_notification_once


# ==========================================================
# Order State Tracking
# ==========================================================


@receiver(pre_save, sender=Order)
def track_order_state(
    sender,
    instance,
    **kwargs,
):
    if not instance.pk:
        instance._previous_status = None
        instance._previous_payment_verified = False
        return

    previous = (
        Order.objects
        .filter(pk=instance.pk)
        .values(
            "status",
            "payment_verified",
        )
        .first()
    )

    if previous:
        instance._previous_status = (
            previous["status"]
        )
        instance._previous_payment_verified = (
            previous["payment_verified"]
        )
    else:
        instance._previous_status = None
        instance._previous_payment_verified = False


@receiver(post_save, sender=Order)
def create_order_notifications(
    sender,
    instance,
    created,
    **kwargs,
):
    previous_status = getattr(
        instance,
        "_previous_status",
        None,
    )

    previous_payment_verified = getattr(
        instance,
        "_previous_payment_verified",
        False,
    )

    # ======================================================
    # Order Created
    # ======================================================

    if created:
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.ORDER_CREATED
            ),
            title="Order received",
            message=(
                "Your order has been received "
                "and is waiting for processing."
            ),
            related_object=instance,
        )

        return

    # ======================================================
    # Payment Verified
    # ======================================================

    if (
        not previous_payment_verified
        and instance.payment_verified
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.PAYMENT_VERIFIED
            ),
            title="Payment verified",
            message=(
                "Your payment has been verified "
                "successfully."
            ),
            related_object=instance,
        )

    # ======================================================
    # Order Approved
    # ======================================================

    if (
        previous_status != instance.status
        and instance.status == "approved"
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.ORDER_APPROVED
            ),
            title="Order approved",
            message=(
                "Your order has been approved. "
                "Your course enrollment is now available."
            ),
            related_object=instance,
        )

    # ======================================================
    # Order Rejected
    # ======================================================

    if (
        previous_status != instance.status
        and instance.status == "rejected"
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.ORDER_REJECTED
            ),
            title="Order rejected",
            message=(
                "Your order has been rejected. "
                "Please check your order details."
            ),
            related_object=instance,
        )

    # ======================================================
    # Order Cancelled
    # ======================================================

    if (
        previous_status != instance.status
        and instance.status == "cancelled"
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.ORDER_CANCELLED
            ),
            title="Order cancelled",
            message=(
                "Your order has been cancelled."
            ),
            related_object=instance,
        )


# ==========================================================
# Enrollment State Tracking
# ==========================================================


@receiver(pre_save, sender=Enrollment)
def track_enrollment_state(
    sender,
    instance,
    **kwargs,
):
    if not instance.pk:
        instance._previous_status = None
        instance._previous_certificate_issued = False
        return

    previous = (
        Enrollment.objects
        .filter(pk=instance.pk)
        .values(
            "status",
            "certificate_issued",
        )
        .first()
    )

    if previous:
        instance._previous_status = (
            previous["status"]
        )
        instance._previous_certificate_issued = (
            previous["certificate_issued"]
        )
    else:
        instance._previous_status = None
        instance._previous_certificate_issued = False


@receiver(post_save, sender=Enrollment)
def create_enrollment_notifications(
    sender,
    instance,
    created,
    **kwargs,
):
    previous_status = getattr(
        instance,
        "_previous_status",
        None,
    )

    previous_certificate_issued = getattr(
        instance,
        "_previous_certificate_issued",
        False,
    )

    # ======================================================
    # Enrollment Created
    # ======================================================

    if created:
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.ENROLLMENT_CREATED
            ),
            title="Course enrollment confirmed",
            message=(
                f"You are now enrolled in "
                f"“{instance.course.title}”."
            ),
            related_object=instance,
        )

        return

    # ======================================================
    # Course Completed
    # ======================================================

    if (
        previous_status != instance.status
        and instance.status == "completed"
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.COURSE_COMPLETED
            ),
            title="Course completed",
            message=(
                f"Congratulations! You completed "
                f"“{instance.course.title}”."
            ),
            related_object=instance,
        )

    # ======================================================
    # Certificate Issued
    # ======================================================

    if (
        not previous_certificate_issued
        and instance.certificate_issued
    ):
        create_notification_once(
            recipient=instance.student,
            notification_type=(
                NotificationType.CERTIFICATE_ISSUED
            ),
            title="Certificate issued",
            message=(
                f"Your certificate for "
                f"“{instance.course.title}” "
                "is now available."
            ),
            related_object=instance,
        )


# ==========================================================
# Lesson Completion
# ==========================================================


@receiver(pre_save, sender=LessonProgress)
def track_lesson_state(
    sender,
    instance,
    **kwargs,
):
    if not instance.pk:
        instance._previous_is_completed = False
        return

    instance._previous_is_completed = (
        LessonProgress.objects
        .filter(pk=instance.pk)
        .values_list(
            "is_completed",
            flat=True,
        )
        .first()
        or False
    )


@receiver(post_save, sender=LessonProgress)
def create_lesson_notifications(
    sender,
    instance,
    created,
    **kwargs,
):
    previous_is_completed = getattr(
        instance,
        "_previous_is_completed",
        False,
    )

    # ======================================================
    # Lesson Completed
    # ======================================================

    if (
        instance.is_completed
        and not previous_is_completed
    ):
        create_notification_once(
            recipient=instance.enrollment.student,
            notification_type=(
                NotificationType.LESSON_COMPLETED
            ),
            title="Lesson completed",
            message=(
                f'You completed '
                f'"{instance.lecture.title}".'
            ),
            related_object=instance,
        )