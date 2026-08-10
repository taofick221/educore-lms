from django.contrib import admin, messages

from .models import Order, OrderItem
from .services import (
    approve_order,
    cancel_order,
    reject_order,
    verify_payment,
)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

    readonly_fields = (
        "course",
        "price",
        "created_at",
        "updated_at",
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "status",
        "payment_method",
        "total_amount",
        "payment_verified",
        "verified_by",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_method",
        "payment_verified",
        "is_active",
    )

    search_fields = (
        "id",
        "student__email",
        "transaction_reference",
    )

    readonly_fields = (
        "id",
        "status",
        "total_amount",
        "payment_verified",
        "verified_by",
        "verified_at",
        "created_at",
        "updated_at",
    )

    inlines = [
        OrderItemInline,
    ]

    actions = [
        "verify_selected_payments",
        "approve_selected_orders",
        "reject_selected_orders",
        "cancel_selected_orders",
    ]

    @admin.action(description="Verify payment")
    def verify_selected_payments(self, request, queryset):
        success_count = 0

        for order in queryset:
            try:
                verify_payment(
                    order=order,
                    verified_by=request.user,
                )

                success_count += 1

            except Exception as exc:
                self.message_user(
                    request,
                    f"Order {order.id}: {exc}",
                    level=messages.ERROR,
                )

        if success_count:
            self.message_user(
                request,
                f"{success_count} payment(s) verified successfully.",
                level=messages.SUCCESS,
            )

    @admin.action(description="Approve order and enroll student")
    def approve_selected_orders(self, request, queryset):
        success_count = 0

        for order in queryset:
            try:
                approve_order(order=order)

                success_count += 1

            except Exception as exc:
                self.message_user(
                    request,
                    f"Order {order.id}: {exc}",
                    level=messages.ERROR,
                )

        if success_count:
            self.message_user(
                request,
                (
                    f"{success_count} order(s) approved "
                    "and enrollment(s) created successfully."
                ),
                level=messages.SUCCESS,
            )

    @admin.action(description="Reject order")
    def reject_selected_orders(self, request, queryset):
        success_count = 0

        for order in queryset:
            try:
                reject_order(order=order)

                success_count += 1

            except Exception as exc:
                self.message_user(
                    request,
                    f"Order {order.id}: {exc}",
                    level=messages.ERROR,
                )

        if success_count:
            self.message_user(
                request,
                f"{success_count} order(s) rejected successfully.",
                level=messages.SUCCESS,
            )

    @admin.action(description="Cancel order")
    def cancel_selected_orders(self, request, queryset):
        success_count = 0

        for order in queryset:
            try:
                cancel_order(order=order)

                success_count += 1

            except Exception as exc:
                self.message_user(
                    request,
                    f"Order {order.id}: {exc}",
                    level=messages.ERROR,
                )

        if success_count:
            self.message_user(
                request,
                f"{success_count} order(s) cancelled successfully.",
                level=messages.SUCCESS,
            )