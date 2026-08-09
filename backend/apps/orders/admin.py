from django.contrib import admin

from .models import Order, OrderItem


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