import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCategories() {
  const API = "https://raadi.onrender.com/api/v1/category";

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [editing, setEditing] = useState(null); // category being edited
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // CREATE OR UPDATE
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });

      if (editing) {
        await axios.put(`${API}/${editing}`, fd);
        alert("Category Updated");
      } else {
        await axios.post(API, fd);
        alert("Category Created");
      }

      setForm({ name: "", description: "", image: null });
      setEditing(null);
      fetchCategories();

    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Prefill form for editing
  const startEdit = (cat) => {
    setEditing(cat._id);
    setForm({
      name: cat.name,
      description: cat.description,
      image: null, // keep original unless uploading new
    });
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", description: "", image: null });
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        Manage Categories
      </h1>

      {/* FORM CARD */}
      <div className="bg-white border shadow-xl rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6">
          {editing ? "Edit Category" : "Create New Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="font-medium">Category Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg mt-1"
              placeholder="e.g. Perfumes, Body Mist"
            />
          </div>

          <div>
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg mt-1"
              rows="2"
              placeholder="Category description..."
            />
          </div>

          <div>
            <label className="font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : editing ? "Update Category" : "Create Category"}
          </button>

          {editing && (
            <button
              onClick={cancelEdit}
              className="bg-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white border shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">All Categories</h2>

        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left border-b">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={cat.image}
                        className="w-16 h-16 object-cover rounded-lg shadow"
                      />
                    </td>

                    <td className="p-3 font-semibold">{cat.name}</td>
                    <td className="p-3 text-gray-600">{cat.slug}</td>
                    <td className="p-3 text-gray-700">
                      {cat.description || <i>No description</i>}
                    </td>

                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
