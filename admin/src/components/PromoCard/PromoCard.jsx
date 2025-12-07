import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiUploadCloud } from "react-icons/fi";

const API = "https://raadi.onrender.com/api/v1/promoCard";

export default function AdminPromoCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for create & update
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    bgColor: "#ffffff",
    position: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      bgColor: "#ffffff",
      position: "",
      isActive: true,
    });
    setImageFile(null);
    setPreviewImage(null);
    setEditingId(null);
  };

  const fetchCards = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setCards(res.data.cards || []);
    } catch (error) {
      console.error("Fetch PromoCards Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.position) {
      alert("Title & Position are required!");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, fd);
      } else {
        await axios.post(`${API}/`, fd);
      }

      resetForm();
      fetchCards();
    } catch (error) {
      console.error("Save PromoCard Error:", error);
    }
  };

  const handleDelete = async (id) => {
    const yes = confirm("Are you sure you want to delete this promo card?");
    if (!yes) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchCards();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const startEdit = (card) => {
    setForm({
      title: card.title,
      subtitle: card.subtitle,
      buttonText: card.buttonText,
      buttonLink: card.buttonLink,
      bgColor: card.bgColor,
      position: card.position,
      isActive: card.isActive,
    });
    setEditingId(card._id);
    setPreviewImage(card.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        🎨 Promo Cards Management
      </h1>

      {/* CREATE / UPDATE FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "✏ Update Promo Card" : "➕ Add New Promo Card"}
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <label className="text-gray-700 font-medium">Title *</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Position */}
          <div>
            <label className="text-gray-700 font-medium">Position *</label>
            <input
              type="number"
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-gray-700 font-medium">Subtitle</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </div>

          {/* BG Color */}
          <div>
            <label className="text-gray-700 font-medium">Background Color</label>
            <input
              type="color"
              className="w-12 h-12 p-1 rounded border mt-1"
              value={form.bgColor}
              onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
            />
          </div>

          {/* Button Text */}
          <div>
            <label className="text-gray-700 font-medium">Button Text</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            />
          </div>

          {/* Button Link */}
          <div>
            <label className="text-gray-700 font-medium">Button Link</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.buttonLink}
              onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
            />
          </div>

          {/* Active Toggle */}
          <div>
            <label className="text-gray-700 font-medium">Is Active</label>
            <select
              className="w-full mt-1 p-2 rounded-lg border"
              value={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.value })}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-gray-700 font-medium">Promo Image *</label>
            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">
                <FiUploadCloud size={20} />
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </label>

              {previewImage && (
                <img
                  src={previewImage}
                  className="w-20 h-20 rounded shadow"
                  alt="Preview"
                />
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition"
        >
          {editingId ? "Update Promo Card" : "Add Promo Card"}
        </button>

        {/* Reset Button */}
        {editingId && (
          <button
            onClick={resetForm}
            className="ml-4 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* LIST OF PROMO CARDS */}
      <h2 className="text-2xl font-bold mb-4">📋 All Promo Cards</h2>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="text-gray-500">No promo cards found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
              style={{ backgroundColor: card.bgColor }}
            >
              <img
                src={card.image}
                className="w-full h-40 object-cover rounded-lg shadow"
                alt="Promo"
              />

              <h3 className="text-xl font-bold mt-3">{card.title}</h3>
              <p className="text-gray-700">{card.subtitle}</p>

              <p className="text-sm text-gray-500 mt-1">
                Position: {card.position}
              </p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className={card.isActive ? "text-green-600" : "text-red-600"}>
                  {card.isActive ? "Active" : "Inactive"}
                </span>
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => startEdit(card)}
                  className="flex items-center gap-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-white font-medium"
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() => handleDelete(card._id)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
