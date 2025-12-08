import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeBanner() {
  const [banner, setBanner] = useState(null);
  const [loaded, setLoaded] = useState(false); // track image load for fade-in

  useEffect(() => {
    axios
      .get("https://raadi.onrender.com/api/v1/homeBanner/", {
        cache: "force-cache",
      })
      .then((res) => setBanner(res.data.banner))
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Placeholder skeleton until image loads */}
      {!banner ? (
        <div className="w-full h-[55vh] sm:h-[65vh] md:h-[80vh] lg:h-[90vh] bg-gray-200 animate-pulse"></div>
      ) : (
        <div
          className="
            w-full 
            h-[55vh] 
            sm:h-[65vh] 
            md:h-[80vh] 
            lg:h-[90vh]
            relative
            overflow-hidden
          "
          style={{
            backgroundColor: banner.bgColor || "#f5d7b0",
          }}
        >
          {/* Optimized Banner Image */}
          <img
  loading="lazy"
  src={banner.bannerImage}
  alt="Home Banner"
  onLoad={() => setLoaded(true)}
  className={`
    w-full h-full
    object-contain       
    sm:object-cover      
    transition-opacity duration-700
    ${loaded ? "opacity-100" : "opacity-0"}
  `}
/>


          {/* Low-quality blurry preview while loading */}
          {!loaded && (
            <div
              className="
              absolute inset-0 
              bg-gray-300 blur-xl 
              animate-pulse
            "
            ></div>
          )}
        </div>
      )}
    </section>
  );
}
