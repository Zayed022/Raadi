import { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiTrash2, FiImage } from "react-icons/fi";

export default function AdminAboutBanner() {
  const API = "https://raadi-jdun.onrender.com/api/v1/aboutBanner/";

  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(API);
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const img = e.target.files[0];
    setFile(img);
    setPreview(img ? URL.createObjectURL(img) : "");
  };

  // Upload Banner
  const uploadBanner = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("bannerImage", file);
    formData.append("title", title);

    try {
      setLoading(true);
      await axios.post(API, formData);

      alert("Banner uploaded successfully!");
      setTitle("");
      setFile(null);
      setPreview("");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error uploading banner.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Banner by ID
  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner? This cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${API}${id}`);
      alert("Banner deleted successfully");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error deleting banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 max-w-6xl mx-auto">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Manage About Banners
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Upload Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upload New Banner</h2>

          <input
            type="text"
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Banner title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div
            className="border-2 border-dashed border-gray-400 rounded-xl p-6 
                       flex flex-col items-center justify-center text-gray-600 
                       hover:border-orange-500 transition cursor-pointer"
            onClick={() => document.getElementById("bannerUpload").click()}
          >
            <FiUpload size={35} />
            <p className="mt-2">Click to upload</p>

            <input
              type="file"
              id="bannerUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-full h-64 object-cover rounded-xl shadow-md"
            />
          )}

          <button
            onClick={uploadBanner}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-lg font-semibold text-white ${
              loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
            } transition`}
          >
            {loading ? "Uploading..." : "Upload Banner"}
          </button>
        </div>

        {/* Banner List */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">All Banners</h2>

          {banners.length === 0 ? (
            <div className="flex flex-col items-center text-gray-500">
              <FiImage size={50} />
              <p className="mt-2">No banners uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {banners.map((banner) => (
                <div key={banner._id} className="border rounded-xl p-4 shadow-sm">
                  <img
                    src={banner.bannerImage}
                    alt={banner.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <p className="mt-3 text-gray-700">
                    <strong>Title:</strong> {banner.title || "—"}
                  </p>

                  <button
                    onClick={() => deleteBanner(banner._id)}
                    disabled={loading}
                    className="mt-4 w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <FiTrash2 />
                    Delete Banner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}