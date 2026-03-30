import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ✅ CONTEXT
import { useWishlist } from "../context/WishlistContext";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ CONTEXT
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    axios
      .get("https://raadi-jdun.onrender.com/api/v1/products/top-products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log("Top product fetch error:", err));
  }, []);

  const openProductDetails = (id) => navigate(`/product/${id}`);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center py-16 ">
        <h2 className="text-[36px] md:text-[42px] font tracking-wide text-[#0b1b3f]">
          Top Products
        </h2>

        <p className="mt-4 text-[20px] md:text-[22px] font-medium text-[#1c2b4a]">
          Shop our newest arrivals and crowd favorites.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-2xl shadow-md border border-gray-200 p-5
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative bg-[#f2f1f6] rounded-xl h-72 flex items-center justify-center overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover OPEN Button */}
              <button
                onClick={() => openProductDetails(product._id)}
                className="absolute inset-0 m-auto w-32 h-12 opacity-0 group-hover:opacity-100
                transition-all duration-300 bg-orange-500 text-white font-semibold rounded-xl
                flex items-center justify-center text-lg"
              >
                Open
              </button>

              {/* ❤️ Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)} // ✅ UPDATED
                className="absolute top-4 right-4 z-50"
              >
                {isInWishlist(product._id) ? ( // ✅ UPDATED
                  <FaHeart size={30} className="text-orange-500" />
                ) : (
                  <Heart
                    size={30}
                    className="text-gray-700 hover:text-orange-500 transition-all"
                  />
                )}
              </button>
            </div>

            {/* Product Name */}
            <h3
              className="text-xl font-semibold mt-4 text-[#0b1b3f] group-hover:text-orange-600 transition"
              onClick={() => openProductDetails(product._id)}
            >
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="flex items-center gap-3 mt-2">
              <p className="line-through text-gray-400">
                ₹{product.mrp?.toLocaleString("en-IN")}
              </p>
              <p className="text-xl font-bold text-[#0b1b3f]">
                ₹{product.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-14">
        <button
          onClick={() => navigate("/shop")}
          className="
            bg-[#E6B174]
            hover:bg-[#dca35e]
            text-white
            font-semibold
            text-lg
            px-16
            py-4
            rounded-xl
            shadow-md
            transition-all
            duration-300
            hover:shadow-lg
            hover:-translate-y-0.5
            active:translate-y-0
          "
        >
          View All
        </button>
      </div>
    </section>
  );
}