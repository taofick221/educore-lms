from django.db import models


class NotificationType(models.TextChoices):
    # Orders
    ORDER_CREATED = "order_created", "Order Created"
    PAYMENT_VERIFIED = "payment_verified", "Payment Verified"
    ORDER_APPROVED = "order_approved", "Order Approved"
    ORDER_REJECTED = "order_rejected", "Order Rejected"
    ORDER_CANCELLED = "order_cancelled", "Order Cancelled"

    # Learning
    ENROLLMENT_CREATED = (
        "enrollment_created",
        "Enrollment Created",
    )
    COURSE_COMPLETED = (
        "course_completed",
        "Course Completed",
    )
    CERTIFICATE_ISSUED = (
        "certificate_issued",
        "Certificate Issued",
    )

    # Courses
    COURSE_PUBLISHED = (
        "course_published",
        "Course Published",
    )
    COURSE_UPDATED = (
        "course_updated",
        "Course Updated",
    )

    # Reviews
    NEW_REVIEW = "new_review", "New Review"