import { useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/order", { withCredentials: true })
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.log("Order fetch error:", err));
  }, []);

  const downloadInvoice = (orderId) => {
    window.open(`http://localhost:8000/api/v1/order/invoice/${orderId}`, "_blank");
  };

  return (
    <>
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-[#0b1b3f] mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-10 text-center">
          <FiPackage className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
                >
                  <FiDownload /> Download Invoice
                </button>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-sm text-gray-700 mb-1">
                  Delivery Address
                </h3>
                <p className="text-xs text-gray-600">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.pincode}
                  <br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-5 border-t pt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.product?._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-16 h-16 rounded-md border object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* FOOTER SUMMARY */}
              <div className="mt-6 border-t pt-4 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Order Total:</span> ₹
                  {order.totalAmount}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Payment Status:</span>{" "}
                  {order.paymentInfo.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Order Status:</span>{" "}
                  {order.orderStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}
