import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist/", {
        withCredentials: true,
      });

      setWishlist(res.data.wishlist?.products || []);
    } catch (err) {
      console.error("Wishlist Fetch Error:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete("http://localhost:8000/api/v1/wishlist/remove", {
        data: { productId },
        withCredentials: true,
      });

      if (res.data.success) {
        setWishlist(wishlist.filter((item) => item._id !== productId));
      }
    } catch (err) {
      console.log("Remove Wishlist Error:", err);
    }
  };

  const openProduct = (id) => navigate(`/product/${id}`);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-900">
        Your Wishlist
      </h2>
      <p className="text-center text-gray-600 mt-2">
        Items you love and wish to buy later
      </p>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="text-center mt-20">
          <FaHeart size={70} className="mx-auto text-gray-300" />
          <h3 className="text-xl mt-3 font-semibold text-gray-700">
            Your wishlist is empty
          </h3>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="
            grid grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-4 
            gap-6 md:gap-8 mt-10
          "
        >
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="
                relative bg-white rounded-xl 
                p-4 shadow-md border border-gray-200 
                hover:shadow-lg hover:-translate-y-1 
                transition-all duration-300 group
              "
            >
              {/* Remove Button */}
              <button
                onClick={() => removeItem(product._id)}
                className="
                  absolute top-3 right-3 z-50 bg-white shadow p-2 rounded-full 
                  hover:bg-red-500 hover:text-white transition
                "
              >
                <FaTrash size={14} />
              </button>

              {/* Image */}
              <div
                onClick={() => openProduct(product._id)}
                className="
                  bg-gray-100 rounded-lg px-4 py-6 
                  flex justify-center items-center 
                  cursor-pointer overflow-hidden
                "
              >
                <img
                  src={product.images?.[0]}
                  className="
                    w-[120px] h-[140px] sm:w-[140px] sm:h-[160px] 
                    object-contain transition duration-300 
                    group-hover:scale-105
                  "
                  alt={product.name}
                />
              </div>

              {/* Name */}
              <h3
                className="text-lg font-semibold text-gray-900 mt-3 text-center line-clamp-2"
                onClick={() => openProduct(product._id)}
              >
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex justify-center items-center gap-2 mt-1">
                <p className="line-through text-gray-400 text-sm">₹{product.mrp}</p>
                <p className="text-lg font-bold text-orange-600">₹{product.price}</p>
              </div>

              {/* Button */}
              <button
                onClick={() => openProduct(product._id)}
                className="
                  w-full mt-3 py-2 bg-orange-500 text-white text-sm 
                  rounded-md hover:bg-orange-600 transition
                "
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
