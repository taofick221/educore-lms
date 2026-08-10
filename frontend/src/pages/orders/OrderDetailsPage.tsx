import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../hooks/useOrders";

function OrderDetailsPage() {
  const { orderId } = useParams<{
    orderId: string;
  }>();

  const {
    order,
    loading,
    error,
  } = useOrder(orderId!);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 text-center text-red-600">
        {error || "Order not found."}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <Link
          to="/orders"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to orders
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Order Details
        </h1>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 font-medium">
              {order.id}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
            {order.status}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-4"
            >
              <span>{item.course_title}</span>

              <span className="font-medium">
                ৳{item.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Payment method
            </span>

            <span className="capitalize">
              {order.payment_method}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Transaction reference
            </span>

            <span>
              {order.transaction_reference || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>

            <span>
              ৳{order.total_amount}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-sm">
            Payment verified:{" "}
            <strong>
              {order.payment_verified
                ? "Yes"
                : "Pending"}
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailsPage;