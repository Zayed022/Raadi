import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiCheckCircle, FiGift } from "react-icons/fi";

const API = "https://raadi.onrender.com/api/v1/promoCode";

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    amount: "",
    expiresAt: "",
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      amount: "",
      expiresAt: "",
      isActive: true,
    });
    setEditingId(null);
  };

  const fetchCodes = async () => {
    const res = await axios.get(`${API}/`);
    setCodes(res.data.codes || []);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleSubmit = async () => {
    if (!form.code || !form.amount || !form.expiresAt) {
      alert("Code, Amount & Expiry are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(`${API}/`, form);
      }
      fetchCodes();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promo code?")) return;

    await axios.delete(`${API}/${id}`);
    fetchCodes();
  };

  const startEdit = (promo) => {
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      amount: promo.amount,
      expiresAt: promo.expiresAt.split("T")[0],
      isActive: promo.isActive,
    });
    setEditingId(promo._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-6">
        <FiGift className="text-purple-600" />
        Promo Code Management
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "✏ Edit Promo Code" : "➕ Create Promo Code"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CODE */}
          <div>
            <label className="font-medium text-gray-700">Promo Code *</label>
            <input
              className="w-full p-2 mt-1 border rounded-lg"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>

          {/* DISCOUNT TYPE */}
          <div>
            <label className="font-medium text-gray-700">Discount Type *</label>
            <select
              className="w-full p-2 mt-1 border rounded-lg"
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="font-medium text-gray-700">Discount Amount *</label>
            <input
              type="number"
              className="w-full p-2 mt-1 border rounded-lg"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {/* EXPIRY */}
          <div>
            <label className="font-medium text-gray-700">Expiry Date *</label>
            <input
              type="date"
              className="w-full p-2 mt-1 border rounded-lg"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>

          {/* ACTIVE */}
          <div>
            <label className="font-medium text-gray-700">Active</label>
            <select
              className="w-full p-2 mt-1 border rounded-lg"
              value={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.value })}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition"
          >
            {editingId ? "Update Promo Code" : "Create Promo Code"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <h2 className="text-2xl font-bold mb-4">All Promo Codes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {codes.map((promo) => (
          <div
            key={promo._id}
            className="bg-white p-6 shadow-md rounded-xl border hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{promo.code}</h3>

              {promo.isActive ? (
                <FiCheckCircle className="text-green-600" size={22} />
              ) : (
                <span className="text-red-500 text-sm">Inactive</span>
              )}
            </div>

            <p className="text-gray-600 mt-2">
              Discount:{" "}
              {promo.discountType === "percentage"
                ? `${promo.amount}%`
                : `₹${promo.amount}`}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Expires: {new Date(promo.expiresAt).toLocaleDateString()}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => startEdit(promo)}
                className="flex items-center gap-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-white shadow"
              >
                <FiEdit2 /> Edit
              </button>

              <button
                onClick={() => handleDelete(promo._id)}
                className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {codes.length === 0 && (
        <p className="text-gray-500 mt-6">No promo codes created yet.</p>
      )}
    </div>
  );
}
