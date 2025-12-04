import { useEffect, useState } from "react";
import axios from "axios";

export default function VideoSection() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/videoSection/")
      .then((res) => setData(res.data.video))
      .catch((err) => console.error("Video fetch error:", err));
  }, []);

  if (!data) return null;

  return (
    <>
      {/* ==== VIDEO THUMBNAIL SECTION ==== */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
          onClick={() => setOpen(true)}
        >
          <img
            src={data.thumbnailImage}
            alt="Video Thumbnail"
            className="
              w-full 
              h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px]
              object-cover rounded-2xl
              transition-transform duration-300 group-hover:scale-105
            "
          />

          {/* PLAY BUTTON */}
          <button
            className="
              absolute inset-0 m-auto 
              h-16 w-16 sm:h-20 sm:w-20 
              bg-[#f4b464] text-white rounded-full 
              flex items-center justify-center 
              text-3xl sm:text-4xl 
              shadow-xl transition-all
              hover:scale-110 active:scale-95
            "
          >
            ►
          </button>
        </div>
      </section>

      {/* ==== VIDEO MODAL ==== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="
              bg-black rounded-xl overflow-hidden 
              w-full max-w-3xl 
              shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[430px]"
              src={data.videoUrl.replace("watch?v=", "embed/")}
              title="Video Player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
