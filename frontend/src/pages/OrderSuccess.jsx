import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FiDownload } from "react-icons/fi";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();

  const { clearCart } = useCart();

  const paymentMethod = location.state?.paymentMethod || "cod";

  useEffect(() => {
    clearCart();
  }, []);

  // ✅ INVOICE DOWNLOAD FUNCTION
  const downloadInvoice = () => {
    window.open(
      `https://raadi-jdun.onrender.com/api/v1/order/invoice/${orderId}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      
      <h1 className="text-3xl font-bold text-green-600">
        Order Confirmed!
      </h1>

      <p className="text-gray-700 mt-3">
        {paymentMethod === "cod"
          ? "Your Cash on Delivery order has been placed successfully."
          : "Your payment was successful and your order has been confirmed."}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Order ID: <span className="font-medium">{orderId}</span>
      </p>

      <p className="mt-4 text-sm text-gray-500 max-w-md">
        You will receive updates regarding your order status soon.
      </p>

      {/* ✅ ACTION BUTTONS */}
      <div className="flex gap-4 mt-6 flex-wrap justify-center">

        <Link
          to="/"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>

        {/* ✅ NEW BUTTON */}
        <button
          onClick={downloadInvoice}
          className="flex items-center gap-2 border border-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <FiDownload />
          Download Invoice
        </button>

      </div>
    </div>
  );
}