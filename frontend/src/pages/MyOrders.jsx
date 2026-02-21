import { useEffect, useState } from "react";
import axios from "axios";
import { FiPackage, FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://raadi.onrender.com/api/v1/order", {
        withCredentials: true,
      })
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((err) => console.log("Order fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const downloadInvoice = (orderId) => {
    window.open(
      `https://raadi.onrender.com/api/v1/order/invoice/${orderId}`,
      "_blank"
    );
  };

  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 text-xs rounded-full font-medium capitalize inline-block";

    switch (status?.toLowerCase()) {
      case "confirmed":
        return `${base} bg-blue-100 text-blue-700`;
      case "shipped":
        return `${base} bg-purple-100 text-purple-700`;
      case "delivered":
        return `${base} bg-green-100 text-green-700`;
      case "cancelled":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* PAGE HEADER */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 mt-2">
              Track, manage and download your past purchases.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white shadow-sm rounded-2xl p-16 text-center border">
              <FiPackage className="mx-auto text-5xl text-gray-300 mb-5" />
              <h3 className="text-lg font-semibold text-gray-800">
                No Orders Yet
              </h3>
              <p className="text-gray-500 mt-2">
                Once you place an order, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* TOP HEADER */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6 border-b bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <span className={getStatusBadge(order.orderStatus)}>
                        {order.orderStatus}
                      </span>

                      <button
                        onClick={() => downloadInvoice(order._id)}
                        className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-800 transition"
                      >
                        <FiDownload />
                        Invoice
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="px-8 py-6 grid md:grid-cols-3 gap-8">
                    {/* LEFT – ITEMS */}
                    <div className="md:col-span-2 space-y-6">
                      {order.items.map((item) => (
                        <div
                          key={item.product?._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.product?.images?.[0]}
                              alt={item.product?.name}
                              className="w-20 h-20 rounded-xl object-cover border"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {item.product?.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="font-semibold text-gray-900">
                            ₹{item.price}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* RIGHT – SUMMARY */}
                    <div className="bg-gray-50 rounded-2xl p-6 border">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Order Summary
                      </h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Items Total</span>
                          <span>₹{order.totalAmount}</span>
                        </div>

                        <div className="flex justify-between text-gray-600">
                          <span>Payment</span>
                          <span className="capitalize">
                            {order.paymentInfo.status}
                          </span>
                        </div>

                        <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-gray-900">
                          <span>Total</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="mt-6 text-xs text-gray-500">
                        <p className="font-medium text-gray-700 mb-1">
                          Shipping Address
                        </p>
                        <p>
                          {order.shippingAddress.fullName}
                          <br />
                          {order.shippingAddress.landmark},{" "}
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                          <br />
                          {order.shippingAddress.pincode}
                          <br />
                          Phone: {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}