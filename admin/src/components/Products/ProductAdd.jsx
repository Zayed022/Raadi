import { useEffect, useState } from "react";
import axios from "axios";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "react-hot-toast";

const API = "https://raadi.onrender.com/api/v1";

export default function ProductAdd() {
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    discount: "",
    brand: "",
    category: "",
    isTopProduct: false,
    isFeatureProduct: false,
    isBestSeller: false,
  });

  const [imageFile, setImageFile] = useState(null);

  // Fetch Categories
  useEffect(() => {
    axios
      .get(`${API}/category`)
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => console.error(err));
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      value = checked;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Upload
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.stock) {
      return toast.error("Please fill required fields");
    }

    if (!imageFile) {
      return toast.error("Product image is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", imageFile);

      const res = await axios.post(`${API}/products/add-product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product created successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          mrp: "",
          stock: "",
          discount: "",
          brand: "",
          category: "",
          isTopProduct: false,
          isFeatureProduct: false,
          isBestSeller: false,
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* GRID FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="text"
            name="name"
            placeholder="Product Name *"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            name="price"
            placeholder="Price *"
            value={form.price}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={form.mrp}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock *"
            value={form.stock}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          {/* Category */}
          <select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="border p-3 rounded-lg w-full"
>
  <option value="">Select Category *</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full h-28"
        />

        {/* BOOLEAN OPTIONS */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isTopProduct"
              checked={form.isTopProduct}
              onChange={handleChange}
            />
            Top Product
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatureProduct"
              checked={form.isFeatureProduct}
              onChange={handleChange}
            />
            Feature Product
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={form.isBestSeller}
              onChange={handleChange}
            />
            Best Seller
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Product Image *</label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 mx-auto object-contain"
              />
            ) : (
              <div className="flex flex-col items-center">
                <FiUploadCloud className="text-4xl mb-2 text-gray-500" />
                <span className="text-gray-600">Click to upload product image</span>
              </div>
            )}

            <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-4 rounded-lg text-white font-semibold transition
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}
          `}
        >
          {loading ? "Uploading..." : "Create Product"}
        </button>
      </form>
    </section>
  );
}
