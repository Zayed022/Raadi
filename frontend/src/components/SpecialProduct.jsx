import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SpecialProduct() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/featuredProduct/active")
      .then((res) => setData(res.data.special))
      .catch((err) => console.log("Special product fetch error:", err));
  }, []);

  if (!data) return null;

  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6">

        {/* Image */}
        <div className="flex justify-center">
          <img
            src={data.image}
            alt={data.title}
            className="w-[380px] lg:w-[450px] object-cover drop-shadow-2xl rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="space-y-6 text-left">
          <h1 className="text-5xl font-extrabold tracking-wide uppercase">
            {data.title}
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-md">
            {data.description}
          </p>

          <div className="flex items-center gap-16 mt-6">
            <button
              onClick={() => navigate(data.buttonLink)}
              className="px-10 py-3 text-lg font-semibold rounded-md border border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              {data.buttonText || "Shop Now"}
            </button>

            <div>
              <p className="text-sm text-gray-400">Starting From:</p>
              <p className="text-4xl font-bold">₹ {data.startingPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
