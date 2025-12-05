import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [categoryName]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://raadi.onrender.com/api/v1/products/category/${categoryName}`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Category products fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("https://raadi.onrender.com/api/v1/wishlist", {
        withCredentials: true,
      });

      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log("Wishlist Fetch Error:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete("https://raadi.onrender.com/api/v1/wishlist/remove", {
          data: { productId },
          withCredentials: true,
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          "https://raadi.onrender.com/api/v1/wishlist/add",
          { productId },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const openProduct = (id) => navigate(`/product/${id}`);

  // -----------------------------
  // ⭐ SKELETON LOADER COMPONENT
  // -----------------------------
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
      <div className="bg-gray-200 rounded-xl h-64 w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-10 capitalize">
        {categoryName} Products
      </h1>

      {/* -------------- LOADING SKELETON GRID -------------- */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {Array(8)
            .fill(0)
            .map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          No products found.
        </p>
      ) : (
        /* -------------- PRODUCT GRID -------------- */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => openProduct(p._id)}
            >
              <div className="relative bg-gray-100 rounded-xl p-5 h-64 flex items-center justify-center">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />

                {/* Wishlist Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p._id);
                  }}
                  className="absolute top-4 right-4"
                >
                  {wishlist.includes(p._id) ? (
                    <FaHeart size={26} className="text-orange-600" />
                  ) : (
                    <FiHeart
                      size={26}
                      className="text-gray-600 hover:text-orange-500"
                    />
                  )}
                </button>
              </div>

              <h3 className="font-semibold text-lg mt-4">{p.name}</h3>
              <p className="text-gray-400 line-through">₹{p.mrp}</p>
              <p className="text-xl font-bold text-orange-600">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
