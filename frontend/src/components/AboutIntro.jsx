import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AboutIntroSection() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://raadi.onrender.com/api/v1/aboutIntro/")
      .then((res) => setData(res.data.intro))
      .catch((err) => console.error("AboutIntro fetch error:", err));
  }, []);

  if (!data) return null;

  const goToProduct = () => {
    if (data.productId) {
      navigate(`/product/${data.productId}`);
    } else {
      navigate("/shop");
    }
  };

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

          {/* ⭐ Button now opens product details */}
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
        <div className="flex justify-center">
          <img
            src={data.mainImage}
            alt="Perfume bottle"
            className="w-[240px] md:w-[300px] lg:w-[340px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* RIGHT CARD */}
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
      </div>
    </section>
  );
}
