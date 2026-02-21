import { useEffect, useState } from "react";
import axios from "axios";

export default function AboutBanner() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Fetch all banners
  useEffect(() => {
    let active = true;

    axios
      .get("https://raadi.onrender.com/api/v1/aboutBanner/", {
        timeout: 8000,
      })
      .then((res) => {
        if (active) {
          setBanners(res.data.banners || []);
        }
      })
      .catch((err) => console.error("Banner fetch error:", err));

    return () => {
      active = false;
    };
  }, []);

  // Auto Slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setLoaded(false); // reset fade
    }, 5000); // 5 sec per slide

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) {
    return (
      <section className="w-full h-[90vh] md:h-[95vh] bg-gray-200 animate-pulse"></section>
    );
  }

  return (
    <section className="relative w-full h-[90vh] md:h-[95vh] overflow-hidden bg-black">

      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* Image */}
          <img
            src={banner.bannerImage}
            alt={banner.title || "About Banner"}
            onLoad={() => setLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-transform duration-[6000ms] ease-out
              ${index === current ? "scale-110" : "scale-100"}
            `}
          />

          {/* Optional Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Optional Title */}
          {banner.title && (
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
                {banner.title}
              </h2>
            </div>
          )}
        </div>
      ))}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrent(index);
                setLoaded(false);
              }}
              className={`w-3 h-3 rounded-full transition 
                ${index === current ? "bg-white" : "bg-white/50"}
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}