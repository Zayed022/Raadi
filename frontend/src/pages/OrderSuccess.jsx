import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();

  const { clearCart } = useCart();

  // Detect payment method from navigation state
  const paymentMethod = location.state?.paymentMethod || "cod";

  useEffect(() => {
    // ✅ Clear cart after successful order
    clearCart();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-green-600">
        Order Confirmed!
      </h1>

      {/* Dynamic message */}
      <p className="text-gray-700 mt-3">
        {paymentMethod === "cod"
          ? "Your Cash on Delivery order has been placed successfully."
          : "Your payment was successful and your order has been confirmed."}
      </p>

      {/* Order ID */}
      <p className="mt-2 text-sm text-gray-500">
        Order ID: <span className="font-medium">{orderId}</span>
      </p>

      {/* Extra info */}
      <p className="mt-4 text-sm text-gray-500 max-w-md">
        You will receive updates regarding your order status soon.
      </p>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Link
          to="/"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>

        
      </div>
    </div>
  );
}