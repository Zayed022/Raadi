import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
      <p className="text-gray-700 mt-3">
        Your Cash on Delivery order has been placed successfully.
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Order ID: {orderId}
      </p>

      <Link
        to="/"
        className="mt-6 bg-orange-600 text-white px-6 py-2 rounded-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
