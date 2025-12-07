import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHomeBanner() {
  const API = "https://raadi.onrender.com/api/v1/homeBanner";

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    bannerImage: null,
  });

  // Fetch Active Banner
  const fetchBanner = async () => {
    try {
      const res = await axios.get(API);
      setBanner(res.data.banner || null);
    } catch (err) {
      console.error("Fetch Banner Error:", err);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Handle Input
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, bannerImage: e.target.files[0] });
  };

  // Upload Banner
  const handleSubmit = async () => {
    if (!form.bannerImage) return alert("Banner image is required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("bannerImage", form.bannerImage);

    try {
      setLoading(true);
      await axios.post(API, fd);
      alert("Banner uploaded successfully!");

      setForm({ title: "", bannerImage: null });
      fetchBanner();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteBanner = async () => {
    if (!window.confirm("Are you sure you want to delete the banner?")) return;

    try {
      await axios.delete(`${API}/delete`);
      alert("Banner deleted");
      fetchBanner();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        Manage Home Banner
      </h1>

      {/* Upload Banner Card */}
      <div className="
        bg-white shadow-xl border rounded-2xl p-8 mb-12 
        backdrop-blur-lg
      ">
        <h2 className="text-2xl font-semibold mb-6">Upload New Banner</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Title */}
          <div>
            <label className="font-semibold">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleInput}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="Optional"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold">Banner Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mt-2"
            />

            {/* Preview */}
            {form.bannerImage && (
              <img
                src={URL.createObjectURL(form.bannerImage)}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            mt-6 
            px-8 py-3 
            bg-blue-700 text-white 
            font-semibold 
            rounded-lg 
            hover:bg-blue-800 
            shadow-md 
            transition
          "
        >
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      </div>

      {/* Active Banner Display */}
      <div className="bg-white border shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-semibold mb-6">Current Active Banner</h2>

        {!banner ? (
          <p className="text-gray-500 italic">No banner uploaded yet.</p>
        ) : (
          <div className="space-y-6">

            <img
              src={banner.bannerImage}
              className="w-full h-[350px] object-cover rounded-xl shadow-lg"
              alt="Current Banner"
            />

            <h3 className="text-xl font-bold">{banner.title || "Untitled Banner"}</h3>

            <button
              onClick={deleteBanner}
              className="
                px-6 py-3 
                bg-red-600 
                text-white 
                rounded-lg 
                hover:bg-red-700 
                shadow-md 
                transition
              "
            >
              Delete Banner
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
