import { useEffect, useState } from "react";
import axios from "axios";
import { FiUpload, FiTrash2, FiVideo, FiRefreshCcw } from "react-icons/fi";

const API = "https://raadi.onrender.com/api/v1/video-section";

export default function AdminVideoSection() {
  const [videoData, setVideoData] = useState(null);
  const [form, setForm] = useState({
    videoUrl: "",
    thumbnailImage: null,
  });

  const [preview, setPreview] = useState(null);

  // Fetch video section
  const fetchVideo = async () => {
    try {
      const res = await axios.get(`${API}/`);
      setVideoData(res.data.video || null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  // Thumbnail handler
  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, thumbnailImage: file });
    setPreview(URL.createObjectURL(file));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!form.thumbnailImage) {
      alert("Thumbnail image is required");
      return;
    }

    const fd = new FormData();
    fd.append("thumbnailImage", form.thumbnailImage);
    fd.append("videoUrl", form.videoUrl);

    try {
      await axios.post(`${API}/`, fd);
      fetchVideo();
      setForm({ videoUrl: "", thumbnailImage: null });
      setPreview(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!videoData) return;
    if (!confirm("Are you sure you want to delete the video section?")) return;

    try {
      await axios.delete(`${API}/delete`);
      setVideoData(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 mb-8">
        <FiVideo className="text-red-500" />
        Manage Video Section
      </h1>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiUpload /> Upload / Replace Video Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* VIDEO URL */}
          <div>
            <label className="block text-gray-700 font-medium">Video URL (YouTube)</label>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              className="w-full p-3 border rounded-lg mt-2"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
            {form.videoUrl && (
              <iframe
                src={form.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-48 rounded-lg mt-3 shadow"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* THUMBNAIL UPLOAD */}
          <div>
            <label className="block text-gray-700 font-medium">Thumbnail Image *</label>
            <input type="file" onChange={handleThumbnail} className="mt-3" />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl shadow mt-4"
              />
            )}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition flex items-center gap-2"
        >
          <FiRefreshCcw /> {videoData ? "Replace Video Section" : "Create Video Section"}
        </button>
      </div>

      {/* EXISTING VIDEO DISPLAY */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Current Active Video Section</h2>

        {!videoData && <p className="text-gray-500">No video section uploaded yet.</p>}

        {videoData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* VIDEO EMBED */}
            <div>
              <iframe
                src={videoData.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-60 rounded-xl shadow"
                allowFullScreen
              ></iframe>
            </div>

            {/* THUMBNAIL */}
            <div>
              <img
                src={videoData.thumbnailImage}
                className="w-full h-60 object-cover rounded-xl shadow"
                alt="Thumbnail"
              />
            </div>

            {/* DELETE BUTTON */}
            <div className="col-span-2 flex justify-end">
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-black transition shadow"
              >
                <FiTrash2 /> Delete Video Section
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
