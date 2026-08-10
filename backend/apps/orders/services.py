from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.enrollments.services import create_enrollment
from apps.enrollments.models import Enrollment

from .choices import OrderStatus
from .exceptions import (
    AlreadyEnrolled,
    InvalidOrderStatusTransition,
    OrderAlreadyProcessed,
    OrderPaymentNotVerified,
)
from .models import Order, OrderItem


@transaction.atomic
def create_order(
    *,
    student,
    courses,
    payment_method,
    transaction_reference="",
    notes="",
):
    """
    Create an order and its order items atomically.

    Business rules:
    - A student cannot order a course they already have.
    - A student cannot create another order while a previous
      order for the same course is still pending.
    - Cancelled or rejected orders can be recreated.
    """

    if not courses:
        raise ValueError(
            "At least one course is required."
        )

    # Remove duplicate courses from the same request.
    unique_courses = {
        course.id: course
        for course in courses
    }

    courses = list(unique_courses.values())

    # ----------------------------------------------------------
    # Prevent duplicate enrollment / pending orders
    # ----------------------------------------------------------

    for course in courses:

        # Already enrolled?
        enrollment_exists = Enrollment.objects.filter(
            student=student,
            course=course,
        ).exists()

        if enrollment_exists:
            raise AlreadyEnrolled(
                f"You are already enrolled in "
                f"course: {course.title}"
            )

        # Existing pending order?
        pending_order_exists = (
            Order.objects
            .filter(
                student=student,
                status=OrderStatus.PENDING,
                items__course=course,
            )
            .exists()
        )

        if pending_order_exists:
            raise OrderAlreadyProcessed(
                f"You already have a pending order "
                f"for course: {course.title}"
            )

    # ----------------------------------------------------------
    # Calculate total
    # ----------------------------------------------------------

    total_amount = sum(
        course.price
        for course in courses
    )

    # ----------------------------------------------------------
    # Create order
    # ----------------------------------------------------------

    order = Order.objects.create(
        student=student,
        payment_method=payment_method,
        transaction_reference=transaction_reference,
        total_amount=total_amount,
        notes=notes,
        status=OrderStatus.PENDING,
    )

    # ----------------------------------------------------------
    # Create order items
    # ----------------------------------------------------------

    OrderItem.objects.bulk_create(
        [
            OrderItem(
                order=order,
                course=course,
                price=course.price,
            )
            for course in courses
        ]
    )

    return order


@transaction.atomic
def verify_payment(
    *,
    order,
    verified_by,
):
    """
    Verify manual payment for a pending order.
    """

    order = (
        Order.objects
        .select_for_update()
        .get(pk=order.pk)
    )

    if order.status != OrderStatus.PENDING:
        raise InvalidOrderStatusTransition(
            "Only pending orders can have "
            "their payment verified."
        )

    if order.payment_verified:
        return order

    order.payment_verified = True
    order.verified_by = verified_by
    order.verified_at = timezone.now()

    order.save(
        update_fields=[
            "payment_verified",
            "verified_by",
            "verified_at",
            "updated_at",
        ]
    )

    return order


@transaction.atomic
def approve_order(
    *,
    order,
):
    """
    Approve a verified order and create enrollments.
    """

    order = (
        Order.objects
        .select_for_update()
        .get(pk=order.pk)
    )

    if order.status != OrderStatus.PENDING:
        raise InvalidOrderStatusTransition(
            "Only pending orders can be approved."
        )

    if not order.payment_verified:
        raise OrderPaymentNotVerified(
            "Payment must be verified before approval."
        )

    order_items = (
        OrderItem.objects
        .select_related("course")
        .filter(order=order)
    )

    for item in order_items:

        # A student cannot enroll in their own course.
        if (
            item.course.instructor_id
            == order.student_id
        ):
            raise AlreadyEnrolled(
                "A student cannot enroll in "
                "their own course."
            )

        # Extra protection before creating enrollment.
        existing_enrollment = (
            Enrollment.objects
            .filter(
                student=order.student,
                course=item.course,
            )
            .first()
        )

        if existing_enrollment:
            raise AlreadyEnrolled(
                f"Already enrolled in course: "
                f"{item.course.title}"
            )

        try:
            create_enrollment(
                validated_data={
                    "student": order.student,
                    "course": item.course,
                }
            )

        except IntegrityError as exc:
            raise AlreadyEnrolled(
                f"Already enrolled in course: "
                f"{item.course.title}"
            ) from exc

    order.status = OrderStatus.APPROVED

    order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return order


@transaction.atomic
def reject_order(
    *,
    order,
):
    """
    Reject a pending order.
    """

    order = (
        Order.objects
        .select_for_update()
        .get(pk=order.pk)
    )

    if order.status != OrderStatus.PENDING:
        raise InvalidOrderStatusTransition(
            "Only pending orders can be rejected."
        )

    order.status = OrderStatus.REJECTED

    order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return order


@transaction.atomic
def cancel_order(
    *,
    order,
):
    """
    Cancel a pending order.
    """

    order = (
        Order.objects
        .select_for_update()
        .get(pk=order.pk)
    )

    if order.status != OrderStatus.PENDING:
        raise InvalidOrderStatusTransition(
            "Only pending orders can be cancelled."
        )

    order.status = OrderStatus.CANCELLED

    order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return order