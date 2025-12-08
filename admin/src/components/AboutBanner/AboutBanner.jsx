import { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiTrash2, FiImage } from "react-icons/fi";

export default function AdminAboutBanner() {
  const API = "https://raadi.onrender.com/api/v1/aboutBanner/";

  const [banner, setBanner] = useState(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current banner
  const fetchBanner = async () => {
    try {
      const res = await axios.get(API);
      setBanner(res.data.banner);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Handle Image Selection + Preview
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
      const res = await axios.post(API, formData);

      alert("Banner uploaded successfully!");
      setTitle("");
      setFile(null);
      setPreview("");
      fetchBanner();
    } catch (err) {
      console.error(err);
      alert("Error uploading banner.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Banner
  const deleteBanner = async () => {
    if (!window.confirm("Delete current banner? This cannot be undone.")) return;

    try {
      setLoading(true);
      await axios.delete(`${API}delete`);
      alert("Banner deleted successfully");
      setBanner(null);
      fetchBanner();
    } catch (err) {
      console.error(err);
      alert("Error deleting banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 max-w-4xl mx-auto">

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Manage About Banner
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Upload Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upload New Banner</h2>

          <label className="block font-medium text-gray-600 mb-1">
            Banner Title (Optional)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block font-medium text-gray-600 mb-2">
            Select Banner Image
          </label>

          <div
  className="border-2 border-dashed border-gray-400 rounded-xl p-5 
             flex flex-col items-center justify-center text-gray-600 
             hover:border-orange-500 transition cursor-pointer relative"
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
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
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

        {/* Current Banner */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Current Banner</h2>

          {!banner ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiImage size={50} />
              <p className="mt-2">No Banner Uploaded Yet</p>
            </div>
          ) : (
            <div>
              <img
                src={banner.bannerImage}
                alt="Banner"
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />

              <p className="mt-3 text-gray-700">
                <strong>Title:</strong> {banner.title || "—"}
              </p>

              <button
                onClick={deleteBanner}
                disabled={loading}
                className="mt-4 w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Delete Banner
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
