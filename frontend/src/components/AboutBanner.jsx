import { useEffect, useState } from "react";
import axios from "axios";

export default function AboutBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/aboutBanner/")
      .then(res => setBanner(res.data.banner))
      .catch(err => console.error("Banner fetch error:", err));
  }, []);

  if (!banner) return null;

  return (
    <section
      className="w-full h-[90vh] md:h-[95vh] flex items-center justify-center bg-black"
    >
      <img
        src={banner.bannerImage}
        alt="About Banner"
        className="w-full h-full object-contain"  // no crop, full visible
      />
    </section>
  );
}
