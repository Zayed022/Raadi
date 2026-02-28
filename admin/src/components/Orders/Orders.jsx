import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://raadi-jdun.onrender.com/api/v1";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/order/all`, {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });

      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  /* ================= STATUS UPDATE ================= */

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);

      await axios.patch(`${API}/order/${orderId}/status`, {
        status: newStatus,
      });

      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Order Management
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, orderId..."
          className="px-4 py-2 border rounded-lg w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchOrders();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Orders */}
      <div className="space-y-4">

        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow border"
            >

              {/* Order Summary */}
              <div
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )
                }
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {order.customerDetails?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Order ID: {order._id}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="font-semibold text-gray-900">
                    ₹{order.totalAmount}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.orderStatus]
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t p-6 bg-gray-50 space-y-6">

                  {/* Status Update */}
                  <div>
                    <label className="font-semibold mr-3">
                      Update Status:
                    </label>
                    <select
                      value={order.orderStatus}
                      disabled={updatingStatus === order._id}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer + Address */}
                  <div className="grid md:grid-cols-2 gap-6">

                    <div>
                      <h3 className="font-semibold mb-2">
                        Customer Details
                      </h3>
                      <p>Name: {order.customerDetails?.name}</p>
                      <p>Email: {order.customerDetails?.email}</p>
                      <p>Phone: {order.customerDetails?.phone}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        Shipping Address
                      </h3>
                      <p>{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.phone}</p>
                      <p>
                        {order.shippingAddress?.landmark}
                      </p>
                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </p>
                      <p>Pincode: {order.shippingAddress?.pincode}</p>
                    </div>

                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold mb-4">
                      Ordered Items
                    </h3>

                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.product?.images?.[0]}
                              alt={item.product?.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div>
                              <div className="font-semibold">
                                {item.product?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </div>
                            </div>
                          </div>

                          <div className="font-semibold">
                            ₹{item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-semibold mb-2">
                      Payment Info
                    </h3>
                    <p>
                      Status: {order.paymentInfo?.status}
                    </p>
                    <p>
                      Transaction ID:{" "}
                      {order.paymentInfo?.transactionId || "N/A"}
                    </p>
                  </div>

                  {order.deliveredAt && (
                    <div className="text-green-600 font-semibold">
                      Delivered At:{" "}
                      {new Date(order.deliveredAt).toLocaleString()}
                    </div>
                  )}

                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-white shadow rounded">
          Page {page} of {pages}
        </span>

        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}