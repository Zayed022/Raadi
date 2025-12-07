import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

const API = "https://raadi.onrender.com/api/v1/specialProduct";
const PRODUCT_API = "https://raadi.onrender.com/api/v1/products";

export default function AdminSpecialProduct() {
  const [specials, setSpecials] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startingPrice: "",
    productId: "",
    isActive: false,
    image: null,
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      startingPrice: "",
      productId: "",
      isActive: false,
      image: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  const fetchSpecials = async () => {
    const res = await axios.get(`${API}/`);
    setSpecials(res.data.specials || []);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${PRODUCT_API}/`);
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetchSpecials();
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.productId || !form.startingPrice) {
      alert("Title, Product & Starting Price are required.");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value === null) return;
      fd.append(key, value);
    });

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, fd);
      } else {
        await axios.post(`${API}/`, fd);
      }

      fetchSpecials();
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this special product?")) return;
    await axios.delete(`${API}/${id}`);
    fetchSpecials();
  };

  const startEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      startingPrice: item.startingPrice,
      productId: item.productId,
      isActive: item.isActive,
      image: null,
    });
    setPreview(item.image);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 mb-8">
        <FiStar className="text-yellow-500" />
        Manage Special Products
      </h1>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "✏ Edit Special Product" : "➕ Add Special Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* TITLE */}
          <div>
            <label className="font-medium text-gray-700">Title *</label>
            <input
              className="w-full p-2 border rounded-lg mt-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* STARTING PRICE */}
          <div>
            <label className="font-medium text-gray-700">Starting Price *</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg mt-1"
              value={form.startingPrice}
              onChange={(e) =>
                setForm({ ...form, startingPrice: e.target.value })
              }
            />
          </div>

          {/* PRODUCT SELECT */}
          <div>
            <label className="font-medium text-gray-700">Select Product *</label>
            <select
              className="w-full p-2 border rounded-lg mt-1"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIVE */}
          <div>
            <label className="font-medium text-gray-700">Active?</label>
            <select
              className="w-full p-2 border rounded-lg mt-1"
              value={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.value })}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg mt-1"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700">Image *</label>
            <input type="file" className="mt-2" onChange={handleFile} />
            {preview && (
              <img
                src={preview}
                className="w-40 h-40 object-cover mt-3 rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow font-semibold hover:bg-yellow-600 transition"
          >
            {editingId ? "Update Special Product" : "Create Special Product"}
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

      {/* LIST OF ALL SPECIALS */}
      <h2 className="text-2xl font-bold mb-4">All Special Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {specials.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition border"
          >
            <img
              src={item.image}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h3 className="text-xl font-bold mt-4">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>

            <p className="text-gray-800 font-semibold mt-2">
              Starting Price: ₹{item.startingPrice}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {item.isActive ? (
                <FiCheckCircle className="text-green-500" size={20} />
              ) : (
                <span className="text-red-500">Inactive</span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => startEdit(item)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center gap-2"
              >
                <FiEdit2 /> Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 flex items-center gap-2"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {specials.length === 0 && (
        <p className="text-gray-500 mt-6">No Special Products created yet.</p>
      )}
    </div>
  );
}
