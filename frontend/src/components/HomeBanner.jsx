import { useEffect, useState } from "react";
import axios from "axios";

export default function HomeBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/homeBanner/")
      .then((res) => setBanner(res.data.banner))
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  if (!banner) return null;

  return (
    <section
      className="w-full h-[90vh] md:h-[95vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${banner.bannerImage})`,
        backgroundColor: banner.bgColor || "#f5d7b0"
      }}
    >
      {/* Optional overlay for future use */}
      <div className="bg-black/0 w-full h-full flex items-center justify-center">
        {/* Intentionally no text (per requirement) */}
      </div>
    </section>
  );
}
