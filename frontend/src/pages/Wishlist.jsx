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


  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-center text-4xl font-bold text-blue-900">
        Your Wishlist
      </h2>
      <p className="text-center text-gray-600 mt-2">
        Items you love and wish to buy later
      </p>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="text-center mt-20">
          <FaHeart size={80} className="mx-auto text-gray-300" />
          <h3 className="text-2xl mt-4 font-semibold text-gray-700">
            Your wishlist is empty
          </h3>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="relative group cursor-pointer bg-white rounded-xl p-6 shadow-md border border-gray-200
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Remove Button */}
              <button
                onClick={() => removeItem(product._id)}
                className="absolute top-4 right-4 z-50 bg-white shadow-md p-2 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                <FaTrash />
              </button>

              {/* Product Image */}
              <div
                onClick={() => openProduct(product._id)}
                className="bg-gray-100 rounded-xl px-6 py-8 flex justify-center items-center overflow-hidden relative"
              >
                <img
                  src={product.images?.[0]}
                  className="w-[180px] h-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                  alt={product.name}
                />
              </div>

              {/* Product Details */}
              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                {product.name}
              </h3>

              <div className="flex justify-center items-center gap-3">
                <p className="line-through text-gray-400 text-md">₹ {product.mrp}</p>
                <p className="text-xl font-bold text-orange-600">₹ {product.price}</p>
              </div>

              <button
                onClick={() => openProduct(product._id)}
                className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
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
