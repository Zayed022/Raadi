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
      .get("https://raadi-jdun.onrender.com/api/v1/products/feature-products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log("Featured Product Fetch Error:", err));

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("https://raadi-jdun.onrender.com/api/v1/wishlist", {
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
        "https://raadi-jdun.onrender.com/api/v1/wishlist/remove",
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
        "https://raadi-jdun.onrender.com/api/v1/wishlist/add",
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
      <div className="text-center py-16 ">
  <h2 className="text-[36px] md:text-[42px] font tracking-wide text-[#0b1b3f]">
    Featured Products
  </h2>

  <p className="mt-4 text-[20px] md:text-[22px] font-medium text-[#1c2b4a]">
    Shop our newest arrivals and crowd favorites.
  </p>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {products.map((product) => (
          <div
          key={product._id}
          className="group bg-white rounded-2xl shadow-sm border border-gray-200
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300
          flex flex-col overflow-hidden"
        >
          {/* Image Section */}
          <div
            onClick={() => openProductDetails(product._id)}
            className="relative bg-[#f3f2f7] h-72 flex items-center justify-center overflow-hidden"
          >
            {/* Wishlist */}
            <button
              className="absolute top-4 right-4 z-20"
              onClick={(e) => {
                e.stopPropagation();
                handleWishlist(product._id);
              }}
            >
              {wishlist.includes(product._id) ? (
                <FaHeart size={22} className="text-orange-500" />
              ) : (
                <FiHeart
                  size={22}
                  className="text-gray-500 hover:text-orange-500 transition"
                />
              )}
            </button>
        
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
        
            {/* Hover Button */}
            <button
              className="absolute opacity-0 group-hover:opacity-100
              transition duration-300 bg-orange-500 text-white
              px-6 py-2 rounded-lg font-medium shadow-md"
              onClick={() => openProductDetails(product._id)}
            >
              View
            </button>
          </div>
        
          {/* Content Section */}
          <div className="flex flex-col flex-1 p-5">
        
            {/* Title */}
            <h3
              onClick={() => openProductDetails(product._id)}
              className="text-lg font-semibold text-[#0b1b3f] 
              line-clamp-2 hover:text-orange-600 transition cursor-pointer"
            >
              {product.name}
            </h3>
        
            {/* Description */}
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
        
            {/* Spacer */}
            <div className="flex-grow"></div>
        
            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              {product.mrp && (
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.mrp}
                </span>
              )}
              <span className="text-lg font-bold text-[#0b1b3f]">
                ₹{product.price}
              </span>
            </div>
          </div>
        </div>
        ))}
      </div>
    </section>
  );
}
