import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

// ✅ CONTEXT
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function SpecialProduct() {
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  // ✅ CONTEXT
  const { cart, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // ------------------------------------------------------------
  // Fetch ONLY special product (unchanged)
  // ------------------------------------------------------------
  useEffect(() => {
    const loadSpecial = async () => {
      try {
        const res = await axios.get(
          "https://raadi-jdun.onrender.com/api/v1/featuredProduct/active"
        );

        const special = res.data.special;
        if (!special || !special.productId) return;

        setData(special);
      } catch (err) {
        console.log("Special fetch error:", err);
      }
    };

    loadSpecial();
  }, []);

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  const getQty = (id) => {
    const item = cart.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  // ------------------------------------------------------------
  // UI (UNCHANGED)
  // ------------------------------------------------------------
  if (!data || !data.productId) return null;

  const product = data.productId;
  const pid = product._id;

  const qty = getQty(pid); // ✅ REPLACED
  const isWishlisted = isInWishlist(pid); // ✅ REPLACED

  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={data.image}
            alt={data.title}
            loading="lazy"
            className="w-[450px] object-cover rounded-lg drop-shadow-2xl transition-all duration-300 hover:scale-[1.03]"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold uppercase tracking-tight">
            {data.title}
          </h1>

          <p className="text-lg text-gray-300 max-w-lg">
            {data.description}
          </p>

          <p className="text-4xl font-bold">
            ₹{data.startingPrice.toLocaleString()}
          </p>

          {/* ❤️ Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)} // ✅ UPDATED
            className="flex items-center gap-3 text-lg hover:text-orange-400 transition"
          >
            {isWishlisted ? ( // ✅ UPDATED
              <FaHeart size={24} className="text-orange-400" />
            ) : (
              <FiHeart size={24} />
            )}
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* 🛒 Cart Controls */}
          {qty > 0 ? ( // ✅ UPDATED
            <div className="flex items-center gap-5">
              <button
                onClick={() => updateQuantity(pid, qty - 1)} // ✅
                className="text-2xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                –
              </button>

              <span className="text-xl font-semibold">{qty}</span>

              <button
                onClick={() => updateQuantity(pid, qty + 1)} // ✅
                className="text-2xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)} // ✅ UPDATED
              className="px-10 py-3 bg-orange-500 rounded-md text-lg font-semibold hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          )}

          {/* View Details */}
          <button
            onClick={() => navigate(`/product/${pid}`)}
            className="
              mt-4 px-8 py-3 bg-white/10 border border-white/20 
              text-gray-200 rounded-xl font-medium flex items-center gap-2
              backdrop-blur-md hover:bg-white/20 hover:border-white/40 hover:text-white
              transition-all duration-300
            "
          >
            View Product Details <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}