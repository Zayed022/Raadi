import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/homeBanner/")
      .then((res) => setBanner(res.data.banner))
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  if (!banner) {
    return (
      <div className="w-full h-[50vh] md:h-[70vh] bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      
      {/* Background Image Container */}
      <div
        className="
          w-full 
          h-[55vh] 
          sm:h-[65vh] 
          md:h-[80vh] 
          lg:h-[90vh] 
          xl:h-[95vh] 
          2xl:h-[100vh]
          relative
        "
        style={{
          backgroundImage: `url(${banner.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: banner.bgColor || "#f5d7b0",
        }}
      >
        {/* Overlay (transparent but ready for future use) */}
        <div className="absolute inset-0 bg-black/0"></div>
      </div>

      {/* Optional clickable CTA Future Section */}
      {/* (currently empty per requirement) */}
      <div className="absolute inset-0 flex items-center justify-center"></div>
    </section>
  );
}
