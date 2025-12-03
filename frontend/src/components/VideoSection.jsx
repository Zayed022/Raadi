import { useEffect, useState } from "react";
import axios from "axios";

export default function VideoSection() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/videoSection/")
      .then(res => setData(res.data.video))
      .catch(err => console.error("Video fetch error:", err));
  }, []);

  if (!data) return null;

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
          onClick={() => setOpen(true)}
        >
          <img
            src={data.thumbnailImage}
            alt="Video thumbnail"
            className="w-full h-[420px] object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105"
          />

          <button
            className="absolute inset-0 m-auto h-20 w-20 bg-[#f4b464] text-white rounded-full 
                       flex items-center justify-center text-4xl shadow-lg transition-all
                       hover:scale-110 active:scale-95 animate-pulse"
          >
            ►
          </button>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-black rounded-xl overflow-hidden w-[90%] max-w-4xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="450px"
              src={data.videoUrl.replace("watch?v=", "embed/")}
              title="Video player"
              className="w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
