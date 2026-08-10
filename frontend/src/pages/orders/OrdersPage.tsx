import OrderList from "../../components/orders/OrderList";
import { useOrders } from "../../hooks/useOrders";

function OrdersPage() {
  const {
    orders,
    loading,
    error,
  } = useOrders();

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="mt-2 text-gray-600">
          View your course purchases and payment status.
        </p>
      </div>

      <OrderList orders={orders} />
    </section>
  );
}

export default OrdersPage;