from django.db import models


class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"
    CANCELLED = "cancelled", "Cancelled"


class PaymentMethod(models.TextChoices):
    BKASH = "bkash", "bKash"
    NAGAD = "nagad", "Nagad"
    ROCKET = "rocket", "Rocket"
    BANK_TRANSFER = "bank_transfer", "Bank Transfer"
    CASH = "cash", "Cash"