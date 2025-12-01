import { useEffect, useState } from "react";
import axios from "axios";
import { FiHeart } from "react-icons/fi";

export default function BestSeller() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/bestseller")
      .then(res => setData(res.data.bestSellers))
      .catch(err => console.log("Best seller fetch error:", err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-center text-4xl font-bold text-blue-900">Best Seller</h2>
      <p className="text-center text-gray-600 mt-2">
        Do not wait any longer and discover other related Perfumes products
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
        {data.map((item) => (
          <div
            key={item._id}
            className="relative group cursor-pointer bg-white rounded-xl p-5 shadow-md border border-gray-200
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Wishlist Icon */}
            <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
              <FiHeart size={22} className="hover:text-orange-500" />
            </button>

            {/* Image Box */}
            <div className="bg-gray-100 rounded-xl px-6 py-8 flex justify-center items-center overflow-hidden">
              <img
                src={item.product.images?.[0]}
                className="w-[180px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Open Button Hover Overlay */}
              <span
                className="absolute opacity-0 group-hover:opacity-100 bottom-[38%] bg-[#F4C28B] text-black
                px-6 py-2 font-medium rounded-lg transition-all duration-300 shadow-lg"
              >
                Open
              </span>
            </div>

            {/* Text */}
            <h3 className="text-3xl font-semibold text-gray-900 mt-4">
              {item.product.name}
            </h3>

            <div className="flex justify-center items-center gap-3">
              <p className="line-through text-gray-400 text-xl">₹ {item.product.mrp}</p>
              <p className="text-2xl font-bold text-orange-600">₹ {item.product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
