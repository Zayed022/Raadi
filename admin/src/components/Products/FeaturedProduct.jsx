import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminFeaturedProducts() {
  const API = "https://raadi.onrender.com/api/v1/featuredProduct";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    productId: "",
    position: "",
    image: null,
  });

  // Fetch featured products
  const fetchItems = async () => {
    try {
      const res = await axios.get(API);
      setItems(res.data.products || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image file
  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // Submit new Featured Product
  const handleSubmit = async () => {
    if (!form.productId || !form.position || !form.image) {
      alert("Product ID, Position & Image required");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) fd.append(key, val);
    });

    try {
      setLoading(true);
      await axios.post(API, fd);
      alert("Featured Product Created");
      setForm({
        title: "",
        subtitle: "",
        productId: "",
        position: "",
        image: null,
      });
      fetchItems();
    } catch (err) {
      console.error("Create Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this featured item?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        Manage Featured Products
      </h1>

      {/* Form Card */}
      <div className="
        bg-white 
        border 
        shadow-xl 
        rounded-2xl 
        p-8 
        mb-12 
        backdrop-blur-md 
        transition-all
      ">
        <h2 className="text-2xl font-semibold mb-6">Add New Featured Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Product ID */}
          <div>
            <label className="font-semibold">Product ID *</label>
            <input
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="Enter Product ID"
            />
          </div>

          {/* Position */}
          <div>
            <label className="font-semibold">Position *</label>
            <input
              name="position"
              type="number"
              value={form.position}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="1"
            />
          </div>

          {/* Title */}
          <div>
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="Featured Title"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="font-semibold">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="Small description..."
            />
          </div>

          {/* Image */}
          <div className="col-span-1 md:col-span-2">
            <label className="font-semibold">Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mt-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            mt-6 
            px-8 py-3 
            bg-blue-700 
            text-white 
            font-semibold 
            rounded-lg 
            hover:bg-blue-800 
            shadow-lg 
            transition
          "
        >
          {loading ? "Saving..." : "Add Featured Product"}
        </button>
      </div>

      {/* List Section */}
      <div className="bg-white border shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Featured Product List</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 italic">No featured products added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {items.map((item) => (
              <div
                key={item._id}
                className="
                  bg-gray-50 
                  border 
                  rounded-xl 
                  p-5 
                  shadow-md 
                  hover:shadow-xl 
                  transition-all
                "
              >
                <img
                  src={item.image}
                  className="w-full h-40 object-cover rounded-lg shadow mb-4"
                />

                <h3 className="font-bold text-lg">{item.title || "No Title"}</h3>
                <p className="text-gray-600 text-sm">{item.subtitle}</p>

                <div className="mt-3 text-sm">
                  <p><b>Product ID:</b> {item.product}</p>
                  <p><b>Position:</b> {item.position}</p>
                </div>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="
                    mt-4 
                    bg-red-600 
                    text-white 
                    px-4 py-2 
                    rounded-lg 
                    hover:bg-red-700 
                    shadow
                  "
                >
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
