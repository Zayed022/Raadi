import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    axios
      .get("http://localhost:8000/api/v1/products/feature-products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log("Featured Product Fetch Error:", err));

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/wishlist", {
        withCredentials: true,
      });

      setWishlist(res.data.wishlist?.products?.map((p) => p._id) || []);
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    }
  };

  const handleWishlist = async (productId) => {
  try {
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      const res = await axios.delete(
        "http://localhost:8000/api/v1/wishlist/remove",
        {
          data: { productId },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setWishlist(wishlist.filter((id) => id !== productId));
      }
    } else {
      // Add to wishlist
      const res = await axios.post(
        "http://localhost:8000/api/v1/wishlist/add",
        { productId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setWishlist([...wishlist, productId]);
      }
    }
  } catch (err) {
    console.log("Wishlist Error:", err);
  }
};

  const openProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-center text-4xl font-bold text-[#0b1b3f]">
        Featured
      </h2>
      <p className="text-center text-gray-600 mt-2 mb-12">
        Shop our newest arrivals and crowd favorites.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {products.map((product) => (
          <div
            key={product._id}
            className="group cursor-pointer bg-white rounded-2xl shadow-md border border-gray-200
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-5 relative w-full h-[420px]"
          >
            {/* Wishlist Button */}
            <button
              className="absolute top-4 right-4 z-50 transition-all duration-300"
              onClick={() => handleWishlist(product._id)}
            >
              {wishlist.includes(product._id) ? (
                <FaHeart size={30} className="text-orange-500" />
              ) : (
                <FiHeart
                  size={30}
                  className="text-gray-600 hover:text-orange-500 hover:fill-orange-500 transition-all"
                />
              )}
            </button>

            <div
              onClick={() => openProductDetails(product._id)}
              className=" relative bg-[#f2f1f6] rounded-2xl p-6 h-72 flex items-center justify-center overflow-hidden"
            >
              <img
                src={product.images?.[0]}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                alt={product.name}
              />

              {/* Hover Overlay Button */}
    <button
      className="absolute inset-0 m-auto w-32 h-12 opacity-0 group-hover:opacity-100
      transition-all duration-300 bg-orange-400 text-white font-semibold rounded-xl
      flex items-center justify-center text-lg"
      onClick={() => openProductDetails(product._id)}
    >
      Open
    </button>
            </div>

            <h3
              onClick={() => openProductDetails(product._id)}
              className="text-[22px] mt-4 font-semibold text-[#0b1b3f] group-hover:text-orange-600 transition"
            >
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              {product.shortDescription}
            </p>

            <div className="flex items-center mt-2 gap-3">
              <p className="line-through text-gray-400">₹{product.mrp}</p>
              <p className="font-bold text-lg text-[#0b1b3f]">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
