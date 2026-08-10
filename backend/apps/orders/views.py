from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .exceptions import (
    AlreadyEnrolled,
    CourseNotPurchasable,
    InvalidOrderStatusTransition,
    OrderPaymentNotVerified,
)
from .permissions import (
    IsAdmin,
    IsOrderOwnerOrAdmin,
    IsStudent,
)
from .selectors import (
    get_order_by_id,
    get_student_orders,
)
from .serializers import (
    CreateOrderSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)
from .services import (
    approve_order,
    cancel_order,
    create_order,
    reject_order,
    verify_payment,
)


class OrderListCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        orders = get_student_orders(
            request.user,
        )

        serializer = OrderListSerializer(
            orders,
            many=True,
        )

        return Response(
            serializer.data,
        )

    def post(self, request):
        self.check_permissions(request)

        if request.user.role != "student":
            return Response(
                {
                    "detail": (
                        "Only students can create orders."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CreateOrderSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            order = create_order(
                student=request.user,
                courses=serializer.validated_data[
                    "courses"
                ],
                payment_method=serializer.validated_data[
                    "payment_method"
                ],
                transaction_reference=serializer.validated_data.get(
                    "transaction_reference",
                    "",
                ),
                notes=serializer.validated_data.get(
                    "notes",
                    "",
                ),
            )
        except (
            CourseNotPurchasable,
            AlreadyEnrolled,
        ) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class OrderDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrderOwnerOrAdmin,
    ]

    def get_object(self, order_id):
        return get_order_by_id(order_id)

    def get(self, request, order_id):
        order = self.get_object(order_id)

        self.check_object_permissions(
            request,
            order,
        )

        return Response(
            OrderDetailSerializer(order).data,
        )


class VerifyPaymentView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def post(self, request, order_id):
        order = get_order_by_id(order_id)

        serializer = OrderDetailSerializer(
            verify_payment(
                order=order,
                verified_by=request.user,
            )
        )

        return Response(
            serializer.data,
        )


class ApproveOrderView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def post(self, request, order_id):
        order = get_order_by_id(order_id)

        try:
            order = approve_order(
                order=order,
            )
        except (
            InvalidOrderStatusTransition,
            OrderPaymentNotVerified,
            AlreadyEnrolled,
        ) as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OrderDetailSerializer(order).data,
        )


class RejectOrderView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def post(self, request, order_id):
        order = get_order_by_id(order_id)

        try:
            order = reject_order(
                order=order,
            )
        except InvalidOrderStatusTransition as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OrderDetailSerializer(order).data,
        )


class CancelOrderView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsOrderOwnerOrAdmin,
    ]

    def post(self, request, order_id):
        order = get_order_by_id(order_id)

        self.check_object_permissions(
            request,
            order,
        )

        try:
            order = cancel_order(
                order=order,
            )
        except InvalidOrderStatusTransition as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            OrderDetailSerializer(order).data,
        )