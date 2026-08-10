import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/orders";

interface Props {
  courseId: string;
}

function CheckoutForm({
  courseId,
}: Props) {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("bkash");

  const [
    transactionReference,
    setTransactionReference,
  ] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const order = await createOrder({
        courses: [courseId],
        payment_method: paymentMethod,
        transaction_reference:
          transactionReference,
        notes,
      });

      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      const data = error?.response?.data;

      if (
        data &&
        typeof data === "object"
      ) {
        const messages = Object.values(data)
          .flat()
          .join(" ");

        setError(
          messages ||
            "Failed to create order.",
        );
      } else {
        setError(
          "Failed to create order.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5"
    >
      {/* ==================================================
          Payment Method
      ================================================== */}

      <div>
        <label
          htmlFor="payment-method"
          className="mb-1.5 block text-xs font-bold text-gray-700 sm:mb-2 sm:text-sm"
        >
          Payment Method
        </label>

        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(
              event.target.value,
            )
          }
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
        >
          <option value="bkash">
            bKash
          </option>

          <option value="nagad">
            Nagad
          </option>

          <option value="bank">
            Bank
          </option>
        </select>
      </div>

      {/* ==================================================
          Transaction Reference
      ================================================== */}

      <div>
        <label
          htmlFor="transaction-reference"
          className="mb-1.5 block text-xs font-bold text-gray-700 sm:mb-2 sm:text-sm"
        >
          Transaction Reference
        </label>

        <input
          id="transaction-reference"
          type="text"
          value={transactionReference}
          onChange={(event) =>
            setTransactionReference(
              event.target.value,
            )
          }
          placeholder="e.g. BKASH123456"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
        />

        <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
          Enter the reference from your
          payment transaction.
        </p>
      </div>

      {/* ==================================================
          Notes
      ================================================== */}

      <div>
        <label
          htmlFor="order-notes"
          className="mb-1.5 block text-xs font-bold text-gray-700 sm:mb-2 sm:text-sm"
        >
          Notes
        </label>

        <textarea
          id="order-notes"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          rows={3}
          placeholder="Add any additional information..."
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
        />
      </div>

      {/* ==================================================
          Error
      ================================================== */}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
        >
          {error}
        </div>
      )}

      {/* ==================================================
          Submit
      ================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-3 sm:text-sm"
      >
        {loading
          ? "Creating order..."
          : "Place Order"}
      </button>
    </form>
  );
}

export default CheckoutForm;