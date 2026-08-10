import { Link } from "react-router-dom";
import type { Order } from "../../types/order";

interface Props {
  order: Order;
}

function OrderCard({ order }: Props) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:rounded-2xl sm:p-5"
    >
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
            Order
          </p>

          <h2 className="mt-0.5 truncate text-xs font-bold text-gray-900 group-hover:text-indigo-600 sm:text-sm">
            {order.id}
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold capitalize text-gray-600 sm:px-3 sm:text-xs">
          {order.status}
        </span>
      </div>

      {/* ==================================================
          Items
      ================================================== */}

      <div className="mt-3 space-y-1.5 sm:mt-4">
        {order.items.map((item) => (
          <p
            key={item.id}
            className="truncate text-xs text-gray-600 sm:text-sm"
          >
            {item.course_title}
          </p>
        ))}
      </div>

      {/* ==================================================
          Payment / Total
      ================================================== */}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:mt-4 sm:pt-4">
        <span className="truncate text-[10px] text-gray-500 sm:text-xs sm:text-sm">
          Payment: {order.payment_method}
        </span>

        <span className="shrink-0 text-sm font-extrabold text-gray-900 sm:text-base">
          ৳{order.total_amount}
        </span>
      </div>
    </Link>
  );
}

export default OrderCard;