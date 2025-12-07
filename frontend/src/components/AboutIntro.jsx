import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AboutIntroSection() {
  const [data, setData] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  // ===============================
  // Fetch Data (Optimized)
  // ===============================
  useEffect(() => {
    let active = true;

    axios
      .get("https://raadi.onrender.com/api/v1/aboutIntro/", { timeout: 8000 })
      .then((res) => {
        if (active) setData(res.data.intro || null);
      })
      .catch((err) => console.error("AboutIntro fetch error:", err));

    return () => {
      active = false; // prevents memory leak
    };
  }, []);

  // ===============================
  // Navigation Handler (Memoized)
  // ===============================
  const goToProduct = useCallback(() => {
    if (!data) return;

    if (data.productId) navigate(`/product/${data.productId}`);
    else navigate("/shop");
  }, [data]);

  // ===============================
  // Memoized Right Card
  // ===============================
  const rightCard = useMemo(() => {
    if (!data) return null;

    return (
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 py-8">
        <h3 className="text-2xl font-bold text-[#0b1444] mb-4">
          {data.rightCardTitle || "Product Features"}
        </h3>

        <ul className="space-y-3 text-gray-600 text-sm md:text-base">
          {(data.rightPoints || []).map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-[5px] h-2 w-2 rounded-full bg-[#f29224]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [data]);

  // ===============================
  // Loading State
  // ===============================
  if (!data) {
    return (
      <section className="w-full py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1.1fr] gap-12 items-center">

        {/* LEFT TEXT */}
        <div className="space-y-5">
          {data.eyebrow && (
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-gray-500">
              {data.eyebrow}
            </p>
          )}

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0b1444] leading-tight">
            {data.title}
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-xl">
            {data.description}
          </p>

          {data.buttonText && (
            <button
              onClick={goToProduct}
              className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-lg
                         bg-[#f29224] text-white font-semibold text-base shadow-md
                         hover:bg-[#dd7b10] hover:shadow-lg transition-all duration-200"
            >
              {data.buttonText} →
            </button>
          )}
        </div>

        {/* CENTER IMAGE */}
        <div className="flex justify-center relative">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
          )}

          <img
            src={data.mainImage}
            alt="Perfume bottle"
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-[240px] md:w-[300px] lg:w-[340px] object-contain drop-shadow-2xl transition-opacity duration-700 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* RIGHT CARD (Memoized for faster rendering) */}
        {rightCard}
      </div>
    </section>
  );
}
