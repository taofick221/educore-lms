import OrderCard from "./OrderCard";
import type { Order } from "../../types/order";

interface Props {
  orders: Order[];
}

function OrderList({
  orders,
}: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-10">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500 sm:h-12 sm:w-12">
          📦
        </div>

        <p className="mt-3 text-xs font-semibold text-gray-500 sm:text-sm">
          You have no orders yet.
        </p>

        <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
          Your course purchases will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
        />
      ))}
    </div>
  );
}

export default OrderList;