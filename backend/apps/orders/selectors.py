from django.shortcuts import get_object_or_404

from .models import Order


def get_orders():
    return (
        Order.objects.active()
        .select_related(
            "student",
            "verified_by",
        )
        .prefetch_related(
            "items",
            "items__course",
        )
    )


def get_order_by_id(order_id):
    return get_object_or_404(
        get_orders(),
        id=order_id,
    )


def get_student_orders(student):
    return (
        get_orders()
        .filter(student=student)
    )


def get_pending_orders():
    return (
        get_orders()
        .filter(status="pending")
    )


def get_order_items(order):
    return (
        order.items
        .select_related("course")
        .all()
    )