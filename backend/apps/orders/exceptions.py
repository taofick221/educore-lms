class OrderError(Exception):
    """Base exception for order-related errors."""


class InvalidOrderStatusTransition(OrderError):
    """Raised when an invalid order status transition is attempted."""


class OrderPaymentNotVerified(OrderError):
    """Raised when an order payment has not been verified."""


class OrderAlreadyProcessed(OrderError):
    """Raised when an already processed order is modified."""


class CourseNotPurchasable(OrderError):
    """Raised when a course cannot be purchased."""


class AlreadyEnrolled(OrderError):
    """Raised when the student is already enrolled in a course."""