import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function AboutBanner() {
  const [banner, setBanner] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch Banner
  useEffect(() => {
    let active = true;

    axios
      .get("https://raadi.onrender.com/api/v1/aboutBanner/", { timeout: 8000 })
      .then((res) => {
        if (active) setBanner(res.data.banner || null);
      })
      .catch((err) => console.error("Banner fetch error:", err));

    return () => {
      active = false;
    };
  }, []);

  // Image load handler
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  if (!banner) {
    return (
      <section className="w-full h-[90vh] md:h-[95vh] bg-gray-200 animate-pulse"></section>
    );
  }

  return (
    <section className="relative w-full h-[90vh] md:h-[95vh] flex items-center justify-center bg-black overflow-hidden">

      {/* Skeleton Loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
      )}

      {/* Banner Image */}
      <img
        src={banner.bannerImage}
        alt="About Banner"
        loading="lazy"
        decoding="async"           // don't block main thread
        onLoad={handleLoad}
        className={`
          w-full h-full object-contain transition-opacity duration-700
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </section>
  );
}
