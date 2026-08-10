from django.urls import path

from .views import (
    ApproveOrderView,
    CancelOrderView,
    OrderDetailView,
    OrderListCreateView,
    RejectOrderView,
    VerifyPaymentView,
)

urlpatterns = [
    path(
        "",
        OrderListCreateView.as_view(),
        name="order-list-create",
    ),
    path(
        "<uuid:order_id>/",
        OrderDetailView.as_view(),
        name="order-detail",
    ),
    path(
        "<uuid:order_id>/verify-payment/",
        VerifyPaymentView.as_view(),
        name="order-verify-payment",
    ),
    path(
        "<uuid:order_id>/approve/",
        ApproveOrderView.as_view(),
        name="order-approve",
    ),
    path(
        "<uuid:order_id>/reject/",
        RejectOrderView.as_view(),
        name="order-reject",
    ),
    path(
        "<uuid:order_id>/cancel/",
        CancelOrderView.as_view(),
        name="order-cancel",
    ),
]