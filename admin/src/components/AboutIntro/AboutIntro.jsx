import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAboutIntro() {
  const [loading, setLoading] = useState(false);
  const [intro, setIntro] = useState(null);

  // Form States
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [rightCardTitle, setRightCardTitle] = useState("");
  const [rightPoints, setRightPoints] = useState([""]);
  const [productId, setProductId] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch Existing Intro
  const fetchIntro = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/aboutIntro/");
      if (res.data.intro) {
        const d = res.data.intro;
        setIntro(d);
        setEyebrow(d.eyebrow || "");
        setTitle(d.title || "");
        setDescription(d.description || "");
        setButtonText(d.buttonText || "");
        setButtonLink(d.buttonLink || "");
        setRightCardTitle(d.rightCardTitle || "");
        setRightPoints(d.rightPoints?.length ? d.rightPoints : [""]);
        setProductId(d.productId || "");
        setPreviewImage(d.mainImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIntro();
  }, []);

  // Reset Form For Creating New
  const resetForm = () => {
    setIntro(null);
    setEyebrow("");
    setTitle("");
    setDescription("");
    setButtonText("");
    setButtonLink("");
    setRightCardTitle("");
    setRightPoints([""]);
    setProductId("");
    setMainImage(null);
    setPreviewImage(null);
  };

  // Handle Points Editing
  const updatePoint = (index, value) => {
    const updated = [...rightPoints];
    updated[index] = value;
    setRightPoints(updated);
  };

  const addPoint = () => setRightPoints([...rightPoints, ""]);
  const removePoint = (index) => setRightPoints(rightPoints.filter((_, i) => i !== index));

  // Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Create / Update Handler
  const handleSubmit = async () => {
    if (!mainImage && !intro) return alert("Main image required for first upload");
    if (!productId) return alert("Product ID is required");

    const formData = new FormData();
    formData.append("eyebrow", eyebrow);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("buttonText", buttonText);
    formData.append("buttonLink", buttonLink);
    formData.append("rightCardTitle", rightCardTitle);
    formData.append("productId", productId);
    formData.append("rightPoints", rightPoints.join("|"));
    if (mainImage) formData.append("mainImage", mainImage);

    try {
      setLoading(true);
      await axios.post(
        "https://raadi.onrender.com/api/v1/aboutIntro/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Intro Section Saved Successfully!");
      fetchIntro();
    } catch (err) {
      console.error(err);
      alert("Error saving intro section");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!window.confirm("Delete this intro section permanently?")) return;

    try {
      await axios.delete("https://raadi.onrender.com/api/v1/aboutIntro/delete");
      alert("Intro deleted");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error deleting intro");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
        Manage About Intro Section
      </h1>

      {/* LAYOUT — LEFT PREVIEW + RIGHT FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT PANEL - PREVIEW */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Current Intro Preview</h2>

          {!intro && (
            <p className="text-gray-500 italic">
              No intro exists yet. Create a new one → 
            </p>
          )}

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-72 object-contain rounded-lg shadow-md mb-5 bg-gray-100"
            />
          )}

          {intro && (
            <div className="space-y-2 text-gray-700">
              <p><b>Eyebrow:</b> {eyebrow}</p>
              <p><b>Title:</b> {title}</p>
              <p><b>Description:</b> {description}</p>
              <p><b>Button Text:</b> {buttonText}</p>
              <p><b>Button Link:</b> {buttonLink}</p>
              <p><b>Right Card Title:</b> {rightCardTitle}</p>
              <p><b>Points:</b></p>

              <ul className="list-disc ml-6">
                {rightPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

              <p><b>Product ID:</b> {productId}</p>

              <button
                onClick={handleDelete}
                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Intro
              </button>
            </div>
          )}

          {/* Create New Button */}
          <button
            onClick={resetForm}
            className="mt-6 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-black transition"
          >
            + Create New Intro
          </button>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">

          <h2 className="text-xl font-semibold mb-4">Create / Edit Intro Section</h2>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-medium">Main Image</label>
            <input type="file" onChange={handleImageChange} className="block mt-1" />
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="space-y-4">
              <Input label="Eyebrow" value={eyebrow} setValue={setEyebrow} />
              <Input label="Title" value={title} setValue={setTitle} />
              <Textarea label="Description" value={description} setValue={setDescription} />
              <Input label="Product ID" value={productId} setValue={setProductId} />
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <Input label="Button Text" value={buttonText} setValue={setButtonText} />
              <Input label="Button Link" value={buttonLink} setValue={setButtonLink} />
              <Input label="Right Card Title" value={rightCardTitle} setValue={setRightCardTitle} />

              {/* Right Points */}
              <div>
                <label className="font-medium">Right Points</label>
                {rightPoints.map((p, idx) => (
                  <div key={idx} className="flex gap-2 mt-2">
                    <input
                      className="w-full border px-3 py-2 rounded-lg"
                      value={p}
                      onChange={(e) => updatePoint(idx, e.target.value)}
                    />
                    <button
                      onClick={() => removePoint(idx)}
                      className="bg-red-500 text-white px-3 rounded-lg"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPoint}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg"
                >
                  + Add Point
                </button>
              </div>

            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save Intro Section"}
          </button>

        </div>
      </div>
    </div>
  );
}

/* REUSABLE INPUT COMPONENTS */
function Input({ label, value, setValue }) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, setValue }) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <textarea
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-24 focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
    </div>
  );
}
