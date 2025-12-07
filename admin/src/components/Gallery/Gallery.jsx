import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminGallery() {
  const API = "https://raadi.onrender.com/api/v1/gallery";

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      const res = await axios.get(API);
      setImages(res.data.images || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!form.image) return alert("Image is required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("image", form.image);

    try {
      setLoading(true);
      await axios.post(API, fd);
      alert("Image Added Successfully");
      setForm({ title: "", description: "", image: null });
      fetchImages();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        Manage Gallery
      </h1>

      {/* Upload Card */}
      <div className="
        bg-white 
        border 
        shadow-xl 
        rounded-2xl 
        p-8 
        mb-12 
        backdrop-blur-md 
      ">
        <h2 className="text-2xl font-semibold mb-6">Add New Gallery Image</h2>

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

          {/* Description */}
          <div>
            <label className="font-semibold">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleInput}
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="Optional"
            />
          </div>

          {/* Image Upload */}
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
          {loading ? "Uploading..." : "Add Image"}
        </button>
      </div>

      {/* Gallery List */}
      <div className="
        bg-white 
        border 
        shadow-xl 
        rounded-2xl 
        p-8
      ">
        <h2 className="text-2xl font-semibold mb-6">
          Gallery Images ({images.length})
        </h2>

        {images.length === 0 ? (
          <p className="text-gray-500 italic">No gallery images yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {images.map((img) => (
              <div
                key={img._id}
                className="
                  bg-gray-50 
                  border 
                  shadow 
                  rounded-xl 
                  p-4 
                  hover:shadow-xl 
                  transition-all 
                  group
                "
              >
                {/* Image */}
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="
                    w-full 
                    h-56 
                    object-cover 
                    rounded-lg 
                    shadow-md 
                    mb-4 
                    group-hover:scale-[1.02] 
                    transition
                  "
                />

                {/* Info */}
                <h3 className="font-semibold text-lg">
                  {img.title || "Untitled"}
                </h3>
                <p className="text-gray-600 text-sm">{img.description}</p>

                {/* Delete button */}
                <button
                  onClick={() => deleteImage(img._id)}
                  className="
                    mt-4 
                    bg-red-600 
                    text-white 
                    px-4 py-2 
                    rounded-lg 
                    hover:bg-red-700 
                    shadow-md 
                    transition
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
