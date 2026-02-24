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
      {!banner ? (
        <div className="w-full aspect-[16/9] bg-gray-200 animate-pulse" />
      ) : (
        <div
          className="relative w-full aspect-[16/9] overflow-hidden bg-black"
        >
          <img
            src={banner.bannerImage}
            alt="Home Banner"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`
              absolute inset-0
              w-full h-full
              object-cover
              object-center
              transition-opacity duration-700 ease-in-out
              ${loaded ? "opacity-100" : "opacity-0"}
            `}
          />
  
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
      )}
    </section>
  );
}
