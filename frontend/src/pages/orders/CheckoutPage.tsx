import { useSearchParams } from "react-router-dom";
import CheckoutForm from "../../components/orders/CheckoutForm";

function CheckoutPage() {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  if (!courseId) {
    return (
      <div className="py-20 text-center text-red-600">
        Course is required.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">
        Checkout
      </h1>

      <p className="mb-8 text-gray-600">
        Complete your order.
      </p>

      <CheckoutForm courseId={courseId} />
    </section>
  );
}

export default CheckoutPage;