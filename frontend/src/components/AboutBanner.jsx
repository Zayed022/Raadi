import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AboutBanner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();

  // Fetch banners
  useEffect(() => {
    axios
      .get("https://raadi-jdun.onrender.com/api/v1/aboutBanner/")
      .then((res) => {
        setBanners(res.data.banners || []);
      })
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  // Slide + Zoom Logic
  useEffect(() => {
    if (banners.length === 0) return;

    setZoom(false); // Reset zoom when slide changes

    const zoomTimer = setTimeout(() => {
      setZoom(true); // Start zoom after mount
    }, 100); // Small delay ensures smooth animation

    const slideTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(slideTimer);
    };
  }, [current, banners]);

  if (!banners.length) {
    return (
      <section className="w-full h-[90vh] md:h-[95vh] bg-gray-200 animate-pulse" />
    );
  }

  return (
    <section className="relative w-full h-[90vh] md:h-[95vh] overflow-hidden bg-black">

      {banners.map((banner, index) => (
        <div
  key={banner._id}
  onClick={() => navigate("/shop")}
  className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${
    index === current ? "opacity-100 z-10" : "opacity-0 z-0"
  }`}
>
          <img
  src={banner.bannerImage}
  alt={banner.title || "About Banner"}
  className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out will-change-transform"
  style={{
    transform:
      index === current && zoom
        ? "scale(1.03) translateY(-8px)"
        : "scale(1)",
  }}
/>

          <div className="absolute inset-0 bg-black/5" />

          {banner.title && (
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
               
              </h2>
            </div>
          )}
        </div>
      ))}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}