import uuid

from django.db import models

from apps.common.models import TimeStampedModel
from apps.courses.models import Course

from ..constants import (
    MAX_PRICE_DIGITS,
    PRICE_DECIMAL_PLACES,
)


class OrderItem(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    order = models.ForeignKey(
        "orders.Order",
        on_delete=models.CASCADE,
        related_name="items",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.PROTECT,
        related_name="order_items",
    )

    price = models.DecimalField(
        max_digits=MAX_PRICE_DIGITS,
        decimal_places=PRICE_DECIMAL_PLACES,
    )

    class Meta:
        ordering = ["created_at"]

        indexes = [
            models.Index(
                fields=["order"],
            ),
            models.Index(
                fields=["course"],
            ),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["order", "course"],
                name="unique_course_per_order",
            ),
            models.CheckConstraint(
                condition=models.Q(price__gte=0),
                name="order_item_price_gte_zero",
            ),
        ]

    def __str__(self):
        return f"{self.order_id} - {self.course.title}"