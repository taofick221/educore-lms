import uuid

from django.conf import settings
from django.db import models
from ..managers import OrderManager
from apps.common.models import TimeStampedModel

from ..choices import OrderStatus, PaymentMethod
from ..constants import (
    MAX_ORDER_NOTES_LENGTH,
    MAX_PRICE_DIGITS,
    MAX_TRANSACTION_REFERENCE_LENGTH,
    PRICE_DECIMAL_PLACES,
)


class Order(TimeStampedModel):
    objects = OrderManager()
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
    )

    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        db_index=True,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
    )

    transaction_reference = models.CharField(
        max_length=MAX_TRANSACTION_REFERENCE_LENGTH,
        blank=True,
    )

    total_amount = models.DecimalField(
        max_digits=MAX_PRICE_DIGITS,
        decimal_places=PRICE_DECIMAL_PLACES,
    )

    payment_verified = models.BooleanField(
        default=False,
        db_index=True,
    )

    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="verified_orders",
        blank=True,
        null=True,
    )

    verified_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    notes = models.CharField(
        max_length=MAX_ORDER_NOTES_LENGTH,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(
                fields=["student", "status"],
            ),
            models.Index(
                fields=["status", "payment_verified"],
            ),
            models.Index(
                fields=["created_at"],
            ),
            models.Index(
                fields=["payment_method"],
            ),
        ]

        constraints = [
            models.CheckConstraint(
                condition=models.Q(total_amount__gte=0),
                name="order_total_amount_gte_zero",
            ),
        ]

    def __str__(self):
        return f"{self.student.email} - {self.id}"